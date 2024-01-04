/* eslint-disable camelcase */

import {
  View,
  Text,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme, useRoute } from "@react-navigation/native";
import IconSvg from "assets/svg";
import createStyles from "./Post.style";
import HeaderPost from "./components/HeaderPost";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import { TypedCategory, TypedRequest } from "shared/models";
import { isIos } from "utils/helpers/device-ui";
import { createNewPost, getCategory, updatePost } from "@services/api/post";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { regexLink } from "@shared-constants/regex";
import {
  closeSuperModal,
  showSuperModal,
  showLoading,
} from "@helpers/SuperModalHelper";
import * as NavigationService from "react-navigation-helpers";
import { UploadFile } from "@shared-components/UploadFile";

interface OptionsState {
  postCategory: string;
  link: string;
}

export default function PostScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const route: any = useRoute();
  const item: TypedRequest = route?.params?.item || {};
  console.log("item...", JSON.stringify(item));
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [options, setOptions] = useState<OptionsState>({
    postCategory: item?.post_category?._id || "",
    link: "",
  });
  const { onPressFile, onPressPicture, onPressVideo, listFile, renderFile } =
    UploadFile(
      item?.attach_files?.map(
        (i) =>
          ({
            uri: i.media_url,
            type: i.media_type,
            _id: i._id,
          } || []),
      ),
    );

  const [listCategory, setListCategory] = useState<TypedCategory[]>([]);
  const [description, setDescription] = useState<string>(
    item.post_content || "",
  );
  const [link, setLink] = useState("");
  const getListCategory = async () => {
    const data = await getCategory();
    setListCategory(data);
    if (data[0]._id) {
      setOptions((prev) => ({
        ...prev,
        postCategory: data[0]._id,
      }));
    }
  };

  useEffect(() => {
    // gan
    const getLink: string = description.match(regexLink)?.[0] || "";
    setLink(getLink);
  }, [description]);

  useEffect(() => {
    getListCategory();
  }, []);

  const openListCategory = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      refBottomSheet.current?.expand();
    }, 300);
  };

  const refBottomSheet = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["60%"], []);

  const onSubmit = async () => {
    showLoading();

    const params = await {
      post_title: "",
      post_content: description.trim(),
      post_category: options.postCategory || undefined,
      post_language: "en",
      attach_files: JSON.stringify(listFile.map((i) => i._id)),
      _id: item._id || "",
    };

    if (item._id) {
      const res = await updatePost(params);
      console.log("res...", res);
      if (res) {
        closeSuperModal();
        showSuperModal({
          title: "Success",
          desc: translations.updateSuccess,
        });
        NavigationService.goBack();
      }
    } else {
      const res = await createNewPost(params);
      if (res) {
        closeSuperModal();
        showSuperModal({
          title: "Success",
          desc: translations.post.createPostSuccess,
        });
        NavigationService.goBack();
      }
    }
  };

  const SelectComponent = ({
    icon,
    onPress,
  }: {
    icon: React.JSX.Element;
    onPress?: () => void;
  }) => {
    return (
      <Pressable
        onPress={onPress}
        style={{
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon}
      </Pressable>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.container]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={isIos ? "height" : undefined}
        >
          <HeaderPost
            onPressPost={onSubmit}
            visiblePost={description.trim() != ""}
          />
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={openListCategory}
              style={{ paddingHorizontal: 20 }}
            >
              <Text
                style={{ ...CommonStyle.hnSemiBold, color: colors.primary }}
              >
                #
                {listCategory.length > 0
                  ? listCategory?.find((i) => i._id === options.postCategory)
                      ?.category_title || translations.postCategory
                  : translations.postCategory}
              </Text>
            </Pressable>

            <View
              style={[
                CommonStyle.flex1,
                { alignItems: "flex-start", justifyContent: "flex-start" },
              ]}
            >
              <TextInput
                style={[styles.inputDescription]}
                placeholder={translations.placeholderContent}
                value={description}
                onChangeText={setDescription}
                multiline
                placeholderTextColor={colors.placeholder}
              />
            </View>
            {link != "" && (
              <View style={styles.viewContainerLink}>
                <View style={styles.viewIconLink}>
                  <IconSvg name="icLink" color={colors.mainColor2} />
                </View>
                <Text style={styles.textLink} numberOfLines={1}>
                  {link}
                </Text>
              </View>
            )}
            <View style={{ paddingBottom: 20 }}>{renderFile()}</View>
            <View
              style={{
                flexDirection: "row",
                height: 40,
                borderTopWidth: 1,
                alignItems: "center",
                borderColor: palette.borderColor,
              }}
            >
              <SelectComponent
                icon={
                  <IconSvg
                    size={24}
                    name="icCreatePostImage"
                    color={colors.mainColor2}
                  />
                }
                onPress={onPressPicture}
              />
              <SelectComponent
                icon={
                  <IconSvg size={24} name="icFile" color={colors.mainColor2} />
                }
                onPress={onPressFile}
              />
              <SelectComponent
                icon={
                  <IconSvg size={24} name="icVideo" color={colors.mainColor2} />
                }
                onPress={onPressVideo}
              />
            </View>
          </View>
          {listCategory.length > 0 && (
            <BottomSheet
              snapPoints={snapPoints}
              index={-1}
              enablePanDownToClose
              ref={refBottomSheet}
              style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
              backdropComponent={(props) => (
                <BottomSheetBackdrop
                  {...props}
                  disappearsOnIndex={-1}
                  appearsOnIndex={0}
                  pressBehavior={"close"}
                  opacity={0.1}
                />
              )}
            >
              <View style={[{ paddingHorizontal: 16, flex: 1 }]}>
                <Text
                  style={{
                    ...CommonStyle.hnSemiBold,
                    textAlign: "center",
                    fontSize: 20,
                    color: colors.primary,
                  }}
                >
                  {translations.postCategory}
                </Text>
                <BottomSheetScrollView style={{ flex: 1 }}>
                  {listCategory.map((i) => (
                    <Pressable
                      key={i._id}
                      style={
                        i._id === options.postCategory
                          ? styles.categorySelected
                          : styles.category
                      }
                      onPress={() => {
                        refBottomSheet.current?.close();
                        setOptions((prev) => ({
                          ...prev,
                          postCategory: i._id,
                        }));
                      }}
                    >
                      <Text
                        style={{
                          ...CommonStyle.hnSemiBold,
                          fontSize: 16,
                          color: colors.primary,
                        }}
                      >{`#${i.category_title}`}</Text>
                    </Pressable>
                  ))}
                </BottomSheetScrollView>
              </View>
            </BottomSheet>
          )}
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}
