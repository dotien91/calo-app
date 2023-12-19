import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import CommonStyle from "@theme/styles";
import Button from "@shared-components/button/Button";
import createStyles from "./Welcome.style";
import { Welcome } from "assets/svg";
import { SCREENS } from "@shared-constants";

const { width } = Dimensions.get("window");
const heightSvg = (width / 375) * 457;

export default function WelcomeScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleStartNow = () => {
    NavigationService.replace(SCREENS.LOGINPAGE);
  };

  return (
    <View style={CommonStyle.flex1}>
      <Welcome width={width} height={heightSvg} />
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
