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
import EnrollNow from "@screens/course/components/EnrollNow";

interface BuyButtonProps {
  data?: ICourseItem;
  type: "full" | "wrap";
  courseRoom: {
    roomId: string;
  };
}

const BuyButton = ({ data, type, courseRoom }: BuyButtonProps) => {
  const { isLoggedIn } = useUserHook();
  const isJoin = data?.is_join;
  if (isJoin)
    return (
      <EnrollNow courseRoom={courseRoom} data={data} course_id={data?._id} />
    );
  const goToBuyScreen = () => {
    if (!isLoggedIn()) {
      showWarningLogin();
      return;
    }
    const type = data?.type;
    let screen = SCREENS.PAYMENT_COURES;
    if (isJoin && type != EnumClassType.SelfLearning) {
      NavigationService.navigate(SCREENS.CALL_CLASS, {
        courseRoom,
        courseData: data,
      });
      return;
    }
    if (type == EnumClassType.Call11) screen = SCREENS.BOOK_LESSON;
    if (type == EnumClassType.CallGroup) screen = SCREENS.CHOOSE_CLASS;
    if (type == EnumClassType.SelfLearning)
      screen = isJoin
        ? SCREENS.COURSE_LEARN_VIDEO_SCREEN
        : SCREENS.PAYMENT_COURES;

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
        <Text style={styles.textBtn}>
          {isJoin ? translations.course.enrollNow : translations.course.buyNow}
        </Text>
      </PressableBtn>
    );
  }

  if (type === "wrap") {
    return (
      <PressableBtn onPress={goToBuyScreen} style={styles.containerWrap}>
        <Text style={styles.textBtn}>
          {isJoin ? translations.course.enrollNow : translations.course.buyNow}
        </Text>
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
