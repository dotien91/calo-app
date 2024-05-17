import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as NavigationService from "react-navigation-helpers";
// Import package from node modules

import useStore from "@services/zustand/store";
import {
  getCurrentUser,
  getListBlock,
  postInvitationCode,
} from "@services/api/user.api";
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
  const setUserMedia = useStore((state) => state.setUserMedia);
  const resetListLike = useStore((state) => state.resetListLike);
  const setBankSelected = useStore((state) => state.setBankSelected);

  const initListFollow = useStore((state) => state.initListFollow);
  const setShowInvite = useStore((state) => state.setShowInvite);
  const updateListBlock = useStore((state) => state.updateListBlock);
  const userData = useStore((state) => state.userData);
  const codeInvite = useStore((state) => state.codeInvite);
  const setCodeInvite = useStore((state) => state.setCodeInvite);

  const isLoggedIn = React.useCallback(() => {
    return _getJson(USER_TOKEN) && !!userData?._id;
  }, [userData]);

  const handleLogin = (token: string) => {
    _setJson(USER_TOKEN, token);
    getCurrentUser().then((res) => {
      if (!res.isError) {
        initData(res.data);
        NavigationService.navigate(SCREENS.HOME_TAB, { screen: SCREENS.HOME });
        showToast({
          type: "success",
          message: translations.loginSuccess,
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
      if (codeInvite && codeInvite !== "") {
        const data = {
          invitation_code: codeInvite,
        };
        postInvitationCode(data).then((res) => {
          if (!res.isError) {
            console.log("data,", res.data);
            setShowInvite(false);
            setCodeInvite("");
          } else {
            console.log("data,", res.message);
          }
        });
      }
    });
  };

  const initData = (data: TypedUser) => {
    setUserData(data);
    setUserInfo(data);
    setLinkAvatar(data.user_avatar_thumbnail);

    setUserMedia({
      user_avatar: data.user_avatar || "",
      user_cover: data.user_cover || "",
    });
    initListFollow(data.follow_users);
    initListBlock();
  };

  const initListBlock = () => {
    getListBlock().then((res) => {
      if (!res.isError) {
        updateListBlock(res.data);
      }
    });
  };

  const logout = () => {
    showToast({
      type: "success",
      message: "Logout successful",
    });
    _setJson(USER_TOKEN, "");
    setUserData(null);
    setLinkAvatar("");
    setUserInfo(null);
    setUserMedia({
      user_avatar: "",
      user_cover: "",
    });
    initListFollow([]);
    setShowInvite(true);
    resetListLike();
    setBankSelected();
    NavigationService.navigate(SCREENS.HOME_TAB, { screen: SCREENS.HOME });
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
    initListBlock,
  };
};
