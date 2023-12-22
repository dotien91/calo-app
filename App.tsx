import React from "react";
import { StatusBar, LogBox } from "react-native";
import Toast from "react-native-toast-message";
import SplashScreen from "react-native-splash-screen";

/**
 * ? Local Imports
 */
import Navigation from "./src/navigation";
import { isAndroid } from "@freakycoder/react-native-helpers";
import NetworkManager from "@helpers/managers/NetworkManager";
import { palette } from "@theme/themes";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import SuperModal from "@shared-components/SuperModal";

LogBox.ignoreAllLogs();

const App = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);

  React.useEffect(() => {
    NetworkManager.getInstance().configure();
    return () => {
      NetworkManager.getInstance().cleanup();
    };
  }, []);
  const language = useStore((state) => state.language);

  React.useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? "dark-content" : "light-content");
    if (isAndroid) {
      StatusBar.setBackgroundColor("rgba(0,0,0,0)");
      StatusBar.setTranslucent(true);
    }
    translations.setLanguage(language);
    setTimeout(() => {
      SplashScreen.hide();
    }, 750);
  }, [isDarkMode, language]);

  return (
    <>
      <StatusBar backgroundColor={palette.white} />
      <Navigation />
      <Toast />
      <SuperModal />
    </>
  );
};

export default App;
