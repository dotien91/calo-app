import useStore from "@services/zustand/store";
import { getCurrentUser } from "@services/api/userApi";
import { showSuperModal } from "../SuperModalHelper";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "@shared-constants";
import { _setJson, _getJson, USER_TOKEN } from "@services/local-storage";

export const useUserHook = () => {
  const setUserData = useStore((state) => state.setUserData);
  const isLoggedIn = () => {
    return !!_getJson(USER_TOKEN);
  };

  const handleLogin = (token: string) => {
    _setJson(USER_TOKEN, token);
    getCurrentUser().then((res) => {
      console.log("ressss current", { res, token });
      if (!res.isError) {
        setUserData(res.data);
        NavigationService.push(SCREENS.HOME);
        setTimeout(() => {
          showSuperModal({ title: "Đăng nhập thành công!" });
        }, 1000);
      }
    });
  };

  const getUserData = () => {
    isLoggedIn();
    getCurrentUser().then((res) => {
      console.log("res get current user");
      if (!res.isError) {
        setUserData(res.data);
        console.log("init user data", res.data);
      }
    });
  };

  return { handleLogin, getUserData, isLoggedIn };
};
