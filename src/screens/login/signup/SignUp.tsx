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
} from "assets/svg";
import createStyles from "./SignUp.style";
import TermPolicy from "../components/TermPolicy";
import Or from "../components/Or";
import InputHook from "@shared-components/form/InputHook";
import { useForm } from "react-hook-form";
import { SvgProps } from "react-native-svg";

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
      <SafeAreaView style={[CommonStyle.flex1, { justifyContent: "center" }]}>
        <View style={[CommonStyle.flex1, { alignItems: "center" }]}>
          <IeltsHunter />
        </View>
        <Text style={styles.textHeader}>Create new account!</Text>
        <View style={styles.viewInput}>
          <SocialMail />
          <InputHook
            name="fullname"
            errorTxt=""
            customStyle={{ flex: 1 }}
            inputProps={{
              type: "text",
              defaultValue: "",
              placeholder: "Fullname",
            }}
            control={control}
            rules={{ required: true }}
          />
        </View>
        {errors.fullname && (
          <Text style={styles.textWarning}>
            {errors.fullname.type == "required" ? "Required" : "Invalid"}
          </Text>
        )}
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
            rules={{ required: true }}
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
              type: "text",
              defaultValue: "",
              placeholder: "Password",
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
            {errors.email.type == "required" ? "Required" : "Invalid"}
          </Text>
        )}
        <Button
          style={styles.buttonMargin}
          onPress={handleSubmit(onSubmit)}
          textColor={colors.white}
          backgroundColor={colors.primary}
          text="Sign up"
        />

        <Or />
        <View style={styles.viewSocial}>
          <ButtonSocial IconSocial={SocialGG} onPress={pressGoogle} />
          <ButtonSocial IconSocial={SocialAppleBlack} onPress={pressApple} />
          <ButtonSocial IconSocial={SocialFbBlue} onPress={pressFacebook} />
        </View>
        <TermPolicy style={{ paddingHorizontal: 20, marginTop: 36 }} />
        <Text style={styles.textRegister}>
          Have an account?{" "}
          <Text
            style={[
              CommonStyle.hnSemiBold,
              { color: colors.primary, textDecorationLine: "underline" },
            ]}
            onPress={pressLoginNow}
          >
            Login now!
          </Text>
        </Text>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
