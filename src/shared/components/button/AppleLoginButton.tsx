import React from "react";
import { StyleSheet } from "react-native";
import appleAuth from "@invertase/react-native-apple-authentication";

import Button from "@shared-components/button/Button";
import IconSvg from "assets/svg";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import {
  closeSuperModal,
  showLoading,
  showToast,
} from "@helpers/super.modal.helper";
import { getDeviceInfo, isAndroid } from "@helpers/device.info.helper";
import { loginWithApple } from "@services/api/user.api";
import { useUserHook } from "@helpers/hooks/useUserHook";

interface BtnProps {
  showText: boolean | true;
}

const AppleLoginButton = ({ showText }: BtnProps) => {
  const { handleLogin } = useUserHook();
  if (isAndroid()) return null;
  const loginApple = async () => {
    showLoading();
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      // Get User status Signup
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );
      // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
      if (credentialState === appleAuth.State.AUTHORIZED) {
        const { identityToken } = appleAuthRequestResponse;
        if (identityToken) {
          // if user is authenticated dispatch to server
          //handle login
          const paramsLogin = {
            user_token: identityToken,
            ...getDeviceInfo(),
          };
          loginWithApple(paramsLogin).then((res) => {
            closeSuperModal();
            if (!res.isError) {
              const user_token = res.headers["x-authorization"];
              handleLogin(user_token);
            } else {
              showToast({
                type: "error",
                ...res,
              });
            }
          });
        } else {
          showToast({
            type: "error",
          });
          closeSuperModal();
          //error
        }
      }
    } catch (err) {
      closeSuperModal();
      console.log("login errror apple", err);
    }
  };

  if (!showText) {
    return (
      <Button
        style={styles.iconBtn}
        onPress={loginApple}
        backgroundColor={"transparent"}
        SvgSo={<IconSvg name="icAppleBlack" size={20} />}
      />
    );
  }

  return (
    <Button
      style={styles.btn}
      onPress={loginApple}
      textColor={palette.white}
      backgroundColor={palette.black}
      SvgSo={<IconSvg name="icApple" size={16} color="#fff" />}
      text={translations.continueWith("Apple")}
    />
  );
};

const styles = StyleSheet.create({
  btn: {},
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

export default AppleLoginButton;
