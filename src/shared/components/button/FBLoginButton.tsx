import React from "react";
import { StyleSheet } from "react-native";

import Button from "@shared-components/button/Button";
import IconSvg from "assets/svg";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import { closeSuperModal, showSuperModal } from "@helpers/super.modal.helper";
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
    showSuperModal({
      contentModalType: "loading",
      styleModalType: "middle",
    });
    try {
      LoginManager.logInWithPermissions().then(({ isCancelled }) => {
        if (!isCancelled) {
          AccessToken.getCurrentAccessToken().then(
            async (data: AccessToken | null) => {
              closeSuperModal();
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
                  }
                });
              } else {
                showToast({
                  type: "error",
                  ...res,
                });
              }
            },
          );
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
        SvgSo={<IconSvg name="icFacebook" color="#1877F2" size={20} />}
      />
    );
  }

  return (
    <Button
      style={styles.btn}
      onPress={_onPress}
      textColor={palette.white}
      backgroundColor={"#1877F2"}
      SvgSo={<IconSvg name="icFacebook" size={16} />}
      text={translations.continueWith("Facebook")}
    />
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  iconBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: palette.mainColor2,
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
  },
});

export default FBLoginButton;
