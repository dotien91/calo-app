import { View, Text, Image } from "react-native";
import React, { useMemo } from "react";
import { loginIeltsHunter } from "assets/images";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import Button from "@shared-components/button/Button";
import createStyles from "./intro.screen.style";
import { SCREENS } from "constants";

export default function IntroScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleStartNow = () => {
    NavigationService.replace(SCREENS.CHOOSE_LANGUAGE);
  };

  return (
    <View style={styles.container}>
      <Image style={styles.imageStyle} source={loginIeltsHunter} />
      <View style={styles.viewText}>
        <Text style={styles.textHeader}>
          Take your IELTS proficiency to a new level
        </Text>
        <Text style={styles.textDescription}>
          Enhance your IELTS skill and achieve the desired scores
        </Text>
      </View>
      <Button
        onPress={handleStartNow}
        style={styles.styleButton}
        text="Start Now"
      />
    </View>
  );
}
