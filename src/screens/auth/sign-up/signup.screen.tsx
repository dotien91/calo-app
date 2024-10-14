import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import CommonStyle from "@theme/styles";
import Button from "@shared-components/button/Button";
import createStyles from "./signup.screen.style";
import OrView from "../components/OrView";
import InputHook from "@shared-components/form/InputHookForm";
import { useForm } from "react-hook-form";
import { translations } from "@localization";
import IconSvg from "assets/svg";
import { regexMail, passRegex } from "constants/regex.constant";
import { ISignUpWithEmail } from "models";
import { getDeviceInfo } from "@helpers/device.info.helper";
import { singUp } from "@services/api/user.api";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { useUserHook } from "@helpers/hooks/useUserHook";
import GoogleLoginButton from "@shared-components/button/GoogleLoginButton";
import AppleLoginButton from "@shared-components/button/AppleLoginButton";
import FBLoginButton from "@shared-components/button/FBLoginButton";
import { SCREENS } from "constants";
import TermPolicyView from "../components/TermPolicyView";

// interface ButtonSocialProps {
//   onPress: () => void;
//   IconSocial: React.JSX.Element;
// }

export default function SignUpScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const [useMailRegex, setUseMailRegex] = useState(false);
  const { handleLogin } = useUserHook();

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      repassword: "",
    },
  });

  React.useEffect(() => {
    const value = watch("email") || " ";
    const isEmailValue = !Number(value);
    if (isEmailValue != useMailRegex) {
      setUseMailRegex((old) => !old);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("email")]);

  const [showPass, setShowPass] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);
  const onSubmit = (data: any) => {
    showSuperModal({
      contentModalType: EnumModalContentType.Loading,
      styleModalType: EnumStyleModalType.Middle,
    });
    const params: ISignUpWithEmail = {
      full_name: data.fullname,
      user_email: data.email,
      re_password: data.password,
      user_password: data.password,
      ...getDeviceInfo(),
    };
    singUp(params).then((res) => {
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

  const pressLoginNow = () => {
    NavigationService.navigate(SCREENS.LOGIN_WITH_EMAIL);
  };

  return (
    <SafeAreaView style={CommonStyle.safeAreaView}>
      {/* <Header /> */}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "height" : undefined}
        >
          <View style={styles.container}>
            <View style={[{ alignItems: "center" }]}>
              <IconSvg
                name="logoIeltsHunter"
                width={108}
                height={95}
                color={colors.primary}
              />
            </View>
            <View>
              <Text style={styles.textHeader}>
                {translations.createNewAccount}
              </Text>

              {/* fullname input */}
              <InputHook
                iconLeft={
                  <IconSvg name="icLoginFullname" color={colors.textOpacity6} />
                }
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
                showPlaceholder
              />

              {/* email input */}
              <InputHook
                iconLeft={<IconSvg name="icMail" color={colors.textOpacity6} />}
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
                showPlaceholder
              />

              {/* pass input */}
              <InputHook
                iconLeft={<IconSvg name="icLock" color={colors.textOpacity6} />}
                name="password"
                customStyle={{}}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  placeholder: translations.placeholderPasword,
                }}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: translations.required,
                  },
                  minLength: {
                    value: 8,
                    message: translations.error.minLengthPass,
                  },
                  pattern: {
                    value: passRegex,
                    message: translations.error.errorPatternPass,
                  },
                }}
                isPassword={!showPass}
                iconRight={
                  <IconSvg
                    onPress={() => {
                      setShowPass((showPass) => !showPass);
                    }}
                    name={showPass ? "icEye" : "icEyeCrossed"}
                  />
                }
                errorTxt={errors.password?.message}
                showPlaceholder
              />
              <InputHook
                iconLeft={<IconSvg name="icLock" color={colors.textOpacity6} />}
                name="repassword"
                customStyle={{}}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  placeholder: translations.placeholderRePasword,
                }}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: translations.required,
                  },
                  minLength: {
                    value: 8,
                    message: translations.error.minLengthPass,
                  },
                }}
                isPassword={!showPass}
                iconRight={
                  <IconSvg
                    onPress={() => {
                      setShowPass((showPass) => !showPass);
                    }}
                    name={showPass ? "icEye" : "icEyeCrossed"}
                  />
                }
                errorTxt={errors.repassword?.message}
                showPlaceholder
              />
              <View style={styles.paddingButton}>
                <Button
                  style={styles.buttonMargin}
                  onPress={handleSubmit(onSubmit)}
                  textColor={colors.white}
                  backgroundColor={colors.primary}
                  text={translations.signUp}
                />
              </View>
              <OrView />
              <View style={styles.viewSocial}>
                <AppleLoginButton />
                <GoogleLoginButton />
                <FBLoginButton />
              </View>
              <TermPolicyView
                style={{ paddingHorizontal: 20, marginTop: 36 }}
              />
              <Text style={styles.textRegister}>
                {translations.haveAnAccount}
                <Text
                  style={[
                    CommonStyle.hnSemiBold,
                    { color: colors.primary, textDecorationLine: "underline" },
                  ]}
                  onPress={pressLoginNow}
                >
                  {translations.loginNow}
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
