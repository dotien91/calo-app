import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm } from "react-hook-form";
import React, { useMemo, useState, useRef } from "react";
import { useTheme, useRoute } from "@react-navigation/native";

import Button from "@shared-components/button/Button";
import createStyles from "./create.new.password.screen.style";
import ViewTermPolicy from "../components/TermPolicyView";
import InputHook from "@shared-components/form/InputHookForm";
import { translations } from "@localization";
import IconSvg from "assets/svg";
import GoBackButton from "../components/GoBackButton";
import { ILoginWithPass, ICreateNewPass } from "models";
import { createNewPass, loginWithPass } from "@services/api/user.api";
import {
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { RECAPCHA_KEY } from "constants/config.constant";
import { passRegex } from "constants/regex.constant";
import { getDeviceInfo } from "@helpers/device.info.helper";
import { useUserHook } from "@helpers/hooks/useUserHook";

export default function NewPasswordScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPassword: "",
      reNewPassword: "",
    },
  });
  const [showPass, setShowPass] = useState(false);
  const route = useRoute();
  const { handleLogin } = useUserHook();
  const verifyCodeRef = useRef(route.params?.["verify_code"]);
  const emailRef = useRef(route.params?.["user_email"]);

  const styles = useMemo(() => createStyles(theme), [theme]);
  const onSubmit = (data: any) => {
    showSuperModal({
      contentModalType: "loading",
      styleModalType: "middle",
    });
    const params: ICreateNewPass = {
      verify_code: verifyCodeRef.current,
      g_recaptcha: RECAPCHA_KEY,
      re_password: data.newPassword,
      user_password: data.reNewPassword,
    };
    createNewPass(params).then((res) => {
      if (!res.isError) {
        continueLoginWithPass(data.newPassword);
      } else {
        closeSuperModal();
        showToast({
          type: "error",
          ...res,
        });
      }
    });
  };

  const continueLoginWithPass = (password: string) => {
    const params: ILoginWithPass = {
      user_email: emailRef.current,
      user_password: password,
      ...getDeviceInfo(),
    };
    loginWithPass(params).then((res) => {
      closeSuperModal();
      if (!res.isError) {
        const user_token = res.headers["x-authorization"];
        handleLogin(user_token);
      } else {
        showToast({
          type: "error",
          ...res,
        });
      }
    });
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
            <Text style={styles.textHeader}>{translations.updatePassword}</Text>

            {/* new pass input */}
            <InputHook
              iconLeft={<IconSvg name="icLock" />}
              name="newPassword"
              customStyle={{ flex: 1 }}
              inputProps={{
                type: "text",
                defaultValue: "",
                placeholder: translations.enterNewPassword,
              }}
              control={control}
              rules={{
                required: true,
                pattern: {
                  value: passRegex,
                  message: translations.error.errorPatternPass,
                },
              }}
              isPassword={!showPass}
              iconRight={
                <IconSvg
                  onPress={() => setShowPass((showPass) => !showPass)}
                  name={showPass ? "icEye" : "icEyeCrossed"}
                />
              }
              errorTxt={errors.newPassword?.message}
            />

            {/* renew pass input */}
            <InputHook
              iconLeft={<IconSvg name="icLock" />}
              name="reNewPassword"
              customStyle={{ flex: 1 }}
              inputProps={{
                type: "text",
                defaultValue: "",
                placeholder: translations.confirmPassword,
              }}
              control={control}
              rules={{
                required: true,

                validate: (val: string) => {
                  if (watch("newPassword") != val) {
                    return translations.error.passDoesNotMatch;
                  }
                },
              }}
              isPassword={!showPass}
              iconRight={
                <IconSvg
                  onPress={() => setShowPass((showPass) => !showPass)}
                  name={showPass ? "icEye" : "icEyeCrossed"}
                />
              }
              errorTxt={errors.reNewPassword?.message}
            />
            <Button
              style={styles.buttonMargin}
              onPress={handleSubmit(onSubmit)}
              textColor={colors.white}
              backgroundColor={colors.primary}
              text={translations.save}
            />
          </View>
          <ViewTermPolicy style={{ paddingHorizontal: 20, marginTop: 36 }} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
