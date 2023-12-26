import useStore from "@services/zustand/store";
import { getCurrentUser } from "@services/api/userApi";
import { _setJson, USER_TOKEN } from "@services/local-storage";
import { showSuperModal } from "./SuperModalHelper";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "@shared-constants";

export const useUserHook = () => {
  const setUserData = useStore((state) => state.setUserToken);

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

  return { handleLogin };
};
