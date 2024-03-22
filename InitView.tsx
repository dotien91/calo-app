import React from "react";
import { StatusBar, LogBox } from "react-native";
import SplashScreen from "react-native-splash-screen";

/**
 * ? Local Imports
 */
import { isAndroid } from "@freakycoder/react-native-helpers";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import { setDeviceInfo } from "@helpers/device.info.helper";
import { useUserHook } from "@helpers/hooks/useUserHook";
import useFirebase from "@helpers/useFirebase";
import { useInAppPurchase } from "@helpers/hooks/useInAppPurchase";
import { priceIds } from "constants/iap.constant";

LogBox.ignoreAllLogs();

const InitView = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const { getUserData } = useUserHook();

  React.useEffect(() => {
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const language = useStore((state) => state.language);
  const { initIAP } = useInAppPurchase();

  React.useEffect(() => {
    // StatusBar.setBarStyle(!isDarkMode ? "dark-content" : "light-content");
    StatusBar.setBarStyle("dark-content");

    if (isAndroid) {
      StatusBar.setBackgroundColor("rgba(0,0,0,0)");
      StatusBar.setTranslucent(true);
    }
    translations.setLanguage(language);
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }, [isDarkMode, language]);

  const initData = () => {
    getUserData();
    setDeviceInfo();
    // initIAP(["com.course.tier2"]);
    initIAP(priceIds.map((i) => i.id));
  };

  useFirebase();

  return null;
};

export default React.memo(InitView);
