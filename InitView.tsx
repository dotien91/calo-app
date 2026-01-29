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
import { _getJson } from "@services/local-storage";
import { ENVIRONMENT, setUrlEnv } from "constants/config.constant";
import { getConfigGift } from "@services/api/user.api";
import { getOnboarding } from "@services/api/calorie.api";

Settings.setAppID("908606980666349");

LogBox.ignoreAllLogs();

const InitView = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const setListGift = useStore((state) => state.setListGift);
  const setOnboardingData = useStore((state) => state.setOnboardingData);
  const setIsLoadingOnboarding = useStore((state) => state.setIsLoadingOnboarding);
  const { loginDeviceOnStart } = useUserHook();
  const getListGift = () => {
    getConfigGift().then((res) => {
      if (!res.isError) {
        setListGift(res?.data?.config?.option_content);
      }
    });
  };

  const getOnboardingData = async () => {
    try {
      setIsLoadingOnboarding(true);
      const response = await getOnboarding();
      console.log("response", response);
      if (response.data) {
        console.log("Onboarding data loaded:", response.data);
        setOnboardingData(response.data);
      } else {
        console.log("No onboarding data found for user");
        setOnboardingData(null);
      }
    } catch (error: any) {
      console.error("Error loading onboarding data:", error);
      // If user hasn't completed onboarding yet, set to null
      setOnboardingData(null);
    } finally {
      setIsLoadingOnboarding(false);
    }
  };

  React.useEffect(() => {
    SplashScreen.hide();
    initData();
    getListGift();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // const { initIAP } = useInAppPurchase();

  React.useEffect(() => {
    StatusBar.setBarStyle(!isDarkMode ? "dark-content" : "light-content");
    if (isAndroid) {
      StatusBar.setBackgroundColor("rgba(0,0,0,0)");
      StatusBar.setTranslucent(true);
    }
  }, [isDarkMode]);

  const initData = async () => {
    await setDeviceInfo();
    setEnv();
    await loginDeviceOnStart();
    await getOnboardingData(); // Load onboarding data when app starts
    // initIAP(["com.course.tier2"]);
    // initIAP(priceIds.map((i) => i.id));
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
