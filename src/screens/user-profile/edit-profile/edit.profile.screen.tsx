import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useTheme, useRoute } from "@react-navigation/native";
import { useForm } from "react-hook-form";

import Header from "@shared-components/header/Header";
import InputHook from "@shared-components/form/InputHookForm";

import { translations } from "@localization";
import CommonStyle from "@theme/styles";
import {
  phoneRegex,
  regexEmail,
  regexFB,
  regexLink,
  regexYoutubeChannel,
} from "constants/regex.constant";
import Button from "@shared-components/button/Button";
import useStore from "@services/zustand/store";
import { updateProfile } from "@services/api/user.api";
import { showToast } from "@helpers/super.modal.helper";
import eventEmitter from "@services/event-emitter";
import { palette } from "@theme/themes";
import TextBase from "@shared-components/TextBase";
import CreateSubscriptionBtn from "../component/CreateSubscriptionBtn";

const EditProfileScreen = () => {
  const userData = useStore((store) => store.userData);
  // console.log("userData...", userData);
  const theme = useTheme();
  const { colors } = theme;
  const setUserData = useStore((store) => store.setUserData);
  const [updating, setUpdating] = useState(false);
  const route = useRoute();
  const bio = route.params?.["bio"];
  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
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

  useEffect(() => {
    if (bio) {
      setFocus("bio");
    } else {
      setFocus("fullname");
    }
  }, [bio, setFocus]);

  const onSubmit = (data) => {
    const params = {
      display_name: data.fullname,
      description: data.description,
      bio: data.bio,
      user_address: data.address,
      _id: userData?._id,
      phone_number: data.phoneNumber,
      links: {
        facebook: data.facebook,
        website: data.website,
        youtube: data.youtube,
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
          _id: userData?._id,
          description: data.description,
          phone_number: data.phoneNumber,
          links: [
            {
              facebook: data.facebook,
              website: data.website,
              youtube: data.youtube,
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
      behavior={Platform.OS === "ios" ? "height" : undefined}
      style={CommonStyle.flex1}
    >
      <SafeAreaView style={CommonStyle.safeAreaView}>
        <Header
          onPressLeft={() => NavigationService.goBack()}
          text={translations.profile.editProfile}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <CreateSubscriptionBtn />
          <InputHook
            setFocus={setFocus}
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
            maxLength={32}
            showPlaceholder
          />

          <InputHook
            setFocus={setFocus}
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
                value: regexEmail,
                message: translations.error.invalidEmail,
              },
            }}
            errorTxt={errors.email?.message}
            showPlaceholder
          />

          <InputHook
            setFocus={setFocus}
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
            showPlaceholder
            multiline
          />

          <InputHook
            setFocus={setFocus}
            name="bio"
            customStyle={CommonStyle.flex1}
            inputProps={{
              type: "text",
              defaultValue: "",
              placeholder: translations.bio,
            }}
            control={control}
            rules={{}}
            maxLength={256}
            errorTxt={errors.bio?.message}
            showPlaceholder
            multiline
          />

          <InputHook
            setFocus={setFocus}
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
                message: translations.error.invalidPhone,
              },
            }}
            errorTxt={errors.phoneNumber?.message}
            showPlaceholder
          />

          <InputHook
            setFocus={setFocus}
            name="address"
            customStyle={CommonStyle.flex1}
            inputProps={{
              type: "text",
              defaultValue: "",
              placeholder: translations.profile.address,
            }}
            control={control}
            rules={{}}
            showPlaceholder
          />

          <InputHook
            setFocus={setFocus}
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
                value: regexFB,
                message: translations.error.invalidFacebook,
              },
            }}
            errorTxt={errors.facebook?.message}
            showPlaceholder
          />

          <InputHook
            setFocus={setFocus}
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
                message: translations.error.invalidLink,
              },
            }}
            errorTxt={errors.website?.message}
            showPlaceholder
          />

          <InputHook
            setFocus={setFocus}
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
                value: regexYoutubeChannel,
                message: translations.error.invalidYoutube,
              },
            }}
            maxLength={100}
            errorTxt={errors.youtube?.message}
            showPlaceholder
          />
          <View style={{ height: 100 }} />
        </ScrollView>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            padding: 16,
            ...CommonStyle.borderTopStyle,
            backgroundColor: palette.white,
          }}
        >
          <Button
            style={{
              backgroundColor: updating ? colors.placeholder : colors.primary,
              marginBottom: 16,
            }}
            text={translations.profile.saveProfile}
            disabled={updating}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;
