import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";

import { ScreenWidth } from "@freakycoder/react-native-helpers";
import { translations } from "@localization";
import TextBase from "@shared-components/TextBase";
import Button from "@shared-components/button/Button";
import InputHook from "@shared-components/form/InputHookForm";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { EnumColors } from "models";
import { useForm } from "react-hook-form";
import { phoneRegex, regexEmail } from "constants/regex.constant";
import { requestEliteClub } from "@services/api/club.api";
import {
  closeSuperModal,
  showLoading,
  showToast,
} from "@helpers/super.modal.helper";
import { goBack } from "@helpers/navigation.helper";

const BecomEliteClub = () => {
  const [updating, setUpdating] = useState(false);
  const route = useRoute();
  const clubId = route.params?.["club_id"];

  const IconDotText = ({ text }: { text: string }) => {
    return (
      <View style={styles.viewIcon}>
        <View
          style={{
            paddingTop: 8,
          }}
        >
          <View
            style={{
              height: 8,
              width: 8,
              borderRadius: 10,
              backgroundColor: palette.textOpacity8,
            }}
          />
        </View>
        <TextBase
          fontSize={14}
          fontWeight="400"
          numberOfLines={2}
          color={EnumColors.textOpacity8}
        >
          {text}
        </TextBase>
      </View>
    );
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({
    defaultValues: {
      name: "",
      phone_number: "",
      email: "",
      job: "",
      position: "",
      company: "",
      address: "",
    },
  });

  const onSubmit = (data) => {
    showLoading();
    const params = {
      name: data.name,
      phone_number: data.phone_number,
      email: data.email,
      job: data.job,
      position: data.position,
      company: data.company,
      address: data.address,
      group_id: clubId,
    };
    requestEliteClub(params).then((res) => {
      closeSuperModal();
      setUpdating(false);
      if (!res.isError) {
        showToast({
          type: "success",
          message: translations.podcast.sendRequest,
        });
        goBack();
      } else {
        showToast({
          type: "error",
        });
      }
    });
    console.log("...", params);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={CS.flex1}
    >
      <SafeAreaView style={CS.safeAreaView}>
        <Header text={translations.club.becomeElite} />
        <ScrollView style={[CS.flex1]} showsVerticalScrollIndicator={false}>
          <View style={styles.viewDes}>
            <TextBase
              fontSize={16}
              fontWeight="700"
              title={translations.club.benefitsJoin}
            />
            <View style={styles.viewInfo}>
              <IconDotText text={translations.club.desBenefit1} />
              <IconDotText text={translations.club.desBenefit2} />
              <IconDotText text={translations.club.desBenefit3} />
            </View>
            <TextBase
              fontSize={16}
              fontWeight="700"
              title={translations.club.priceJoin}
            />
            <TextBase
              fontSize={16}
              fontWeight="400"
              title={translations.club.enterInfo}
            />
          </View>
          <View style={styles.topInfo}>
            <View style={styles.viewLeft}>
              <InputHook
                setFocus={setFocus}
                name="name"
                customStyle={CS.flex1}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  placeholder: translations.club.fullName,
                }}
                viewStyle={styles.viewStyleLeft}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: translations.required,
                  },
                }}
                errorTxt={errors.name?.message}
                maxLength={32}
                label={translations.club.fullName}
              />
            </View>
            <View style={styles.viewRight}>
              <InputHook
                setFocus={setFocus}
                name="phone_number"
                customStyle={CS.flex1}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  placeholder: translations.club.phoneNumber,
                }}
                viewStyle={styles.viewStyleRight}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: translations.required,
                  },
                  pattern: {
                    value: phoneRegex,
                    message: translations.error.invalidPhone,
                  },
                }}
                errorTxt={errors.phone_number?.message}
                maxLength={32}
                label={translations.club.phoneNumber}
              />
            </View>
          </View>
          <InputHook
            setFocus={setFocus}
            name="email"
            customStyle={CS.flex1}
            inputProps={{
              type: "text",
              defaultValue: "",
              placeholder: translations.login.email,
            }}
            viewStyle={styles.viewStyleRight}
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
            maxLength={32}
            label={translations.login.email}
          />
          <View style={styles.topInfo}>
            <View style={styles.viewLeft}>
              <InputHook
                setFocus={setFocus}
                name="job"
                customStyle={CS.flex1}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  placeholder: translations.club.profession,
                }}
                viewStyle={styles.viewStyleLeft}
                control={control}
                errorTxt={errors.job?.message}
                maxLength={32}
                label={translations.club.profession}
              />
            </View>
            <View style={styles.viewRight}>
              <InputHook
                setFocus={setFocus}
                name="position"
                customStyle={CS.flex1}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  placeholder: translations.club.position,
                }}
                viewStyle={styles.viewStyleRight}
                control={control}
                errorTxt={errors._position?.message}
                maxLength={32}
                showPlaceholder
              />
            </View>
          </View>
          <InputHook
            setFocus={setFocus}
            name="company"
            customStyle={CS.flex1}
            inputProps={{
              type: "text",
              defaultValue: "",
              placeholder: translations.club.business,
            }}
            control={control}
            errorTxt={errors._business?.message}
            maxLength={32}
            showPlaceholder
          />
          <InputHook
            setFocus={setFocus}
            name="address"
            customStyle={CS.flex1}
            inputProps={{
              type: "text",
              defaultValue: "",
              placeholder: translations.club.address,
            }}
            control={control}
            errorTxt={errors._address?.message}
            maxLength={32}
            showPlaceholder
          />
        </ScrollView>
        <View style={styles.viewButton}>
          <Button
            style={{
              backgroundColor: updating ? palette.placeholder : palette.primary,
            }}
            text={translations.club.submit}
            disabled={updating}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default BecomEliteClub;

const styles = StyleSheet.create({
  viewInfo: {
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
    marginRight: 16,
    marginLeft: 10,
  },
  viewIcon: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    gap: 10,
  },
  viewDes: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  viewButton: {
    marginHorizontal: 16,
    paddingTop: 16,
  },
  topInfo: {
    flexDirection: "row",
    width: ScreenWidth,
  },
  viewLeft: {
    flex: 1,
  },
  viewRight: {
    flex: 1,
  },
  viewStyleLeft: {
    marginRight: 4,
  },
  viewStyleRight: {
    marginLeft: 4,
  },
});
