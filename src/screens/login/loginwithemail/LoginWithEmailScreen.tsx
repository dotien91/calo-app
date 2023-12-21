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
import IconSvg from "assets/svg";
import createStyles from "./LoginWithEmailScreen.style";
import ViewTermPolicy from "../components/TermPolicyView";
import OrView from "../components/OrView";
import InputHook from "@shared-components/form/InputHook";
import { useForm } from "react-hook-form";
import { SCREENS } from "@shared-constants";
import { translations } from "@localization";
import GoBackButton from "../components/GoBackButton";

interface ButtonSocialProps {
  onPress: () => void;
  IconSocial: React.JSX.Element;
}

export default function LoginWithEmailScreen() {
  const theme = useTheme();
  const { colors } = theme;
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
  const onSubmit = (data: any) => console.log(data);

  const pressGoogle = () => {};
  const pressFacebook = () => {};
  const pressApple = () => {};
  const pressRegister = () => {
    NavigationService.push(SCREENS.SIGNUP);
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

  const pressForgotPassword = () => {
    console.log("control...", JSON.stringify(control));
    NavigationService.push(SCREENS.FORGOTPASSWORD);
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
            <View style={styles.viewInput}>
              <IconSvg name="icMail" size={18} color={colors.mainColor2} />
              <InputHook
                name="email"
                customStyle={{ flex: 1 }}
                inputProps={{
                  type: "email",
                  defaultValue: "",
                  placeholder: translations.placeholderEmaiPhone,
                }}
                control={control}
                rules={{
                  required: true,
                  //   pattern:
                  // /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]
                  // {1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))|(^[0-9]{10})$/,
                }}
              />
            </View>
            {errors.email && (
              <Text style={styles.textWarning}>
                {errors.email.type == "required"
                  ? translations.required
                  : translations.invalid}
              </Text>
            )}

            <View style={styles.viewInput}>
              <IconSvg name="icLock" size={18} />
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
                  required: true,
                  minLength: 6,
                }}
                isPassword={!showPass}
              />
              <Pressable onPress={() => setShowPass((showPass) => !showPass)}>
                {showPass ? (
                  <IconSvg name="icEye" />
                ) : (
                  <IconSvg name="icEyeCrossed" />
                )}
              </Pressable>
            </View>
            {errors.password && (
              <Text style={styles.textWarning}>
                {errors.password.type == "required"
                  ? translations.required
                  : translations.minLength(6)}
              </Text>
            )}

            <Button
              style={styles.buttonMargin}
              onPress={handleSubmit(onSubmit)}
              textColor={colors.white}
              backgroundColor={colors.primary}
              SvgSo={<IconSvg size={18} name="icMail" color={colors.white} />}
              text={translations.continueWith("E-mail")}
            />
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
