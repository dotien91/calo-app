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
import { _getJson, _setJson, HAS_COMPLETED_ONBOARDING } from "@services/local-storage";
import { ENVIRONMENT, setUrlEnv } from "constants/config.constant";
import { getConfigGift } from "@services/api/user.api";
import { getOnboarding } from "@services/api/calorie.api";

Settings.setAppID("908606980666349");

LogBox.ignoreAllLogs();

const InitView = () => {
  const isLightMode = useStore((state) => state.isLightMode);
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
      if (response.data) {
        setOnboardingData(response.data);
      } else {
        setOnboardingData(null);
      }
    } catch (error: any) {
      console.error("Error loading onboarding data:", error);
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
    StatusBar.setBarStyle(isLightMode ? "dark-content" : "light-content");
    if (isAndroid) {
      StatusBar.setBackgroundColor("rgba(0,0,0,0)");
      StatusBar.setTranslucent(true);
    }
  }, [isLightMode]);

  const initData = async () => {
    await setDeviceInfo();
    setEnv();
    await loginDeviceOnStart();
    await getOnboardingData();
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
