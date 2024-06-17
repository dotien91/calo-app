/* eslint-disable camelcase */

import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme, useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import isEqual from "react-fast-compare";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import IconSvg from "assets/svg";
import createStyles from "./Post.style";
import HeaderPost from "./components/HeaderPost";
import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import { TypedCategory, TypedPost } from "shared/models";
import { isIos } from "@utils/device.ui.utils";
import { createNewPost, getCategory, updatePost } from "@services/api/post.api";
import { regexLink } from "constants/regex.constant";
import {
  closeSuperModal,
  showToast,
  showSuperModal,
  EnumModalContentType,
  EnumStyleModalType,
} from "@helpers/super.modal.helper";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import eventEmitter from "@services/event-emitter";
import CustomBackground from "@shared-components/CustomBackgroundBottomSheet";
import { SCREENS } from "constants";
import PressableBtn from "@shared-components/button/PressableBtn";
import useStore from "@services/zustand/store";
import Avatar from "@shared-components/user/Avatar";

export default function PostScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const route: any = useRoute();
  const item: TypedPost = route?.params?.item || {};
  const group_id = route?.params?.["group_id"];
  const isAdminClub = route?.params?.["isAdminClub"];

  const styles = useMemo(() => createStyles(theme), [theme]);
  const submitPostStatus = React.useRef("");
  const [postCategory, setPostCategory] = useState("");
  const [link, setLink] = useState("");
  const [listCategory, setListCategory] = useState<TypedCategory[]>([]);
  const userData = useStore((state) => state.userData);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const userMedia = useStore((state) => state.userMedia);

  const isTeacher =
    userData?.user_role === "teacher" || userData?.user_role === "admin";

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const [description, setDescription] = useState<string>(
    item.post_content || "",
  );
  const {
    onSelectFile,
    onSelectPicture,
    onSelectVideo,
    listFile,
    listFileLocal,
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
      group_id,
    });
  };

  useEffect(() => {
    getListCategory();
  }, []);

  const showLiveBtn = React.useMemo(() => {
    return isTeacher || isAdminClub;
  }, [isTeacher, isAdminClub]);

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
    showSuperModal({
      contentModalType: "loading",
      styleModalType: "middle",
    });
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
    if (group_id) {
      params.group_id = group_id;
    }

    if (item._id) {
      updatePost(params).then((res) => {
        if (!res.isError) {
          closeSuperModal();
          eventEmitter.emit("reload_list_post");
          showToast({ type: "success", message: translations.updateSuccess });
          NavigationService.popToTop();
        } else {
          closeSuperModal();
          showToast({
            type: "error",
            ...res,
          });
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
          showToast({
            type: "error",
            ...res,
          });
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
    onPress: () => void;
  }) => {
    return (
      <PressableBtn onPress={onPress} style={styles.stylePressableBtn}>
        {icon}
      </PressableBtn>
    );
  };

  const SelectComponentText = ({
    icon,
    text,
    onPress,
  }: {
    icon: React.JSX.Element;
    text: string;
    onPress: () => void;
  }) => {
    return (
      <PressableBtn onPress={onPress} style={styles.stylePressableBtn1}>
        <View
          style={{
            ...CommonStyle.center,
            width: 52,
          }}
        >
          {icon}
        </View>
        <View style={styles.styleTxtPressable}>
          <Text style={{ ...CommonStyle.hnMedium }}>{text}</Text>
        </View>
      </PressableBtn>
    );
  };

  const renderKeyboard = () => {
    return (
      <>
        {isKeyboardVisible ? (
          <View style={styles.styleViewKeyboard}>
            <SelectComponent
              icon={
                <IconSvg
                  size={32}
                  name="icCreatePostImage"
                  color={colors.green}
                />
              }
              onPress={onSelectPicture}
            />
            {showLiveBtn && (
              <SelectComponent
                icon={
                  <IconSvg size={32} name="icLive" color={colors.primary} />
                }
                onPress={onPressLive}
              />
            )}
            <SelectComponent
              icon={<IconSvg size={32} name="icFile" color={colors.blue} />}
              onPress={onSelectFile}
            />
            <SelectComponent
              icon={<IconSvg size={22} name="icVideo" color={colors.red} />}
              onPress={onSelectVideo}
            />
          </View>
        ) : (
          <View style={CommonStyle.center}>
            <SelectComponentText
              icon={
                <IconSvg
                  size={24}
                  name="icCreatePostImage"
                  color={colors.green}
                />
              }
              onPress={onSelectPicture}
              text={translations.selectImage1}
            />
            <SelectComponentText
              icon={<IconSvg size={20} name="icVideo" color={colors.red} />}
              onPress={onSelectVideo}
              text={translations.selectVideo}
            />
            {showLiveBtn && (
              <SelectComponentText
                icon={
                  <IconSvg size={24} name="icLive" color={colors.primary} />
                }
                onPress={onPressLive}
                text={translations.selectLive}
              />
            )}
            <SelectComponentText
              icon={<IconSvg size={24} name="icFile" color={colors.blue} />}
              onPress={onSelectFile}
              text={translations.selectFile}
            />
          </View>
        )}
      </>
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
      showSuperModal({
        contentModalType: EnumModalContentType.Confirm,
        styleModalType: EnumStyleModalType.Middle,
        data: {
          title: translations.cancelEdit,
          desc: translations.cancelEditDes,
          cb: () => NavigationService.goBack(),
        },
      });
    }
  };

  const visiblePost = useMemo(() => {
    return !!description.trim() || !!listFileLocal?.length;
  }, [listFileLocal, description]);

  const SelectRadio = ({ item, index }: any) => {
    const selected = item._id === postCategory;
    return (
      <View key={index} style={styles.viewBtn}>
        <View style={styles.border}>
          {selected && <View style={styles.selected} />}
        </View>
        <Text style={styles.txtLabel}>{item.category_content}</Text>
      </View>
    );
  };

  const TextIcon = ({ text, nameIcon }: { text: string; nameIcon: string }) => {
    return (
      <View
        style={{
          ...CommonStyle.flexCenter,
          gap: 8,
        }}
      >
        <Text style={styles.txtDes}>{text}</Text>
        <IconSvg name={nameIcon} size={16} />
      </View>
    );
  };

  const renderNameCategory = () => {
    return (
      <View style={styles.viewName}>
        <Text style={styles.txtName}>{userData?.display_name || ""}</Text>
        <PressableBtn onPress={openListCategory} style={styles.btnAction}>
          <View style={{ marginHorizontal: 8 }}>
            {postCategory ? (
              <TextIcon
                nameIcon="icSelectDown"
                text={
                  <Text style={styles.txtDes}>
                    {listCategory.length > 0
                      ? listCategory?.find((i) => i._id === postCategory)
                          ?.category_content || translations.postCategory
                      : translations.postCategory}
                  </Text>
                }
              />
            ) : (
              <TextIcon
                nameIcon="icSelectDown"
                text={translations.selectCategory}
              />
            )}
          </View>
        </PressableBtn>
      </View>
    );
  };
  return (
    <SafeAreaView style={CommonStyle.flex1}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={[styles.container]}>
          <KeyboardAvoidingView
            style={CommonStyle.flex1}
            behavior={isIos ? "padding" : undefined}
            keyboardVerticalOffset={isIos ? 0 : 0}
          >
            <HeaderPost
              onPressPost={onSubmit}
              visiblePost={visiblePost}
              pressGoBack={onGoBack}
              textPost={item._id ? translations.update : translations.post.post}
            />
            <View style={{ ...CommonStyle.flex1, paddingTop: 10 }}>
              <View style={styles.styleCardName}>
                <Avatar
                  style={styles.styleAvatar}
                  sourceUri={{ uri: userMedia?.user_avatar }}
                />
                {renderNameCategory()}
              </View>

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
                  maxLength={10000}
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
              <View style={styles.viewRenderFile}>
                {listFileLocal.length > 0 && (
                  <>
                    {renderFile()}
                    <Pressable style={styles.btnAdd} onPress={onSelectPicture}>
                      <IconSvg name="icAdd" size={32} color={colors.grey} />
                    </Pressable>
                  </>
                )}
              </View>
              {renderKeyboard()}
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
                      color: colors.black,
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
                      <PressableBtn
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
                        <SelectRadio item={i} />
                      </PressableBtn>
                    ))}
                  </BottomSheetScrollView>
                </View>
              </BottomSheet>
            )}
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
