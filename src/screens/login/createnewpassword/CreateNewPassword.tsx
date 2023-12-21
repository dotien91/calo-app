import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm } from "react-hook-form";
import React, { useMemo, useState } from "react";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import Button from "@shared-components/button/Button";
import createStyles from "./CreateNewPassword.style";
import ViewTermPolicy from "../components/TermPolicyView";
import InputHook from "@shared-components/form/InputHook";
import { SCREENS } from "@shared-constants";
import { translations } from "@localization";
import IconSvg from "assets/svg";
import GoBackButton from "../components/GoBackButton";

export default function NewPasswordScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPassword: "",
      reNewPassword: "",
      otp: "",
    },
  });
  const [showPass, setShowPass] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);
  const onSubmit = (data: any) => {
    // call Api send otp
    console.log(data);
    // navigation to screen otp
    NavigationService.push(SCREENS.NEWPASSWORD);
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
            <Text style={styles.textHeader}>{translations.updatePassword}</Text>
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
              }}
              isPassword={!showPass}
              iconRight={
                <IconSvg
                  onPress={() => setShowPass((showPass) => !showPass)}
                  name={showPass ? "icEye" : "icEyeCrossed"}
                />
              }
              errorTxt={textWarning(errors.newPassword?.type)}
            />
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
              }}
              isPassword={!showPass}
              iconRight={
                <IconSvg
                  onPress={() => setShowPass((showPass) => !showPass)}
                  name={showPass ? "icEye" : "icEyeCrossed"}
                />
              }
              errorTxt={textWarning(errors.reNewPassword?.type)}
            />
            <InputHook
              iconLeft={<IconSvg name="icLock" />}
              name="otp"
              customStyle={{ flex: 1 }}
              inputProps={{
                type: "text",
                defaultValue: "",
                placeholder: translations.enterOTP,
              }}
              control={control}
              rules={{
                required: true,
              }}
              errorTxt={textWarning(errors.otp?.type)}
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
