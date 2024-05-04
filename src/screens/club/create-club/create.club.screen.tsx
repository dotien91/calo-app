import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm } from "react-hook-form";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import Button from "@shared-components/button/Button";
import InputHook from "@shared-components/form/InputHookForm";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import SelectVideoHook from "@screens/course/course-create/components/select.video";
import { showToast } from "@helpers/super.modal.helper";
import TextBase from "@shared-components/TextBase";
import { quickFilterCourse } from "constants/course.constant";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import PressableBtn from "@shared-components/button/PressableBtn";
import IconSvg from "assets/svg";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import {
  useRoute,
  useNavigation,
  StackActions,
} from "@react-navigation/native";
import {
  createGroup,
  getDetailGroup,
  updateGroup,
} from "@services/api/club.api";
import { SCREENS } from "constants";

const CreateClubScreen = () => {
  const navigation = useNavigation();
  const [updating, setUpdating] = useState(false);
  const {
    idVideo,
    renderSelectBackground,
    updatingVid,
    link,
    setMedia,
    onPressChangeMedia,
  } = SelectVideoHook({
    type: "photo",
    typeM: "photo",
    placeholder: translations.club.purchaseJoin,
  });

  const route = useRoute();

  const [selectType, setSelectType] = useState<string[]>([]);
  const club_id = route.params?.club_id || "";

  const detailClub = () => {
    getDetailGroup(club_id).then((res) => {
      // console.log("res...", res);
      if (!res.isError) {
        setMedia({
          link: res.data.cover,
          typeM: "photo",
          id: "1",
        });
        setListFileLocal(
          res.data.featured_image.map((i, index) => ({
            uri: i,
            type: "image/jpg",
            _id: index,
          })),
        );
        setListFile(
          res.data.featured_image.map((i, index) => ({
            uri: i,
            type: "image/jpg",
            _id: index,
          })),
        );
        setValue("name", res.data.name);
        setValue("des", res.data.description);
        setValue("location", res.data?.location || "");
        setSelectType(res.data.skills);
      }
    });
  };

  useEffect(() => {
    detailClub();
  }, []);

  const {
    onSelectPicture,
    listFile,
    listFileLocal,
    renderFile2,
    isUpLoadingFile,
    setListFileLocal,
    setListFile,
  } = useUploadFile([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      // price: "",
      des: "",
      location: "",
    },
  });
  const onSubmit = (data) => {
    if (!idVideo || idVideo === "") {
      showToast({
        type: "error",
        message: translations.club.warningSelectImage,
      });
      return;
    }
    if (selectType.length == 0) {
      showToast({
        type: "error",
        message: translations.club.warningSelectType,
      });
      return;
    }
    const params = {
      name: data.name,
      cover: link,
      description: data.des,
      isEliteClub: false,
      skills: selectType,
      featured_image: listFile.map((i) => i.uri),
      location: data.location,
    };
    if (club_id) {
      params._id = club_id;
      updateGroup(params).then((res) => {
        if (!res.isError) {
          showToast({
            type: "success",
            message: translations.club.updateClubSuccess,
          });
          NavigationService.goBack();
        } else {
          showToast({
            type: "error",
            message: translations.club.updateClubFaild,
          });
        }
      });
    } else {
      createGroup(params).then((res) => {
        if (!res.isError) {
          showToast({
            type: "success",
            message: translations.club.createClubSuccess,
          });
          navigation.dispatch(
            StackActions.replace(SCREENS.CLUB_HOME, {
              id: res.data._id,
              name: data?.name,
            }),
          );
        } else {
          showToast({
            type: "error",
            message: translations.club.createClubFaild,
          });
        }
      });
    }
    setUpdating(false);
  };

  const renderItem = (item, key) => {
    // const isSelected = item.id === selectType?.id;
    const isSelected = [...selectType]?.findIndex((i) => i === item.id) >= 0;
    // const _onSelectSkill = () => {};
    const onPressItem = () => {
      // console.log("item...", item);
      // setSelectType(item);
      if (isSelected) {
        setSelectType((selectType) => selectType?.filter((i) => i !== item.id));
      } else {
        setSelectType([...selectType, item.id]);
      }
    };
    if (item.id === "All skills") {
      return null;
    }
    return (
      <TouchableOpacity
        key={key}
        onPress={onPressItem}
        style={isSelected ? styles.btnFilterSelected : styles.btnFilter}
      >
        <TextBase
          fontSize={16}
          fontWeight="500"
          color={isSelected ? "white" : "text"}
        >
          {item.name}
        </TextBase>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "height" : undefined}
    >
      <SafeAreaView style={CS.safeAreaView}>
        <Header
          text={
            club_id
              ? translations.club.updateClub
              : translations.club.createClub
          }
          iconNameLeft="x"
        />

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <InputHook
            setFocus={setFocus}
            name="name"
            customStyle={CS.flex1}
            inputProps={{
              type: "text",
              defaultValue: "",
              placeholder: translations.club.nameYourClub,
            }}
            control={control}
            rules={{
              required: {
                value: true,
                message: translations.required,
              },
            }}
            errorTxt={errors.name?.message}
            maxLength={200}
            label={translations.club.clubName}
          />
          <View style={styles.viewType}>
            <TextBase
              fontSize={16}
              fontWeight="700"
              title={translations.club.addCover}
            />
          </View>
          {link || updatingVid ? (
            <View style={styles.viewCover}>{renderSelectBackground()}</View>
          ) : (
            <PressableBtn
              style={styles.uploadCover}
              onPress={onPressChangeMedia}
            >
              <TextInput
                onPressIn={onPressChangeMedia}
                editable={false}
                placeholder={translations.club.addImage}
                style={CS.flex1}
              />
              <IconSvg name="icImage" size={24} color={palette.textOpacity6} />
            </PressableBtn>
          )}
          <View style={styles.viewType}>
            <TextBase
              fontSize={16}
              fontWeight="700"
              title={translations.club.clubOfTyoe}
            />
            <View style={styles.wrapType}>
              {quickFilterCourse.map((item, index) => renderItem(item, index))}
            </View>
            {/* quickFilterCourse */}
          </View>
          <InputHook
            setFocus={setFocus}
            name="des"
            customStyle={CS.flex1}
            inputProps={{
              type: "text",
              defaultValue: "",
              placeholder: translations.club.writeSomethingClub,
            }}
            control={control}
            rules={{}}
            errorTxt={errors.des?.message}
            maxLength={10000}
            // showPlaceholder
            label={translations.club.description}
            multiline
          />
          <InputHook
            setFocus={setFocus}
            name="location"
            customStyle={CS.flex1}
            inputProps={{
              type: "text",
              defaultValue: "",
              placeholder: translations.club.location,
            }}
            control={control}
            rules={{}}
            errorTxt={errors.des?.message}
            maxLength={200}
            showPlaceholder
            // label={translations.club.description}
            // multiline
          />
          <View style={styles.viewType}>
            <TextBase
              fontSize={16}
              fontWeight="700"
              title={translations.club.addImage}
            />
            {listFileLocal.length > 0 ? (
              <>
                <View style={styles.viewRenderFile}>
                  {renderFile2()}
                  <PressableBtn style={styles.btnAdd} onPress={onSelectPicture}>
                    <IconSvg
                      name="icAdd"
                      size={32}
                      color={palette.textOpacity8}
                    />
                  </PressableBtn>
                </View>
              </>
            ) : (
              <PressableBtn
                style={styles.uploadImage}
                onPress={onSelectPicture}
              >
                <TextInput
                  onPressIn={onSelectPicture}
                  editable={false}
                  placeholder={translations.club.addImage}
                  style={CS.flex1}
                />
                <IconSvg
                  name="icImage"
                  size={24}
                  color={palette.textOpacity6}
                />
              </PressableBtn>
            )}
          </View>
        </ScrollView>
        <View style={styles.viewBtn}>
          <Button
            style={{
              backgroundColor:
                updating || updatingVid || isUpLoadingFile
                  ? palette.placeholder
                  : palette.primary,
            }}
            text={
              club_id
                ? translations.club.updateClub
                : translations.club.createClub
            }
            disabled={updating || updatingVid || isUpLoadingFile}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default CreateClubScreen;

const styles = StyleSheet.create({
  container: {
    ...CS.flex1,
  },
  viewBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  viewCover: {
    marginTop: 10,
    marginBottom: 5,
  },
  viewType: {
    marginTop: 8,
    marginHorizontal: 16,
    flex: 1,
  },
  btnFilter: {
    backgroundColor: palette.grey,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  btnFilterSelected: {
    backgroundColor: palette.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  // styleFilter: {
  //   marginTop: 8,
  //   flexDirection: "row",
  //   gap: 8,
  // },
  wrapType: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  uploadImage: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.borderColor,
    paddingHorizontal: 16,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  uploadCover: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.borderColor,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  btnAdd: {
    ...CS.center,
    width: (ScreenWidth - 30 - 30) / 5,
    height: (ScreenWidth - 30 - 30) / 5,
    backgroundColor: palette.grey,
    borderRadius: 8,
    marginLeft: 8,
    marginTop: -16,
  },
  viewRenderFile: {
    ...CS.flexStart,
  },
});
