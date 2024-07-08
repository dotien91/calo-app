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
// import Recaptcha from "react-native-recaptcha-that-works";

import Button from "@shared-components/button/Button";
import createStyles from "./forgot.password.screen.style";
import ViewTermPolicy from "../components/TermPolicyView";
import InputHook from "@shared-components/form/InputHookForm";
import { useForm } from "react-hook-form";
import { SCREENS } from "constants";
import { translations } from "@localization";
import GoBackButton from "../components/GoBackButton";
import IconSvg from "assets/svg";
import { requestNewPassWithEmail } from "@services/api/user.api";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { IRequestNewPass } from "models";
import { RECAPCHA_KEY } from "constants/config.constant";

export default function ForgotPasswordScreen() {
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
    // const typePhoneOrEmail = !Number(data.email)
    //   ? "user_email"
    //   : "phone_number";
    const typePhoneOrEmail = "user_email";

    // if (typePhoneOrEmail == "phone_number") {
    //   $recaptcha.current.open();
    //   return;
    // }
    showSuperModal({
      contentModalType: EnumModalContentType.Loading,
      styleModalType: EnumStyleModalType.Middle,
    });
    const params: IRequestNewPass = {
      [typePhoneOrEmail]: data.email,
      g_recaptcha: RECAPCHA_KEY,
    };

    requestNewPassWithEmail(params).then((res) => {
      closeSuperModal();
      if (!res.isError) {
        NavigationService.push(SCREENS.VERIFY_CODE, { user_email: data.email });
      } else {
        showToast({
          type: "error",
          ...res,
        });
      }
    });
    // navigation to screen otp
    // NavigationService.push(SCREENS.NEWPASSWORD);
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
            <IconSvg
              name="logoIeltsHunter"
              width={108}
              height={95}
              color={colors.primary}
            />
          </View>

          <View>
            <Text style={styles.textHeader}>{translations.forgotPassword}</Text>

            {/* email input */}
            <InputHook
              name="email"
              customStyle={{ flex: 1 }}
              inputProps={{
                type: "text",
                defaultValue: "",
                placeholder: translations.placeholderEmail,
              }}
              control={control}
              rules={{
                required: {
                  value: true,
                  message: translations.required,
                },
              }}
              iconLeft={
                <IconSvg name="icMail" size={16} color={colors.mainColor2} />
              }
              errorTxt={errors.email?.message}
            />
            <View style={styles.paddingButton}>
              <Button
                style={styles.buttonMargin}
                onPress={handleSubmit(onSubmit)}
                textColor={colors.white}
                backgroundColor={colors.primary}
                text={translations.continue}
              />
            </View>
          </View>
          <ViewTermPolicy style={styles.viewPolicy} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
