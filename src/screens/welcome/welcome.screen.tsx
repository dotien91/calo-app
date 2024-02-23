import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import Button from "@shared-components/button/Button";
import createStyles from "./welcome.screen.style";
import IconSvg from "assets/svg";
import { translations } from "@localization";
import { SCREENS } from "constants";

const { width } = Dimensions.get("window");
const heightSvg = (width / 375) * 457;

export default function WelcomeScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleStartNow = () => {
    NavigationService.navigate(SCREENS.HOME);
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
