import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import RNRestart from "react-native-restart"; // Import package from node modules
/**
 * ? Local Imports
 */
import Text from "@shared-components/text-wrapper/TextWrapper";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import DropDownItem from "@shared-components/dropdown/DropDownItem";
import createStyles from "./setting.screen.style";
import { useMemo, useCallback } from "use-memo-one";
import SwitchComponent from "@shared-components/switch/Switch";
interface SettingScreenProps {}

const SettingScreen: React.FC<SettingScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [languageSelected, setLanguageSelected] = useState(
    useStore((state) => state.language),
  );

  const [items, setItems] = useState([
    { label: "Tiếng Việt", value: "vi" },
    { label: "English", value: "en" },
  ]);

  const setLanguage = useStore((state) => state.setLanguage);
  const language = useStore((state) => state.language);
  const isDarkMode = useStore((state) => state.isDarkMode);
  const setDarkMode = useStore((state) => state.setDarkMode);

  const toggleDarkmode = useCallback(
    (value) => {
      setDarkMode(value);
    },
    [setDarkMode],
  );

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
    <SafeAreaView style={styles.container}>
      <Text h1 color={colors.danger}>
        {translations.setting}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text>{translations.darkMode}</Text>
        <SwitchComponent
          backgroundColor="green"
          value={isDarkMode}
          onChange={toggleDarkmode}
        />
      </View>
      <View style={{ height: 10 }} />
      <DropDownItem
        value={languageSelected}
        setValue={setLanguageSelected}
        items={items}
        setItems={setItems}
      />
    </SafeAreaView>
  );
};

export default SettingScreen;
