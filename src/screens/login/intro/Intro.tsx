import { View, Text, Image } from "react-native";
import React, { useMemo } from "react";
import { loginIeltsHunter } from "assets/image";
import { useTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";
import Button from "@shared-components/button/Button";
import createStyles from "./Intro.style";

export default function Intro() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={CommonStyle.flex1}>
      <Image style={styles.imageStyle} source={loginIeltsHunter} />
      <View style={styles.viewText}>
        <Text style={styles.textHeader}>
          Take your IELTS proficiency to a new level
        </Text>
        <Text style={styles.textDescription}>
          Enhance your IELTS skill and achieve the desired scores
        </Text>
      </View>
      <Button onPress={() => {}} style={styles.styleButton} text="Start Now" />
    </View>
  );
}
