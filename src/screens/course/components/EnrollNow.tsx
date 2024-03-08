import * as React from "react";
import { Text, StyleSheet, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import { EnumClassType, ICourseItem } from "models/course.model";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { SCREENS } from "constants";

interface EnrollNowProps {
  data?: ICourseItem;
  course_id?: string;
  courseRoom: any;
  fromBottom: boolean;
}

const EnrollNow = ({
  data,
  course_id,
  courseRoom,
  fromBottom,
}: EnrollNowProps) => {
  const _goToListVideo = () => {
    if (data?.type == EnumClassType.SelfLearning) {
      NavigationService.navigate(SCREENS.COURSE_LEARN_VIDEO_SCREEN, {
        course_id: course_id,
        courseData: data,
      });
    } else {
      NavigationService.navigate(SCREENS.CALL_CLASS, {
        course_id: course_id,
        courseData: data,
        courseRoom,
      });
    }
  };

  const _goToHomeWork = () => {
    NavigationService.navigate(SCREENS.CLASSHOMEWORK, {
      course_id: course_id,
      courseData: data,
    });
  };

  return (
    <View style={[{ marginHorizontal: 16 }, fromBottom && CS.flexRear]}>
      <PressableBtn onPress={_goToListVideo} style={styles.containerFull}>
        <Text style={styles.textBtn}>{translations.course.enrollNow}</Text>
      </PressableBtn>
      {fromBottom && <View style={{ width: 12 }} />}
      <PressableBtn onPress={_goToHomeWork} style={styles.viewHomeWorkBtn}>
        <Text style={styles.textBtn2}>{translations.course.viewHomework}</Text>
      </PressableBtn>
    </View>
  );
};

export default EnrollNow;

const styles = StyleSheet.create({
  containerFull: {
    ...CS.center,
    marginTop: 8,
    backgroundColor: palette.primary,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  viewHomeWorkBtn: {
    ...CS.center,
    marginTop: 8,
    backgroundColor: palette.white,
    ...CS.borderStyle,
    borderColor: palette.primary,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  textBtn2: {
    ...CS.hnSemiBold,
    color: palette.primary,
  },
  textBtn: {
    ...CS.hnSemiBold,
    color: palette.btnLight,
  },
});
