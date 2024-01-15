import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import useStore from "@services/zustand/store";
import { getCurrentUser } from "@services/api/userApi";
import { showSuperModal } from "../super.modal.helper";
import { SCREENS } from "constants";
import { _setJson, _getJson, USER_TOKEN } from "@services/local-storage";
import { translations } from "@localization";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";

export const useUserHook = () => {
  const setUserData = useStore((state) => state.setUserData);
  const userData = useStore((state) => state.userData);
  const initListFollow = useStore((state) => state.initListFollow);

  const isLoggedIn = () => {
    return !!_getJson(USER_TOKEN) && !!userData?._id;
  };

  const handleLogin = (token: string) => {
    _setJson(USER_TOKEN, token);
    getCurrentUser().then((res) => {
      console.log("ressss current", { res, token });
      if (!res.isError) {
        setUserData(res.data);
        initListFollow(res.data.follow_users);
        NavigationService.push(SCREENS.HOME);
        setTimeout(() => {
          showSuperModal({ title: "Đăng nhập thành công!" });
        }, 1000);
      }
    });
  };

  const getUserData = () => {
    console.log("token", _getJson(USER_TOKEN));
    getCurrentUser().then((res) => {
      console.log("res get current user");
      if (!res.isError) {
        setUserData(res.data);
        initListFollow(res.data.follow_users);
        console.log("init user data", res.data);
      }
    });
  };

  const logout = () => {
    _setJson(USER_TOKEN, "");
    setUserData(null);
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
