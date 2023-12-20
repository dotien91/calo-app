import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import Button from "@shared-components/button/Button";
import { IeltsHunter, LoginPassword } from "assets/svg";
import createStyles from "./NewPassword.style";
import TermPolicy from "../components/TermPolicy";
import InputHook from "@shared-components/form/InputHook";
import { useForm } from "react-hook-form";
import { SCREENS } from "@shared-constants";
import { translations } from "@localization";

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
          <View style={[{ alignItems: "center" }]}>
            <IeltsHunter />
          </View>
          <View>
            <Text style={styles.textHeader}>{translations.updatePassword}</Text>
            <View style={styles.viewInput}>
              <LoginPassword />
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
              />
            </View>
            {errors.newPassword && (
              <Text style={styles.textWarning}>
                {errors.newPassword.type == "required"
                  ? translations.required
                  : translations.invalid}
              </Text>
            )}
            <View style={styles.viewInput}>
              <LoginPassword />
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
              />
            </View>
            {errors.reNewPassword && (
              <Text style={styles.textWarning}>
                {errors.reNewPassword.type == "required"
                  ? translations.required
                  : translations.invalid}
              </Text>
            )}
            <View style={styles.viewInput}>
              <LoginPassword />
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
          <TermPolicy style={{ paddingHorizontal: 20, marginTop: 36 }} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
