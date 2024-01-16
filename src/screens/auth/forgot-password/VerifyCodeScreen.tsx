import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useMemo, useRef } from "react";
import { useTheme, useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
// import Recaptcha from "react-native-recaptcha-that-works";

import Button from "@shared-components/button/Button";
import createStyles from "./ForgotPasswordScreen.style";
import ViewTermPolicy from "../components/TermPolicyView";
import InputHook from "@shared-components/form/InputHookForm";
import { useForm } from "react-hook-form";
import { SCREENS } from "constants";
import { translations } from "@localization";
import GoBackButton from "../components/GoBackButton";
import IconSvg from "assets/svg";
import { verifyCode } from "@services/api/userApi";
import {
  closeSuperModal,
  showLoading,
  showErrorModal,
} from "@helpers/super.modal.helper";
import { IVerifyCode } from "models";

export default function VerifyCodeScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const route = useRoute();

  const emailRef = useRef(route.params?.["user_email"] || "");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      verifyCode: "",
    },
  });

  const styles = useMemo(() => createStyles(theme), [theme]);

  const onSubmit = (data: any) => {
    showLoading();
    const params: IVerifyCode = {
      user_email: emailRef.current,
      verify_code: data.verifyCode,
    };

    verifyCode(params).then((res) => {
      closeSuperModal();
      if (!res.isError) {
        NavigationService.push(SCREENS.NEW_PASSWORD, {
          verify_code: data.verifyCode,
          user_email: emailRef.current,
        });
      } else {
        showErrorModal(res);
      }
    });
    // navigation to screen otp
    // NavigationService.push(SCREENS.NEWPASSWORD);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "height" : undefined}
      >
        <View style={styles.container}>
          <GoBackButton />
          <View style={[{ alignItems: "center" }]}>
            <IconSvg name="logoIeltsHunter" width={120} height={67} />
          </View>

          <View>
            <Text style={styles.textHeader}>
              {translations.verifyCodeTitle(emailRef.current)}
            </Text>

            {/* code input */}
            <InputHook
              name="verifyCode"
              customStyle={{ flex: 1 }}
              inputProps={{
                type: "text",
                defaultValue: "",
                placeholder: translations.placeholderVerifyCode,
              }}
              control={control}
              iconLeft={
                <IconSvg name="icMail" size={16} color={colors.mainColor2} />
              }
              rules={{
                required: {
                  value: true,
                  message: translations.required,
                },
              }}
              errorTxt={errors.verifyCode?.message}
            />

            <Button
              style={styles.buttonMargin}
              onPress={handleSubmit(onSubmit)}
              textColor={colors.white}
              backgroundColor={colors.primary}
              text={translations.continue}
            />
          </View>
          <ViewTermPolicy style={{ paddingHorizontal: 20, marginTop: 36 }} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
