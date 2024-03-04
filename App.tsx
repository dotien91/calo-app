import React from "react";
import { StatusBar, LogBox } from "react-native";
import Toast from "react-native-toast-message";
import SplashScreen from "react-native-splash-screen";
import { withIAPContext } from "react-native-iap";

/**
 * ? Local Imports
 */
import Navigation from "./src/navigation";
import { isAndroid } from "@freakycoder/react-native-helpers";
import NetworkManager from "@helpers/network.helper";
import { palette } from "@theme/themes";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import SuperModal from "@shared-components/modal/SuperModal";
import { setDeviceInfo } from "@helpers/device.info.helper";
import SocketConnect from "@services/socket/SocketConnect";
import { SocketHelperRef } from "@helpers/socket.helper";
import { useUserHook } from "@helpers/hooks/useUserHook";
import useFirebase from "@helpers/useFirebase";
import { useInAppPurchase } from "@helpers/hooks/useInAppPurchase";
LogBox.ignoreAllLogs();

const App = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const { getUserData } = useUserHook();

  React.useEffect(() => {
    initData();
    NetworkManager.getInstance().configure();
    return () => {
      NetworkManager.getInstance().cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const language = useStore((state) => state.language);
  const { initIAP } = useInAppPurchase();

  const initData = () => {
    getUserData();
    setDeviceInfo();
    initIAP([], []);
  };

  useFirebase();

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

  return (
    <>
      <StatusBar backgroundColor={palette.white} />
      <Navigation />
      <Toast />
      <SuperModal />
      <SocketConnect ref={SocketHelperRef} />
    </>
  );
};

export default withIAPContext(App);
