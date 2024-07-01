import React from "react";
import { StyleSheet } from "react-native";

import Button from "@shared-components/button/Button";
import IconSvg from "assets/svg";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import {
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { IOS_CLIENT_ID_GOOGLE, WEB_CLIENT_ID_GOOGLE } from "constants";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { getDeviceInfo } from "@helpers/device.info.helper";
import { loginWithGoogle } from "@services/api/user.api";
import { useUserHook } from "@helpers/hooks/useUserHook";

interface BtnProps {
  showText: boolean | true;
}

const GoogleLoginButton = ({ showText }: BtnProps) => {
  const { handleLogin } = useUserHook();

  const _onPress = async () => {
    try {
      showSuperModal({
        contentModalType: "loading",
        styleModalType: "middle",
      });
      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID_GOOGLE,
        iosClientId: IOS_CLIENT_ID_GOOGLE,
        offlineAccess: true,
      });
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const paramsLogin = {
        user_token: idToken,
        ...getDeviceInfo(),
      };
      loginWithGoogle(paramsLogin).then((res) => {
        closeSuperModal();
        if (!res.isError) {
          const user_token = res.headers["x-authorization"];
          handleLogin(user_token);
          //todo get current user
        } else {
          showToast({
            type: "error",
            ...res,
          });
        }
      });
    } catch (error: any) {
      closeSuperModal();
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        setTimeout(() => {
          Toast.show({
            type: "info",
            text1: "Play services not available or outdated",
          });
        }, 500);
      } else {
        // some other error happened
        Toast.show({
          type: "error",
          text1: error?.message,
        });
      }
    }
  };

  if (!showText) {
    return (
      <Button
        style={styles.iconBtn}
        onPress={_onPress}
        textColor={palette.mainColor2}
        backgroundColor={palette.transparent}
        SvgSo={<IconSvg name="icGoogle" size={28} />}
      />
    );
  }

  return (
    <Button
      style={styles.btn}
      onPress={_onPress}
      textColor={palette.mainColor2}
      backgroundColor={palette.btnInactive}
      SvgSo={<IconSvg name="icGoogle" size={16} />}
      text={translations.continueWith("Google")}
    />
  );
};

const styles = StyleSheet.create({
  btn: {
    marginBottom: 12,
  },
  iconBtn: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: palette.borderColor,
    height: 48,
    width: 48,
    borderWidth: 1,
    borderRadius: 10,
    gap: 0,
  },
});

export default GoogleLoginButton;
