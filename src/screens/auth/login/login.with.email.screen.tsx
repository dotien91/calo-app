import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import CommonStyle from "@theme/styles";
import Button from "@shared-components/button/Button";
import IconSvg from "assets/svg";
import createStyles from "./login.with.email.screen.style";
import ViewTermPolicy from "../components/TermPolicyView";
import OrView from "../components/OrView";
import InputHook from "@shared-components/form/InputHookForm";
import { useForm } from "react-hook-form";
import { SCREENS } from "constants";
import { translations } from "@localization";
import GoBackButton from "../components/GoBackButton";
import { getDeviceInfo } from "@helpers/device.info.helper";
import { loginWithPass } from "@services/api/user.api";
import {
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { ILoginWithPass } from "models";
import GoogleLoginButton from "@shared-components/button/GoogleLoginButton";
import FBLoginButton from "@shared-components/button/FBLoginButton";
import { useUserHook } from "@helpers/hooks/useUserHook";
import AppleLoginButton from "@shared-components/button/AppleLoginButton";
// import { regexMail } from "constants/regex.constant";

// interface ButtonSocialProps {
//   onPress: () => void;
//   IconSocial: React.JSX.Element;
// }

export default function LoginWithEmailScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const { handleLogin } = useUserHook();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPass, setShowPass] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);
  const onSubmit = (data: any) => {
    showSuperModal({
      contentModalType: "loading",
      styleModalType: "middle",
    });
    const params: ILoginWithPass = {
      user_email: data.email,
      user_password: data.password,
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

    // loginWithPass
  };

  const pressRegister = () => {
    NavigationService.push(SCREENS.SIGN_UP);
  };

  const pressForgotPassword = () => {
    NavigationService.push(SCREENS.FORGOT_PASSWORD);
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
            <Text style={styles.textHeader}>{translations.welcomeBack}</Text>

            {/* email input */}
            <InputHook
              name="email"
              customStyle={{ flex: 1 }}
              inputProps={{
                type: "email",
                defaultValue: "",
                placeholder: translations.placeholderEmail,
              }}
              iconLeft={
                <IconSvg name="icMail" size={18} color={colors.mainColor2} />
              }
              control={control}
              rules={{
                required: {
                  value: true,
                  message: translations.required,
                },
                // pattern: regexMail,
              }}
              errorTxt={errors.email?.message}
            />

            {/* password input */}
            <InputHook
              name="password"
              customStyle={{}}
              inputProps={{
                type: "password",
                defaultValue: "",
                placeholder: translations.placeholderPasword,
              }}
              control={control}
              rules={{
                required: {
                  value: true,
                  message: translations.required,
                },
                // pattern: regexMail,
              }}
              iconLeft={<IconSvg name="icLock" size={18} />}
              isPassword={!showPass}
              iconRight={
                <IconSvg
                  onPress={() => setShowPass((showPass) => !showPass)}
                  name={showPass ? "icEye" : "icEyeCrossed"}
                />
              }
              errorTxt={errors.password?.message}
            />
            <View style={styles.paddingButton}>
              <Button
                style={styles.buttonMargin}
                onPress={handleSubmit(onSubmit)}
                textColor={colors.white}
                backgroundColor={colors.primary}
                SvgSo={<IconSvg size={18} name="icMail" color={colors.white} />}
                text={translations.continueWith("E-mail")}
              />
            </View>
            <View style={CommonStyle.center}>
              <Text
                onPress={pressForgotPassword}
                style={[
                  CommonStyle.hnMedium,
                  {
                    textAlign: "center",
                    marginTop: 16,
                    textDecorationLine: "underline",
                  },
                ]}
              >
                {translations.forgotPassword}?
              </Text>
            </View>

            <OrView />
            <View style={styles.viewSocial}>
              <GoogleLoginButton />
              <AppleLoginButton />
              <FBLoginButton />
            </View>
            <ViewTermPolicy style={{ paddingHorizontal: 20, marginTop: 36 }} />
            <Text style={styles.textRegister}>
              {translations.needAnAccount}
              <Text
                style={[
                  CommonStyle.hnSemiBold,
                  { color: colors.primary, textDecorationLine: "underline" },
                ]}
                onPress={pressRegister}
              >
                {translations.registerNow}
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
