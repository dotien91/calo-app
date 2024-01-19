import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import CommonStyle from "@theme/styles";
import Button from "@shared-components/button/Button";
import createStyles from "./signup.screen.style";
import ViewTermPolicy from "../components/TermPolicyView";
import OrView from "../components/OrView";
import InputHook from "@shared-components/form/InputHookForm";
import { useForm } from "react-hook-form";
import { translations } from "@localization";
import GoBackButton from "../components/GoBackButton";
import IconSvg from "assets/svg";
import { regexMail, passRegex } from "constants/regex.constant";
import { ISignUpWithEmail } from "models";
import { getDeviceInfo } from "@helpers/device.info.helper";
import { singUp } from "@services/api/userApi";
import {
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { useUserHook } from "@helpers/hooks/useUserHook";

interface ButtonSocialProps {
  onPress: () => void;
  IconSocial: React.JSX.Element;
}

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
      contentModalType: "loading",
      styleModalType: "middle",
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

  const pressGoogle = () => {};
  const pressFacebook = () => {};
  const pressApple = () => {};
  const pressLoginNow = () => {
    NavigationService.popToTop();
  };

  const ButtonSocial = ({ onPress, IconSocial }: ButtonSocialProps) => {
    return (
      <Pressable
        onPress={onPress}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          borderColor: colors.mainColor2,
          height: 48,
          borderWidth: 1,
          borderRadius: 10,
        }}
      >
        {IconSocial}
      </Pressable>
    );
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
              {translations.createNewAccount}
            </Text>

            {/* fullname input */}
            <InputHook
              iconLeft={<IconSvg name="icLoginFullname" />}
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

            {/* email input */}
            <InputHook
              iconLeft={<IconSvg name="icMail" color={colors.mainColor2} />}
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

            {/* pass input */}
            <InputHook
              iconLeft={<IconSvg name="icLock" />}
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
            />

            <Button
              style={styles.buttonMargin}
              onPress={handleSubmit(onSubmit)}
              textColor={colors.white}
              backgroundColor={colors.primary}
              text={translations.signUp}
            />
            <OrView />
            <View style={styles.viewSocial}>
              <ButtonSocial
                IconSocial={<IconSvg name="icGoogle" />}
                onPress={pressGoogle}
              />
              <ButtonSocial
                IconSocial={<IconSvg name="icApple" color={colors.black} />}
                onPress={pressApple}
              />
              <ButtonSocial
                IconSocial={<IconSvg name="icFacebook" color="#1877F2" />}
                onPress={pressFacebook}
              />
            </View>
            <ViewTermPolicy style={{ paddingHorizontal: 20, marginTop: 36 }} />
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
  );
}
