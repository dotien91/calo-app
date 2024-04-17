import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import { useForm } from "react-hook-form";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import Button from "@shared-components/button/Button";
import InputHook from "@shared-components/form/InputHookForm";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import SelectVideoHook from "@screens/course/course-create/components/select.video";
import { showToast } from "@helpers/super.modal.helper";
import { createGroup } from "@services/api/club.api";
import { SCREENS } from "constants";
import TextBase from "@shared-components/TextBase";
import { quickFilterCourse } from "constants/course.constant";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import PressableBtn from "@shared-components/button/PressableBtn";
import IconSvg from "assets/svg";
import { ScreenWidth } from "@freakycoder/react-native-helpers";

const CreateClubScreen = () => {
  const [updating, setUpdating] = useState(false);
  const { idVideo, renderSelectBackground, updatingVid, link } =
    SelectVideoHook({
      type: "photo",
      typeM: "photo",
      placeholder: translations.club.purchaseJoin,
    });
  const [selectType, setSelectType] = useState();
  const file = [];

  const {
    onSelectPicture,
    listFile,
    listFileLocal,
    renderFile2,
    isUpLoadingFile,
  } = useUploadFile(
    file.map(
      (i) =>
        ({
          uri: i.media_url,
          type: i.media_type,
          _id: i._id,
        } || []),
    ),
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({
    defaultValues: {
      name: "",
      // price: "",
      des: "",
    },
  });
  const onSubmit = (data) => {
    if (!idVideo || idVideo === "") {
      showToast({ type: "error" });
      return;
    }
    if (!selectType) {
      showToast({ type: "error", message: "Chưa chọn type" });
    }
    const params = {
      name: data.name,
      cover: link,
      description: data.des,
      isEliteClub: false,
      skills: selectType.id,
      featured_image: listFile.map((i) => i.uri),
    };
    console.log("params...", params);
    // createGroup(params).then((res) => {
    //   if (!res.isError) {
    //     console.log("res...", res.data);
    //     NavigationService.navigate(SCREENS.CLUB_HOME, { id: res.data._id });
    //   }
    // });
    setUpdating(false);
  };

  const renderItem = (item, key) => {
    const isSelected = item.id === selectType?.id;
    const onPressItem = () => {
      setSelectType(item);
    };
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
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.club.createClub} iconNameLeft="x" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
          maxLength={32}
          label={translations.club.clubName}
        />
        <View style={styles.viewCover}>{renderSelectBackground()}</View>
        <View style={styles.viewType}>
          <TextBase fontSize={16} fontWeight="700" title="Type of club" />
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
          maxLength={500}
          // showPlaceholder
          label={translations.club.description}
          multiline
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
            <PressableBtn style={styles.uploadImage} onPress={onSelectPicture}>
              <TextInput
                editable={false}
                placeholder={translations.club.addImage}
              />
            </PressableBtn>
          )}
        </View>
      </ScrollView>
      <View style={styles.viewBtn}>
        <Button
          style={{
            backgroundColor: updating ? palette.placeholder : palette.primary,
          }}
          text={translations.club.createClub}
          disabled={updating}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </SafeAreaView>
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
    marginBottom: getBottomSpace(),
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
  styleFilter: {
    marginTop: 8,
    flexDirection: "row",
    gap: 8,
  },
  wrapType: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 8,
  },
  uploadImage: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.borderColor,
    paddingHorizontal: 16,
    justifyContent: "center",
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
