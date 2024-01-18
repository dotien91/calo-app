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
import * as NavigationService from "react-navigation-helpers";
import isEqual from "react-fast-compare";

import IconSvg from "assets/svg";
import createStyles from "./Post.style";
import HeaderPost from "./components/HeaderPost";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import { TypedCategory, TypedRequest } from "shared/models";
import { isIos } from "@utils/device.ui.utils";
import { createNewPost, getCategory, updatePost } from "@services/api/post";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { regexLink } from "constants/regex.constant";
import {
  closeSuperModal,
  showLoading,
  showToast,
  showErrorModal,
  showConfirmSuperModal,
} from "@helpers/super.modal.helper";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import eventEmitter from "@services/event-emitter";
import CustomBackground from "@shared-components/CustomBackgroundBottomSheet";
import { SCREENS } from "constants";

export default function PostScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const route: any = useRoute();
  const item: TypedRequest = route?.params?.item || {};
  const styles = useMemo(() => createStyles(theme), [theme]);
  const submitPostStatus = React.useRef("");
  const [postCategory, setPostCategory] = useState("");
  const [link, setLink] = useState("");
  const [listCategory, setListCategory] = useState<TypedCategory[]>([]);
  const [description, setDescription] = useState<string>(
    item.post_content || "",
  );
  const {
    onPressFile,
    onSelectPicture,
    onSelectVideo,
    listFile,
    renderFile,
    isUpLoadingFile,
  } = useUploadFile(
    item?.attach_files?.map(
      (i) =>
        ({
          uri: i.media_url,
          type: i.media_type,
          _id: i._id,
        } || []),
    ),
  );
  const onPressLive = () => {
    NavigationService.navigate(SCREENS.LIVE_STREAM, {
      titleLive: description,
    });
  };

  useEffect(() => {
    getListCategory();
  }, []);

  //continue creating post ưhen file upload success
  React.useEffect(() => {
    if (
      submitPostStatus.current == "waitUploadFile" &&
      !isUpLoadingFile &&
      !!listFile?.length
    ) {
      submitPostStatus.current = "";
      onSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpLoadingFile, listFile]);

  useEffect(() => {
    const getLink: string = description.match(regexLink)?.[0] || "";
    setLink(getLink);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  const getListCategory = async () => {
    getCategory().then((res) => {
      if (!res.isError) {
        setListCategory(res.data);
        if (item) {
          setPostCategory(item.post_category?._id);
        } else {
          setPostCategory(res.data?.[0]?._id);
        }
      }
    });
  };

  const openListCategory = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      refBottomSheet.current?.expand();
    }, 300);
  };

  const refBottomSheet = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["60%"], []);

  const onSubmit = React.useCallback(() => {
    if (submitPostStatus.current == "waitUploadFile") return;
    showLoading();
    if (isUpLoadingFile) {
      //await upload file done
      submitPostStatus.current = "waitUploadFile";
      return;
    }
    const params = {
      post_title: "",
      post_content: description.trim(),
      post_category: postCategory,
      post_language: "en",
      attach_files: JSON.stringify(listFile.map((i) => i._id)),
      _id: item._id || "",
    };

    if (item._id) {
      updatePost(params).then((res) => {
        if (!res.isError) {
          closeSuperModal();
          eventEmitter.emit("reload_list_post");
          showToast({ type: "success", message: translations.updateSuccess });
          NavigationService.popToTop();
        } else {
          closeSuperModal();
          showErrorModal(res);
        }
      });
    } else {
      createNewPost(params).then((res) => {
        if (!res.isError) {
          eventEmitter.emit("reload_list_post");
          closeSuperModal();
          showToast({
            type: "success",
            message: translations.post.createPostSuccess,
          });
          NavigationService.goBack();
        } else {
          closeSuperModal();
          showErrorModal(res);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpLoadingFile, description, listFile, postCategory]);

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

  const beforeValue = {
    file: (item.attach_files || []).map((i) => ({
      _id: i._id,
      uri: i.media_url,
      type: i.media_mime_type,
    })),
    content: (item.post_content || "").trim(),
  };

  const onGoBack = () => {
    const afterValue = {
      content: description.trim(),
      file: listFile,
    };
    if (isEqual(beforeValue, afterValue)) {
      NavigationService.goBack();
    } else {
      showConfirmSuperModal({
        title: translations.cancelEdit,
        desc: translations.cancelEditDes,
        cb: () => NavigationService.goBack(),
      });
    }
  };

  const visiblePost = useMemo(() => {
    return !!description.trim() || !!listFile?.length;
  }, [listFile, description]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.container]}>
        <KeyboardAvoidingView
          style={CommonStyle.flex1}
          behavior={isIos ? "height" : undefined}
        >
          <HeaderPost
            onPressPost={onSubmit}
            visiblePost={visiblePost}
            pressGoBack={onGoBack}
            textPost={item._id ? translations.update : translations.post.post}
          />
          <View style={CommonStyle.flex1}>
            <Pressable
              onPress={openListCategory}
              style={{ paddingHorizontal: 20 }}
            >
              <Text
                style={{ ...CommonStyle.hnSemiBold, color: colors.primary }}
              >
                #
                {listCategory.length > 0
                  ? listCategory?.find((i) => i._id === postCategory)
                      ?.category_content || translations.postCategory
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
                maxLength={500}
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
                onPress={onSelectPicture}
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
                onPress={onSelectVideo}
              />
              <View style={{ width: 10 }} />
              <SelectComponent
                icon={
                  <IconSvg size={48} name="icLive" color={colors.mainColor2} />
                }
                onPress={onPressLive}
              />
            </View>
          </View>
          {listCategory.length > 0 && (
            <BottomSheet
              snapPoints={snapPoints}
              index={-1}
              enablePanDownToClose
              ref={refBottomSheet}
              style={{
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                backgroundColor: colors.background,
              }}
              backdropComponent={(props) => (
                <BottomSheetBackdrop
                  {...props}
                  disappearsOnIndex={-1}
                  appearsOnIndex={0}
                  pressBehavior={"close"}
                  opacity={0.1}
                />
              )}
              backgroundComponent={CustomBackground}
            >
              <View style={[{ paddingHorizontal: 16, ...CommonStyle.flex1 }]}>
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
                <BottomSheetScrollView
                  style={{
                    ...CommonStyle.flex1,
                    backgroundColor: colors.background,
                  }}
                >
                  {listCategory.map((i) => (
                    <Pressable
                      key={i._id}
                      style={
                        i._id === postCategory
                          ? styles.categorySelected
                          : styles.category
                      }
                      onPress={() => {
                        refBottomSheet.current?.close();
                        setPostCategory(i._id);
                      }}
                    >
                      <Text
                        style={{
                          ...CommonStyle.hnSemiBold,
                          fontSize: 16,
                          color: colors.primary,
                        }}
                      >{`#${i.category_content}`}</Text>
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
