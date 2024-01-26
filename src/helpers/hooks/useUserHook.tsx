import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import useStore from "@services/zustand/store";
import { getCurrentUser } from "@services/api/user.api";
import { showToast } from "../super.modal.helper";
import { SCREENS } from "constants";
import { _setJson, _getJson, USER_TOKEN } from "@services/local-storage";
import { translations } from "@localization";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";

export const useUserHook = () => {
  const setUserData = useStore((state) => state.setUserData);
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
        setUserData(res.data);
        setLinkAvatar(res.data.user_avatar_thumbnail);
        initListFollow(res.data.follow_users);
        NavigationService.push(SCREENS.HOME);
        showToast({
          type: "success",
          message: "Đăng nhập thành công!",
        });
      }
    });
  };

  const getUserData = () => {
    getCurrentUser().then((res) => {
      if (!res.isError) {
        console.log("token", _getJson(USER_TOKEN));
        setUserData(res.data);
        setLinkAvatar(res.data.user_avatar_thumbnail);
        initListFollow(res.data.follow_users);
      }
    });
  };

  const logout = () => {
    _setJson(USER_TOKEN, "");
    setUserData(null);
    setLinkAvatar("");
    initListFollow([]);
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
