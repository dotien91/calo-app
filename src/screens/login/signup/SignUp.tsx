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
import {
  Eye,
  EyeCrossed,
  IeltsHunter,
  LoginPassword,
  SocialAppleBlack,
  SocialFbBlue,
  SocialGG,
  SocialMail,
} from "assets/svg";
import createStyles from "./SignUp.style";
import TermPolicy from "../components/TermPolicy";
import Or from "../components/Or";
import InputHook from "@shared-components/form/InputHook";
import { useForm } from "react-hook-form";
import { SvgProps } from "react-native-svg";
import { translations } from "@localization";

interface ButtonSocialProps {
  onPress: () => void;
  IconSocial: React.FC<SvgProps>;
}

export default function SignUp() {
  const theme = useTheme();
  const { colors } = theme;
  const {
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
  const [showPass, setShowPass] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);
  const onSubmit = (data: any) => console.log(data);

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
        <IconSocial />
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
          <View style={[{ alignItems: "center" }]}>
            <IeltsHunter />
          </View>
          <View>
            <Text style={styles.textHeader}>
              {translations.createNewAccount}
            </Text>
            <View style={styles.viewInput}>
              <SocialMail />
              <InputHook
                name="fullname"
                customStyle={CommonStyle.flex1}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  placeholder: translations.fullname,
                }}
                control={control}
                rules={{ required: true }}
              />
            </View>
            {errors.fullname && (
              <Text style={styles.textWarning}>
                {errors.fullname.type == "required"
                  ? translations.required
                  : translations.invalid}
              </Text>
            )}
            <View style={styles.viewInput}>
              <SocialMail />
              <InputHook
                name="email"
                customStyle={CommonStyle.flex1}
                inputProps={{
                  type: "email",
                  defaultValue: "",
                  placeholder: translations.placeholderEmaiPhone,
                }}
                control={control}
                rules={{ required: true }}
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
              <LoginPassword />
              <InputHook
                name="password"
                customStyle={{}}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  placeholder: translations.placeholderPasword,
                }}
                control={control}
                rules={{ required: true }}
              />
              <Pressable onPress={() => setShowPass((showPass) => !showPass)}>
                {showPass ? <Eye /> : <EyeCrossed />}
              </Pressable>
            </View>
            {errors.email && (
              <Text style={styles.textWarning}>
                {errors.email.type == "required"
                  ? translations.required
                  : translations.invalid}
              </Text>
            )}
            <Button
              style={styles.buttonMargin}
              onPress={handleSubmit(onSubmit)}
              textColor={colors.white}
              backgroundColor={colors.primary}
              text={translations.signUp}
            />
            <Or />
            <View style={styles.viewSocial}>
              <ButtonSocial IconSocial={SocialGG} onPress={pressGoogle} />
              <ButtonSocial
                IconSocial={SocialAppleBlack}
                onPress={pressApple}
              />
              <ButtonSocial IconSocial={SocialFbBlue} onPress={pressFacebook} />
            </View>
            <TermPolicy style={{ paddingHorizontal: 20, marginTop: 36 }} />
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
