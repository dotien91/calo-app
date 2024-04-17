import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
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

const CreateClubScreen = () => {
  const [updating, setUpdating] = useState(false);
  const { idVideo, renderSelectBackground, updatingVid } = SelectVideoHook({
    type: "photo",
    typeM: "photo",
    placeholder: translations.club.purchaseJoin,
  });
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
    console.log(updatingVid);
    if (!idVideo || idVideo === "") {
      showToast({ type: "error" });
      return;
    }
    const params = {
      name: data.name,
      avatar: idVideo,
      description: data.des,
    };
    createGroup(params).then((res) => {
      if (!res.isError) {
        console.log("res...", res.data);
        NavigationService.navigate(SCREENS.CLUB_HOME, { id: res.data._id });
      }
    });
    setUpdating(false);
  };

  const renderItem = (item, key) => {
    return (
      <TouchableOpacity
        key={key}
        // onPress={() => onPressBtnFilter(item)}
        style={styles.btnFilter}
      >
        <TextBase fontSize={16} fontWeight="500">
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
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.styleFilter}
          >
            {quickFilterCourse.map((item, index) => renderItem(item, index))}
          </ScrollView>
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
          <TextBase fontSize={16} fontWeight="700" title="Add image" />
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
    height: 28,

    backgroundColor: palette.grey,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  styleFilter: {
    marginTop: 8,
    flexDirection: "row",
    gap: 8,
  },
});
