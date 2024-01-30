import * as React from "react";
import { Text, StyleSheet } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import { ICourseItem } from "models/course.model";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { SCREENS } from "constants";

interface EnrollNowProps {
  data?: ICourseItem;
  course_id?: string;
}

const EnrollNow = ({ data, course_id }: EnrollNowProps) => {
  const _goToListVideo = () => {
    //đi đến trang xem khoá học
    NavigationService.navigate(SCREENS.COURSE_LEARN_VIDEO_SCREEN, {
      course_id: course_id,
    });
    console.log("data...", data);
  };
  return (
    <PressableBtn onPress={_goToListVideo} style={styles.containerFull}>
      <Text style={styles.textBtn}>{translations.course.enrollNow}</Text>
    </PressableBtn>
  );
};

export default EnrollNow;

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
});
