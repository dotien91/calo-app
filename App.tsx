import "react-native-gesture-handler";
import React from "react";
import { StatusBar, useColorScheme, LogBox } from "react-native";
import SplashScreen from "react-native-splash-screen";
/**
 * ? Local Imports
 */
import Navigation from "./src/navigation";
import { isAndroid } from "@freakycoder/react-native-helpers";
import useStore from "@services/zustand/store";
import { translations } from "@localization";

LogBox.ignoreAllLogs();

const App = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  const language = useStore((state) => state.language);

  React.useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content");
    if (isAndroid) {
      StatusBar.setBackgroundColor("rgba(0,0,0,0)");
      StatusBar.setTranslucent(true);
    }

    translations.setLanguage(language);
    setTimeout(() => {
      SplashScreen.hide();
    }, 750);
  }, [scheme, isDarkMode, language]);

  return (
    <>
      <Navigation />
    </>
  );
};

export default App;
