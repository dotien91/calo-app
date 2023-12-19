import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import CommonStyle from "@theme/styles";
import Button from "@shared-components/button/Button";
import {
  Eye,
  EyeCrossed,
  IeltsHunter,
  LoginPassword,
  SocialAppleBlack,
  SocialFbBlue,
  SocialGG,
  SocialMail,
  SocialMail2,
} from "assets/svg";
import createStyles from "./LoginWithEmail.style";
import TermPolicy from "../components/TermPolicy";
import Or from "../components/Or";
import InputHook from "@shared-components/form/InputHook";
import { useForm } from "react-hook-form";
import { SvgProps } from "react-native-svg";
import { SCREENS } from "@shared-constants";

interface ButtonSocialProps {
  onPress: () => void;
  IconSocial: React.FC<SvgProps>;
}

export default function LoginWithEmail() {
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
        <IconSocial />
      </Pressable>
    );
  };

  const pressForgotPassword = () => {
    console.log("control...", JSON.stringify(control));
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={[CommonStyle.flex1, { justifyContent: "center" }]}>
        <View style={[CommonStyle.flex1, { alignItems: "center" }]}>
          <IeltsHunter />
        </View>
        <Text style={styles.textHeader}>Welcom back!</Text>
        <View style={styles.viewInput}>
          <SocialMail />
          <InputHook
            name="email"
            errorTxt=""
            customStyle={{ flex: 1 }}
            inputProps={{
              type: "email",
              defaultValue: "",
              placeholder: "Email/Phone number",
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
            {errors.email.type == "required" ? "Required" : "Invalid"}
          </Text>
        )}

        <View style={styles.viewInput}>
          <LoginPassword />
          <InputHook
            name="password"
            errorTxt=""
            customStyle={{}}
            inputProps={{
              type: "password",
              defaultValue: "",
              placeholder: "Password",
            }}
            control={control}
            rules={{
              required: true,
              minLength: 6,
            }}
          />
          <Pressable onPress={() => setShowPass((showPass) => !showPass)}>
            {showPass ? <Eye /> : <EyeCrossed />}
          </Pressable>
        </View>
        {errors.password && (
          <Text style={styles.textWarning}>
            {errors.password.type == "required"
              ? "Required"
              : "at least 6 charectors"}
          </Text>
        )}

        <Button
          style={styles.buttonMargin}
          onPress={handleSubmit(onSubmit)}
          textColor={colors.white}
          backgroundColor={colors.primary}
          SvgSo={SocialMail2}
          text="Continue with E-mail"
        />
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
          forgot password?
        </Text>

        <Or />
        <View style={styles.viewSocial}>
          <ButtonSocial IconSocial={SocialGG} onPress={pressGoogle} />
          <ButtonSocial IconSocial={SocialAppleBlack} onPress={pressApple} />
          <ButtonSocial IconSocial={SocialFbBlue} onPress={pressFacebook} />
        </View>
        <TermPolicy style={{ paddingHorizontal: 20, marginTop: 36 }} />
        <Text style={styles.textRegister}>
          Need an account?{" "}
          <Text
            style={[
              CommonStyle.hnSemiBold,
              { color: colors.primary, textDecorationLine: "underline" },
            ]}
            onPress={pressRegister}
          >
            Register now!
          </Text>
        </Text>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
