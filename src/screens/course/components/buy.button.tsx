import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import { ICourseItem } from "models/course.model";
import * as React from "react";
import { Text, StyleSheet } from "react-native";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";

interface BuyButtonProps {
  data?: ICourseItem;
  type: "full" | "wrap";
}

const BuyButton = ({ data, type }: BuyButtonProps) => {
  const goToBuyScreen = () => {
    //đi đến trang mua khoá học
    NavigationService.navigate(SCREENS.TEACHER_DETAIL);
    console.log("data...", data);
  };
  if (type === "full") {
    return (
      <PressableBtn onPress={goToBuyScreen} style={styles.containerFull}>
        <Text style={styles.textBtn}>{translations.course.buyNow}</Text>
      </PressableBtn>
    );
  }
  if (type === "wrap") {
    return (
      <PressableBtn onPress={goToBuyScreen} style={styles.containerWrap}>
        <Text style={styles.textBtn}>{translations.course.buyNow}</Text>
      </PressableBtn>
    );
  }
  return null;
};

export default BuyButton;

const styles = StyleSheet.create({
  containerFull: {
    ...CS.center,
    marginTop: 8,
    backgroundColor: palette.primary,
    marginHorizontal: 16,
    height: 40,
    borderRadius: 4,
  },
  textBtn: {
    ...CS.hnSemiBold,
    color: palette.btnLight,
  },
  containerWrap: {
    ...CS.center,
    backgroundColor: palette.primary,
    height: 40,
    borderRadius: 4,
    paddingHorizontal: 20,
    width: 150,
  },
});
