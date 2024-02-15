import * as React from "react";
import { Text, StyleSheet } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import { ICourseItem, EnumClassType } from "models/course.model";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { SCREENS } from "constants";
import { useUserHook } from "@helpers/hooks/useUserHook";
import { showWarningLogin } from "@helpers/super.modal.helper";

interface BuyButtonProps {
  data?: ICourseItem;
  type: "full" | "wrap";
}

const BuyButton = ({ data, type }: BuyButtonProps) => {
  const { isLoggedIn } = useUserHook();
  const goToBuyScreen = () => {
    if (!isLoggedIn()) {
      showWarningLogin();
      return;
    }
    const type = data?.type;
    let screen = SCREENS.PAYMENT_COURES;
    if (type == EnumClassType.Call11) screen = SCREENS.BOOK_LESSON;
    if (type == EnumClassType.CallGroup) screen = SCREENS.CHOOSE_CLASS;
    if (type == EnumClassType.SelfLearning) {
      alert("open inapp purchase");
      return;
    }

    NavigationService.navigate(screen, {
      courseId: data?._id,
      courseData: data,
    });
  };
  if (!data?._id) {
    return null;
  }

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
    borderRadius: 8,
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
