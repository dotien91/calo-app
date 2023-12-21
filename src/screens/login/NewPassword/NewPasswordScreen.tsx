import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useForm } from "react-hook-form";
import React, { useMemo, useState } from "react";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import Button from "@shared-components/button/Button";
import createStyles from "./NewPasswordScreen.style";
import ViewTermPolicy from "../components/ViewTermPolicy";
import InputHook from "@shared-components/form/InputHook";
import { SCREENS } from "@shared-constants";
import { translations } from "@localization";
import IconSvg from "assets/svg";
import ButtonGoBack from "../components/ButtonGoBack";

export default function NewPassword() {
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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "height" : undefined}
      >
        <View style={styles.container}>
          <ButtonGoBack />
          <View style={[{ alignItems: "center" }]}>
            <IconSvg name="logoIeltsHunter" width={120} height={67} />
          </View>
          <View>
            <Text style={styles.textHeader}>{translations.updatePassword}</Text>
            <View style={styles.viewInput}>
              <IconSvg name="icLock" />
              <InputHook
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
              />
              <Pressable onPress={() => setShowPass((showPass) => !showPass)}>
                {showPass ? (
                  <IconSvg name="icEye" />
                ) : (
                  <IconSvg name="icEyeCrossed" />
                )}
              </Pressable>
            </View>
            {errors.newPassword && (
              <Text style={styles.textWarning}>
                {errors.newPassword.type == "required"
                  ? translations.required
                  : translations.invalid}
              </Text>
            )}
            <View style={styles.viewInput}>
              <IconSvg name="icLock" />
              <InputHook
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
              />
              <Pressable onPress={() => setShowPass((showPass) => !showPass)}>
                {showPass ? (
                  <IconSvg name="icEye" />
                ) : (
                  <IconSvg name="icEyeCrossed" />
                )}
              </Pressable>
            </View>
            {errors.reNewPassword && (
              <Text style={styles.textWarning}>
                {errors.reNewPassword.type == "required"
                  ? translations.required
                  : translations.invalid}
              </Text>
            )}
            <View style={styles.viewInput}>
              <IconSvg name="icLock" />
              <InputHook
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
              />
            </View>
            {errors.otp && (
              <Text style={styles.textWarning}>
                {errors.otp.type == "required"
                  ? translations.required
                  : translations.invalid}
              </Text>
            )}

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
