import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useMemo, useRef } from "react";
import { useTheme, useRoute } from "@react-navigation/native";
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
import { verifyCode } from "@services/api/user.api";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { IVerifyCode } from "models";

export default function VerifyCodeScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const route = useRoute();

  const emailRef = useRef(route.params?.["user_email"] || "");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      verifyCode: "",
    },
  });

  const styles = useMemo(() => createStyles(theme), [theme]);

  const onSubmit = (data: any) => {
    showSuperModal({
      contentModalType: EnumModalContentType.Loading,
      styleModalType: EnumStyleModalType.Middle,
    });
    const params: IVerifyCode = {
      user_email: emailRef.current,
      verify_code: data.verifyCode,
    };

    verifyCode(params).then((res) => {
      closeSuperModal();
      if (!res.isError) {
        NavigationService.push(SCREENS.NEW_PASSWORD, {
          verify_code: data.verifyCode,
          user_email: emailRef.current,
        });
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
            <Text style={styles.textHeader}>
              {translations.verifyCodeTitle(emailRef.current)}
            </Text>

            {/* code input */}
            <InputHook
              name="verifyCode"
              customStyle={{ flex: 1 }}
              inputProps={{
                type: "text",
                defaultValue: "",
                placeholder: translations.placeholderVerifyCode,
              }}
              control={control}
              iconLeft={
                <IconSvg name="icMail" size={16} color={colors.mainColor2} />
              }
              rules={{
                required: {
                  value: true,
                  message: translations.required,
                },
              }}
              errorTxt={errors.verifyCode?.message}
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
