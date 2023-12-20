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
import { IeltsHunter, SocialMail } from "assets/svg";
import createStyles from "./ForgotPassword.style";
import TermPolicy from "../components/TermPolicy";
import InputHook from "@shared-components/form/InputHook";
import { useForm } from "react-hook-form";
import { SCREENS } from "@shared-constants";
import { translations } from "@localization";

export default function ForgotPassword() {
  const theme = useTheme();
  const { colors } = theme;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
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
            <Text style={styles.textHeader}>{translations.forgotPassword}</Text>
            <View style={styles.viewInput}>
              <SocialMail />
              <InputHook
                name="email"
                customStyle={{ flex: 1 }}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  placeholder: translations.placeholderEmaiPhone,
                }}
                control={control}
                rules={{
                  required: true,
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

            <Button
              style={styles.buttonMargin}
              onPress={handleSubmit(onSubmit)}
              textColor={colors.white}
              backgroundColor={colors.primary}
              text={translations.continue}
            />
          </View>
          <TermPolicy style={{ paddingHorizontal: 20, marginTop: 36 }} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
