import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as NavigationService from "react-navigation-helpers";
// Import package from node modules

import useStore from "@services/zustand/store";
import { getCurrentUser } from "@services/api/user.api";
import { showToast } from "../super.modal.helper";
import { SCREENS } from "constants";
import { _setJson, _getJson, USER_TOKEN } from "@services/local-storage";
import { translations } from "@localization";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { TypedUser } from "models";

export const useUserHook = () => {
  const setUserData = useStore((state) => state.setUserData);
  const setUserInfo = useStore((state) => state.setUserInfo);
  const setLinkAvatar = useStore((state) => state.setLinkAvatar);
  // const userData = useStore((state) => state.userData);
  const initListFollow = useStore((state) => state.initListFollow);

  // const isLoggedIn = () => {
  //   return !!_getJson(USER_TOKEN) && !!userData?._id;
  // };

  const isLoggedIn = () => {
    return _getJson(USER_TOKEN);
  };

  const handleLogin = (token: string) => {
    _setJson(USER_TOKEN, token);
    getCurrentUser().then((res) => {
      if (!res.isError) {
        initData(res.data);
        NavigationService.navigate(SCREENS.HOME);
        showToast({
          type: "success",
          message: "Đăng nhập thành công!",
        });
      }
    });
  };

  const getUserData = () => {
    getCurrentUser().then((res) => {
      console.log("current user data", res);
      if (!res.isError) {
        console.log("token", _getJson(USER_TOKEN), res.data);
        initData(res.data);
      }
    });
  };

  const initData = (data: TypedUser) => {
    setUserData(data);
    setUserInfo(data);
    setLinkAvatar(data.user_avatar_thumbnail);
    initListFollow(data.follow_users);
  };

  const logout = () => {
    showToast({
      type: "success",
      message: "Logout successful",
    });
    NavigationService.navigate(SCREENS.HOME);
    _setJson(USER_TOKEN, "");
    setUserData(null);
    setLinkAvatar("");
    initListFollow([]);
    // RNRestart.restart();
  };

  const renderViewRequestLogin = () => {
    if (isLoggedIn()) return null;
    return (
      <View
        style={{
          alignItems: "center",
          padding: 20,
          backgroundColor: palette.white,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            ...CommonStyle.hnRegular,
            fontSize: 20,
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          {translations.login.requireLogin}
        </Text>
        <TouchableOpacity
          style={CommonStyle.btnActive}
          onPress={() => {
            NavigationService.navigate(SCREENS.LOGIN_PAGE);
          }}
        >
          <Text style={CommonStyle.txtBtnActive}>{translations.loginNow}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return {
    handleLogin,
    getUserData,
    isLoggedIn,
    logout,
    renderViewRequestLogin,
  };
};
