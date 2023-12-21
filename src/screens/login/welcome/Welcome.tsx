import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import Button from "@shared-components/button/Button";
import createStyles from "./Welcome.style";
import { SCREENS } from "@shared-constants";
import IconSvg from "assets/svg";

const { width } = Dimensions.get("window");
const heightSvg = (width / 375) * 457;

export default function WelcomeScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleStartNow = () => {
    NavigationService.replace(SCREENS.LOGINPAGE);
  };

  return (
    <View style={styles.container}>
      <IconSvg name="icWelcome" width={width} height={heightSvg} />
      <View style={[{ width: "100%" }]}>
        <View style={styles.viewText}>
          <Text style={styles.textHeader}>
            Welcome to the World of Languages{" "}
          </Text>
          <Text style={styles.textDescription}>
            Learning has never been to easy! With IELTS you will learn …
          </Text>
        </View>
      </View>
      <Button
        onPress={handleStartNow}
        style={styles.styleButton}
        text="Start Now"
      />
    </View>
  );
}
