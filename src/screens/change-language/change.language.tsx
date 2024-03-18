import Header from "@shared-components/header/Header";
import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import DropDownItem from "@shared-components/dropdown/DropDownItem";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import RNRestart from "react-native-restart"; // Import package from node modules
import {
  getBottomSpace,
  getStatusBarHeight,
} from "react-native-iphone-screen-helper";
import { isAndroid } from "@freakycoder/react-native-helpers";

const ChangeLanguage = () => {
  const optionsLanguage = [
    { label: "Tiếng Việt", value: "vi" },
    { label: "English", value: "en" },
  ];

  const [languageSelected, setLanguageSelected] = useState(
    useStore((state) => state.language),
  );
  const setLanguage = useStore((state) => state.setLanguage);
  const language = useStore((state) => state.language);

  useEffect(() => {
    if (language != languageSelected) {
      Alert.alert("", translations.switchLanguage, [
        {
          text: translations.approve,
          onPress: () => {
            setLanguage(languageSelected);
            translations.setLanguage(languageSelected);
            RNRestart.Restart();
          },
        },
        {
          text: translations.cancel,
          onPress: () => {
            setLanguageSelected(language);
          },
        },
      ]);
    }
  }, [languageSelected, language, setLanguage]);
  return (
    <View
      style={{
        flex: 1,
        marginTop: getStatusBarHeight(),
        marginBottom: isAndroid ? getBottomSpace() : 0,
      }}
    >
      <Header text={translations.settings.changeLanguage} />
      <DropDownItem
        value={languageSelected}
        setValue={setLanguageSelected}
        items={optionsLanguage}
      />
    </View>
  );
};
export default ChangeLanguage;
