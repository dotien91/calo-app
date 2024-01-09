import React from "react";
import { StyleSheet } from "react-native";

import Button from "@shared-components/button/Button";
import IconSvg from "assets/svg";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import {
  showLoading,
  closeSuperModal,
  showErrorModal,
} from "@helpers/SuperModalHelper";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { IOS_CLIENT_ID_GOOGLE, WEB_CLIENT_ID_GOOGLE } from "@shared-constants";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { getDeviceInfo } from "@helpers/DeviceInfo";
import { loginWithGoogle } from "@services/api/userApi";
import { useUserHook } from "@helpers/hooks/useUserHook";

interface BtnProps {
  showText: boolean | true;
}

const GoogleLoginButton = ({ showText }: BtnProps) => {
  const { handleLogin } = useUserHook();

  const _onPress = async () => {
    try {
      showLoading();
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
        console.log("Resssssssss=======", res, paramsLogin);
        if (!res.isError) {
          const user_token = res.headers["x-authorization"];
          handleLogin(user_token);
          //todo get current user
        } else {
          showErrorModal(res);
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
        textColor={palette.mainColor2}
        backgroundColor={palette.transparent}
        SvgSo={<IconSvg name="icGoogle" size={16} />}
      />
    );
  }

  return (
    <Button
      style={styles.btn}
      onPress={_onPress}
      textColor={palette.mainColor2}
      backgroundColor={"#DBDBDB"}
      SvgSo={<IconSvg name="icGoogle" size={16} />}
      text={translations.continueWith("Google")}
    />
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 20,
    marginBottom: 12,
    marginHorizontal: 20,
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

export default GoogleLoginButton;
