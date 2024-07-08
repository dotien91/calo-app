import { View, Text, SafeAreaView } from "react-native";
import React, { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import CommonStyle from "@theme/styles";
import Button from "@shared-components/button/Button";
import IconSvg from "assets/svg";
import createStyles from "./login.screen.style";
import { SCREENS } from "constants";
import { translations } from "@localization";
import GoogleLoginButton from "@shared-components/button/GoogleLoginButton";
import FBLoginButton from "@shared-components/button/FBLoginButton";
import AppleLoginButton from "@shared-components/button/AppleLoginButton";
import { palette } from "@theme/themes";
import Header from "@shared-components/header/Header";

export default function LoginScreen() {
  const theme = useTheme();
  const { colors } = theme;

  const styles = useMemo(() => createStyles(theme), [theme]);
  // const pressApple = () => {};
  const pressMail = () => {
    NavigationService.push(SCREENS.LOGIN_WITH_EMAIL);
  };

  const pressRegister = () => {
    NavigationService.push(SCREENS.SIGN_UP);
  };

  return (
    <SafeAreaView style={CommonStyle.safeAreaView}>
      <Header />
      <View style={styles.container}>
        <View style={[CommonStyle.center]}>
          <IconSvg
            name="logoIeltsHunter"
            width={108}
            height={95}
            color={colors.primary}
          />
        </View>
        {/* <Text style={styles.textHeader}>{translations.welcomeBack}</Text> */}
        <View style={[CommonStyle.flex1, CommonStyle.center]}>
          <AppleLoginButton showText={true} />
          <GoogleLoginButton showText={true} />
          <FBLoginButton showText={true} />
          {/* <OrView /> */}
          <Button
            style={styles.buttonMargin}
            onPress={pressMail}
            textColor={colors.mainColor2}
            backgroundColor={palette.btnInactive}
            type="outline"
            // SvgSo={<IconSvg name="icMail" size={16} color={colors.mainColor2} />}
            text={translations.continueWith("E-mail")}
          />
          <Text style={styles.textRegister}>
            {translations.needAnAccount}
            <Text
              style={[
                CommonStyle.hnSemiBold,
                { color: colors.primary, textDecorationLine: "underline" },
              ]}
              onPress={pressRegister}
            >
              {translations.registerNow}
            </Text>
          </Text>
        </View>
        {/* <ViewTermPolicy style={{ paddingHorizontal: 20, marginTop: 36 }} /> */}
      </View>
    </SafeAreaView>
  );
}
