import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";

import Button from "@shared-components/button/Button";
import createStyles from "./WelcomeScreen.style";
import IconSvg from "assets/svg";
import { translations } from "@localization";
import useStore from "@services/zustand/store";

const { width } = Dimensions.get("window");
const heightSvg = (width / 375) * 457;

export default function WelcomeScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const setIsFirstOpenApp = useStore((state) => state.setIsFirstOpenApp);

  const handleStartNow = () => {
    setIsFirstOpenApp(false);
  };

  return (
    <View style={styles.container}>
      <IconSvg name="icWelcome" width={width} height={heightSvg} />
      <View style={[{ width: "100%" }]}>
        <View style={styles.viewText}>
          <Text style={styles.textHeader}>{translations.welcomeHeader}</Text>
          <Text style={styles.textDescription}>
            {translations.welcomeDescription}
          </Text>
        </View>
      </View>
      <Button
        onPress={handleStartNow}
        style={styles.styleButton}
        text={translations.startNow}
      />
    </View>
  );
}
