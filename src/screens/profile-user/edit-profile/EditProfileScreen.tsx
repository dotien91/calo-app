import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useTheme } from "@react-navigation/native";
import { useForm } from "react-hook-form";

import Header from "@shared-components/header/Header";
import InputHook from "@shared-components/form/InputHookForm";

import { isIos } from "@helpers/device.info.helper";
import { translations } from "@localization";
import CommonStyle from "@theme/styles";
import { phoneRegex, regexLink, regexMail } from "constants/regex.constant";
import Button from "@shared-components/button/Button";
import useStore from "@services/zustand/store";
import { updateProfile } from "@services/api/userApi";
import { showToast } from "@helpers/super.modal.helper";
import eventEmitter from "@services/event-emitter";

const EditProfileScreen = () => {
  const userData = useStore((store) => store.userData);
  const theme = useTheme();
  const { colors } = theme;
  const setUserData = useStore((store) => store.setUserData);
  const [updating, setUpdating] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: userData?.display_name,
      email: userData?.user_email || "",
      description: userData?.description || "",
      bio: userData?.bio || "",
      phoneNumber: userData?.phone_number || "",
      address: userData?.user_address || "",
      facebook: userData?.links?.[0]?.facebook || "",
      website: userData?.links?.[0]?.website || "",
      youtube: userData?.links?.[0]?.youtube || "",
    },
  });

  // console.log(userData);

  const onSubmit = (data: any) => {
    const params = {
      display_name: data.fullname,
      description: data.description,
      bio: data.bio,
      user_address: data.address,
      _id: userData._id,
      phone_number: data.phoneNumber,
      links: {
        facebook: data.facebook,
        website: data.website,
      },
    };
    setUpdating(true);
    updateProfile(params).then((res) => {
      if (!res.isError) {
        showToast({ type: "success", message: translations.updateSuccess });
        setUpdating(false);
        setUserData({
          ...userData,
          display_name: data.fullname,
          bio: data.bio,
          user_address: data.address,
          _id: userData._id,
          description: data.description,
          phone_number: data.phoneNumber,
          links: [
            {
              facebook: data.facebook,
              website: data.website,
            },
          ],
        });
        eventEmitter.emit("reload_list_post");
        NavigationService.goBack();
      } else {
        showToast({ type: "error", message: translations.somethingWentWrong });
        setUpdating(false);
      }
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={isIos() ? "height" : undefined}
    >
      <ScrollView style={CommonStyle.safeAreaView}>
        <Header
          iconNameLeft="arrow-back-outline"
          onPressLess={() => NavigationService.goBack()}
          text={translations.profile.editProfile}
        />
        <InputHook
          name="fullname"
          customStyle={CommonStyle.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
            placeholder: translations.fullname,
          }}
          control={control}
          rules={{
            required: {
              value: true,
              message: translations.required,
            },
          }}
          errorTxt={errors.fullname?.message}
        />

        <InputHook
          name="email"
          customStyle={CommonStyle.flex1}
          inputProps={{
            type: "email",
            defaultValue: "",
            placeholder: translations.placeholderEmail,
          }}
          control={control}
          rules={{
            required: {
              value: true,
              message: translations.required,
            },
            pattern: {
              value: regexMail,
              message: translations.error.invalidPhoneEmail,
            },
          }}
          errorTxt={errors.email?.message}
        />

        <InputHook
          name="description"
          customStyle={CommonStyle.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
            placeholder: translations.login.description,
          }}
          control={control}
          rules={{}}
          errorTxt={errors.description?.message}
        />

        <InputHook
          name="bio"
          customStyle={CommonStyle.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
            placeholder: translations.bio,
          }}
          control={control}
          rules={{}}
          errorTxt={errors.bio?.message}
        />

        <InputHook
          name="phoneNumber"
          customStyle={CommonStyle.flex1}
          inputProps={{
            type: "number",
            defaultValue: "",
            placeholder: translations.profile.phoneNumber,
          }}
          control={control}
          rules={{
            pattern: {
              value: phoneRegex,
              message: translations.error.invalidPhoneEmail,
            },
          }}
          errorTxt={errors.phoneNumber?.message}
        />

        <InputHook
          name="address"
          customStyle={CommonStyle.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
            placeholder: translations.profile.address,
          }}
          control={control}
          rules={{}}
        />

        <InputHook
          name="facebook"
          customStyle={CommonStyle.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
            placeholder: "Facebook",
          }}
          control={control}
          rules={{
            pattern: {
              value: regexLink,
              message: translations.error.invalidPhoneEmail,
            },
          }}
          errorTxt={errors.facebook?.message}
        />

        <InputHook
          name="website"
          customStyle={CommonStyle.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
            placeholder: "Website",
          }}
          control={control}
          rules={{
            pattern: {
              value: regexLink,
              message: translations.error.invalidPhoneEmail,
            },
          }}
          errorTxt={errors.website?.message}
        />

        <InputHook
          name="youtube"
          customStyle={CommonStyle.flex1}
          inputProps={{
            type: "text",
            defaultValue: "",
            placeholder: "Youtube",
          }}
          control={control}
          rules={{
            pattern: {
              value: regexLink,
              message: translations.error.invalidPhoneEmail,
            },
          }}
          errorTxt={errors.website?.message}
        />

        <Button
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            backgroundColor: updating ? colors.placeholder : colors.primary,
          }}
          text={translations.confirm}
          disabled={updating}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;
