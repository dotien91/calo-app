import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
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

const CreateClubScreen = () => {
  const [updating, setUpdating] = useState(false);
  const { idVideo, renderSelectVideo, updatingVid } = SelectVideoHook({
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

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.club.createClub} iconNameLeft="x" />
      <ScrollView style={CS.flex1} showsVerticalScrollIndicator={false}>
        <View>{renderSelectVideo()}</View>
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
        {/* <InputHook
          setFocus={setFocus}
          name="price"
          customStyle={CS.flex1}
          inputProps={{
            type: "number",
            defaultValue: "",
            placeholder: translations.club.chooseYourClubPrice,
          }}
          control={control}
          rules={{
            required: {
              value: true,
              message: translations.required,
            },
          }}
          errorTxt={errors.price?.message}
          maxLength={32}
          label={translations.club.clubPrice}
        /> */}
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
          maxLength={32}
          // showPlaceholder
          label={translations.club.description}
          multiline
        />
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
  viewBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: getBottomSpace(),
  },
});
