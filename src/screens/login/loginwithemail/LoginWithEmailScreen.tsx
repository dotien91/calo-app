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
import { regexMail } from "@shared-constants/regex";

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
  const textWarning = (warning: string | undefined) => {
    if (!warning) return "";
    if (warning === "required") {
      return translations.required;
    }
    if (warning === "invalid") {
      return translations.invalid;
    }
    return "";
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
            <InputHook
              name="email"
              customStyle={{ flex: 1 }}
              inputProps={{
                type: "email",
                defaultValue: "",
                placeholder: translations.placeholderEmaiPhone,
              }}
              iconLeft={
                <IconSvg name="icMail" size={18} color={colors.mainColor2} />
              }
              control={control}
              rules={{
                required: true,
                pattern: regexMail,
              }}
              errorTxt={textWarning(errors.email?.type)}
            />

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
              iconLeft={<IconSvg name="icLock" size={18} />}
              isPassword={!showPass}
              iconRight={
                <IconSvg
                  onPress={() => setShowPass((showPass) => !showPass)}
                  name={showPass ? "icEye" : "icEyeCrossed"}
                />
              }
              errorTxt={textWarning(errors.password?.type)}
            />

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
