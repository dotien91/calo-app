import React from "react";
import { StatusBar, LogBox } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { Settings } from "react-native-fbsdk-next";
// import InCallManager from "react-native-incall-manager";
/**
 * ? Local Imports
 */
import { isAndroid } from "@freakycoder/react-native-helpers";
import useStore from "@services/zustand/store";
import { setDeviceInfo } from "@helpers/device.info.helper";
import { useUserHook } from "@helpers/hooks/useUserHook";
import useFirebase from "@helpers/useFirebase";
import { useInAppPurchase } from "@helpers/hooks/useInAppPurchase";
import { priceIds } from "constants/iap.constant";
import { _getJson } from "@services/local-storage";
import { ENVIRONMENT, setUrlEnv } from "constants/config.constant";
import { getConfigGift } from "@services/api/user.api";

Settings.setAppID("908606980666349");

LogBox.ignoreAllLogs();

const InitView = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const setListGift = useStore((state) => state.setListGift);
  const { getUserData } = useUserHook();
  const getListGift = () => {
    getConfigGift().then((res) => {
      if (!res.isError) {
        setListGift(res?.data?.config?.option_content);
      }
    });
  };

  React.useEffect(() => {
    SplashScreen.hide();
    initData();
    getListGift();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { initIAP } = useInAppPurchase();

  React.useEffect(() => {
    // StatusBar.setBarStyle(!isDarkMode ? "dark-content" : "light-content");
    StatusBar.setBarStyle("dark-content");
    if (isAndroid) {
      StatusBar.setBackgroundColor("rgba(0,0,0,0)");
      StatusBar.setTranslucent(true);
    }
  }, [isDarkMode]);

  const initData = () => {
    setEnv();
    getUserData();
    setDeviceInfo();
    // initIAP(["com.course.tier2"]);
    initIAP(priceIds.map((i) => i.id));
  };

  const setEnv = () => {
    const env =
      _getJson("env") || (__DEV__ ? ENVIRONMENT.DEVELOP : ENVIRONMENT.PRODUCT);
    console.log("env", env);
    setUrlEnv(env == ENVIRONMENT.PRODUCT);
  };

  useFirebase();

  return null;
};

export default React.memo(InitView);
