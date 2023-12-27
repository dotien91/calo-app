/*eslint camelcase: ["error", {properties: "never"}]*/

import {
  View,
  Text,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTheme, useRoute } from "@react-navigation/native";
import { types, pick } from "react-native-document-picker";
import IconSvg from "assets/svg";
import createStyles from "./Post.style";
import HeaderPost from "./components/HeaderPost";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import { TypedCategory, TypedRequest } from "shared/models";
import { selectMedia } from "utils/helpers/file-helper";
import FileViewComponent from "./components/FileView";
import { isIos } from "utils/helpers/device-ui";
import {
  createNewPost,
  getCategory,
  uploadMultiFile,
  uploadMultiMedia,
} from "@services/api/post";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { regexLink } from "@shared-constants/regex";
import {
  closeSuperModal,
  showSuperModal,
  showLoading,
  showErrorModal,
} from "@helpers/SuperModalHelper";
import * as NavigationService from "react-navigation-helpers";

interface OptionsState {
  file: any[];
  postCategory: string;
  link: string;
}

export default function PostScreen() {
  const theme = useTheme();
  const route: any = useRoute();
  const { colors } = theme;
  const item: TypedRequest = route?.params?.item || {};

  const styles = useMemo(() => createStyles(theme), [theme]);

  const [options, setOptions] = useState<OptionsState>({
    file: (item.attach_files || []).map((i) => ({
      _id: i._id,
      thumbnail: i.media_thumbnail,
      uri: i.media_url,
      fileName: i.media_file_name,
      type: i.media_mime_type,
    })),
    postCategory: item?.post_category?._id || "",
    link: "",
  });

  const [listCategory, setListCategory] = useState<TypedCategory[]>([]);
  const [description, setDescription] = useState<string>("");
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

  const pressCategory = () => {
    Keyboard.dismiss();
    console.log("category...", listCategory);
    setTimeout(() => {
      refBottomSheet.current?.expand();
    }, 300);
  };

  const scrollViewRef = useRef<ScrollView>(null);
  const refBottomSheet = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["60%"], []);

  const onPressPicture = async () => {
    selectMedia({
      config: { mediaType: "photo", selectionLimit: 30 },
      callback: (images: any) => {
        if (!images?.[0]) {
          return;
        }
        const listImage = images.map((i: any) => ({
          uri: i.uri || "",
          fileName: i.name || "",
          type: i.type || "",
        }));
        setOptions((prev) => ({ ...prev, file: [...prev.file, ...listImage] }));
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd();
        }, 300);
      },
      croping: false,
    });
  };
  const onPressVideo = async () => {
    selectMedia({
      config: { mediaType: "video", selectionLimit: 30 },
      callback: (images: any) => {
        if (!images?.[0]) {
          return;
        }
        const listImage = images.map((i: any) => ({
          uri: i.uri || "",
          fileName: i.name || "",
          type: i.type || "",
        }));
        setOptions((prev) => ({ ...prev, file: [...prev.file, ...listImage] }));
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd();
        }, 300);
      },
      croping: false,
    });
  };
  const onPressFile = async () => {
    try {
      const pickerResult = await pick({
        presentationStyle: "fullScreen",
        type: [
          types.doc,
          types.docx,
          types.pdf,
          types.plainText,
          types.xls,
          types.xlsx,
          types.ppt,
          types.pptx,
        ],
      });

      if (pickerResult.length > 0) {
        const fileUp = pickerResult.reduce((list: any[], current) => {
          return options.file.find((i) => i.uri === current.uri)
            ? list
            : [...list, current];
        }, []);
        setOptions((prev) => ({
          ...prev,
          file: [
            ...prev.file,
            ...fileUp.map((i) => ({
              ...i,
              is_file: !i.type?.includes("image") && !i.type?.includes("video"),
            })),
          ],
        }));
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd();
        }, 300);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async () => {
    // show loading
    showLoading();
    let listAttackFile: string[] = [];

    const fileAlreadyUploaded = options.file
      .filter((i) => i._id)
      .map((i) => i._id);
    //upload multi media
    const listMedia = options.file.filter(
      (i) => (i.type.includes("image") || i.type.includes("video")) && !i._id,
    );

    if (listMedia.length > 0) {
      const res = await uploadMultiMedia(
        listMedia.map((i) => ({
          name:
            i.fileName ||
            i.name ||
            (i.uri || "")?.split("/")?.reverse()?.[0] ||
            "",
          uri: isIos ? i.uri?.replace("file://", "") : i.uri,
          type: i.type,
        })),
      );
      if (Array.isArray(res)) {
        listAttackFile = listAttackFile.concat(
          res.map((i: any) => i?.callback?._id),
        );
      } else {
        closeSuperModal();
        showErrorModal(res);
      }
    }

    // upload multi file
    const listFile = options.file.filter(
      (i) => !i.type.includes("image") && !i.type.includes("video") && !i._id,
    );
    if (listFile.length > 0) {
      const res = await uploadMultiFile(
        listFile.map((i) => ({
          name:
            i.fileName ||
            i.name ||
            (i.uri || "")?.split("/")?.reverse()?.[0] ||
            "",
          uri: isIos ? i.uri?.replace("file://", "") : i.uri,
          type: i.type,
        })),
      );
      console.log("resuploadMultiFile.post", JSON.stringify(res));
      if (Array.isArray(res)) {
        listAttackFile = listAttackFile.concat(
          res.map((i: any) => i?.callback?._id),
        );
      } else {
        closeSuperModal();
        showErrorModal(res);
      }
    }

    // create new request
    const params = await {
      post_title: "",
      post_content: description.trim(),
      post_category: options.postCategory || undefined,
      post_language: "en",
      attach_files: JSON.stringify([...fileAlreadyUploaded, ...listAttackFile]),
    };

    // console.log("params...", params);
    const res = await createNewPost(params);
    if (res) {
      closeSuperModal();
      showSuperModal({
        title: "Success",
        desc: "Thêm mới bài viết thành công",
      });
      NavigationService.goBack();
    }
  };

  const renderFile = useCallback(() => {
    return (
      <View style={styles.viewImage}>
        {options.file.slice(0, 4).map((item, index) => {
          if (index < 3)
            return (
              <FileViewComponent
                style={styles.viewFile}
                item={item}
                key={`option.file - ${index}`}
                onPressClear={() => onRemove(item.uri)}
              />
            );
          if (options.file.length >= 4) {
            return (
              <View
                style={[
                  styles.viewFile,
                  {
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: palette.borderColor,
                  },
                ]}
                key={`option.file - ${index}`}
              >
                <Text style={{ color: colors.textInput }}>
                  +{options.file.length - 3}
                </Text>
              </View>
            );
          }
          return;
        })}
      </View>
    );
  }, [options.file]); // eslint-disable-line react-hooks/exhaustive-deps
  const onRemove = (uri: string) => {
    setOptions((prev) => ({
      ...prev,
      file: prev.file.filter((i) => i.uri !== uri),
    }));
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
              onPress={pressCategory}
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
