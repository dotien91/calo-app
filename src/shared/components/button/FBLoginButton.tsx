import React from "react";
import { StyleSheet } from "react-native";

import Button from "@shared-components/button/Button";
import IconSvg from "assets/svg";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { getDeviceInfo } from "@helpers/device.info.helper";
import { AccessToken, LoginManager } from "react-native-fbsdk-next";
import { loginWithFB } from "@services/api/user.api";
import { useUserHook } from "@helpers/hooks/useUserHook";

interface BtnProps {
  showText: boolean | true;
}

const FBLoginButton = ({ showText }: BtnProps) => {
  const { handleLogin } = useUserHook();

  const _onPress = async () => {
    LoginManager.logOut();
    showSuperModal({
      contentModalType: EnumModalContentType.Loading,
      styleModalType: EnumStyleModalType.Middle,
    });
    try {
      LoginManager.logInWithPermissions().then(({ isCancelled }) => {
        if (!isCancelled) {
          AccessToken.getCurrentAccessToken().then(
            async (data: AccessToken | null) => {
              if (data?.accessToken) {
                const user_token = data?.accessToken.toString();
                const paramsLogin = {
                  user_token,
                  ...getDeviceInfo(),
                };
                loginWithFB(paramsLogin).then((res) => {
                  if (!res.isError) {
                    const user_token = res.headers["x-authorization"];
                    handleLogin(user_token);
                    closeSuperModal();
                  } else {
                    closeSuperModal();
                    showToast({
                      type: "error",
                      ...res,
                    });
                  }
                });
              } else {
                closeSuperModal();
                showToast({
                  type: "error",
                  ...res,
                });
              }
            },
          );
        } else {
          closeSuperModal();
        }
      });
    } catch (error: any) {
      closeSuperModal();
      setTimeout(() => {
        Toast.show({
          type: "error",
          text1: translations.continueWith("sendingError"),
        });
      }, 500);
    }
  };

  if (!showText) {
    return (
      <Button
        style={styles.iconBtn}
        onPress={_onPress}
        backgroundColor={"transparent"}
        SvgSo={<IconSvg name="icFacebook" color="#1877F2" size={32} />}
      />
    );
  }

  return (
    <Button
      style={styles.btn}
      onPress={_onPress}
      textColor={palette.text}
      backgroundColor={palette.btnInactive}
      SvgSo={<IconSvg name="icFacebook" size={16} color="#1877F2" />}
      text={translations.continueWith("Facebook")}
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

export default FBLoginButton;
