import { View, Text } from "react-native";
import React, { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import CommonStyle from "@theme/styles";
import Button from "@shared-components/button/Button";
import IconSvg from "assets/svg";
import createStyles from "./LoginScreen.style";
import ViewTermPolicy from "../components/TermPolicyView";
import OrView from "../components/OrView";
import { SCREENS } from "@shared-constants";
import { translations } from "@localization";
import GoogleLoginButton from "@shared-components/button/GoogleLoginButton";
import FBLoginButton from "@shared-components/button/FBLoginButton";

export default function LoginScreen() {
  const theme = useTheme();
  const { colors } = theme;

  const styles = useMemo(() => createStyles(theme), [theme]);
  const pressApple = () => {};
  const pressMail = () => {
    NavigationService.push(SCREENS.LOGIN_WITH_EMAIL);
  };

  return (
    <View style={styles.container}>
      <View style={[CommonStyle.flex1, { alignItems: "center" }]}>
        <IconSvg name="logoIeltsHunter" width={120} height={67} />
      </View>
      <Text style={styles.textHeader}>{translations.welcomeBack}</Text>
      <GoogleLoginButton showText={true} />
      <FBLoginButton showText={true} />
      <Button
        style={styles.buttonMargin}
        onPress={pressApple}
        textColor={colors.white}
        backgroundColor={colors.black}
        SvgSo={<IconSvg name="icApple" size={16} color={colors.white} />}
        text={translations.signInWith + " Apple"}
      />
      <OrView />
      <Button
        style={styles.buttonMargin}
        onPress={pressMail}
        textColor={colors.mainColor2}
        backgroundColor={"#DBDBDB"}
        SvgSo={<IconSvg name="icMail" size={16} color={colors.mainColor2} />}
        text={translations.continueWith("E-mail")}
      />
      <ViewTermPolicy style={{ paddingHorizontal: 20, marginTop: 36 }} />
    </View>
  );
}
