import { View, Text } from "react-native";
import React, { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import CommonStyle from "@theme/styles";
import Button from "@shared-components/button/Button";
import IconSvg from "assets/svg";
import createStyles from "./LoginPage.style";
import TermPolicy from "../components/TermPolicy";
import Or from "../components/Or";
import { SCREENS } from "@shared-constants";
import { translations } from "@localization";

export default function LoginPage() {
  const theme = useTheme();
  const { colors } = theme;

  const styles = useMemo(() => createStyles(theme), [theme]);

  // const pressPolicy = () => {
  //   console.log('PressPolicy')
  // }
  // const pressTerms = () => {
  //   console.log('PressTerms')
  // }

  const pressGoogle = () => {};
  const pressFacebook = () => {};

  const pressApple = () => {};
  const pressMail = () => {
    NavigationService.push(SCREENS.LOGINWITHEMAIL);
  };

  return (
    <View style={styles.container}>
      <View style={[CommonStyle.flex1, { alignItems: "center" }]}>
        <IconSvg name="logoIeltsHunter" width={120} height={67} />
      </View>
      <Text style={styles.textHeader}>{translations.welcomeBack}</Text>
      <Button
        style={styles.buttonMarginGG}
        onPress={pressGoogle}
        textColor={colors.mainColor2}
        backgroundColor={"#DBDBDB"}
        SvgSo={<IconSvg name="icGoogle" size={16} />}
        text={translations.continueWith("Google")}
      />
      <Button
        style={styles.buttonMargin}
        onPress={pressFacebook}
        textColor={colors.white}
        backgroundColor={"#1877F2"}
        SvgSo={<IconSvg name="icFacebook" color={colors.white} size={18} />}
        text={translations.continueWith("Facebook")}
      />
      <Button
        style={styles.buttonMargin}
        onPress={pressApple}
        textColor={colors.white}
        backgroundColor={colors.black}
        SvgSo={<IconSvg name="icApple" size={16} color={colors.white} />}
        text={translations.signInWith + " Apple"}
      />
      <Or />
      <Button
        style={styles.buttonMargin}
        onPress={pressMail}
        textColor={colors.mainColor2}
        backgroundColor={"#DBDBDB"}
        SvgSo={<IconSvg name="icMail" size={16} color={colors.mainColor2} />}
        text={translations.continueWith("E-mail")}
      />
      <TermPolicy style={{ paddingHorizontal: 20, marginTop: 36 }} />
    </View>
  );
}
