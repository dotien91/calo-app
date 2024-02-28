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
}

const EnrollNow = ({ data, course_id, courseRoom }: EnrollNowProps) => {
  const _goToListVideo = () => {
    if (data.type == EnumClassType.SelfLearning) {
      NavigationService.navigate(SCREENS.COURSE_LEARN_VIDEO_SCREEN, {
        course_id: course_id,
        courseData: data,
      });
    } else {
      console.log("Dataaaaa", data);
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
    <View>
      <PressableBtn onPress={_goToListVideo} style={styles.containerFull}>
        <Text style={styles.textBtn}>{translations.course.enrollNow}</Text>
      </PressableBtn>
      <PressableBtn onPress={_goToHomeWork} style={styles.containerFull}>
        <Text style={styles.textBtn}>View homework</Text>
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
    marginHorizontal: 16,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  textBtn: {
    ...CS.hnSemiBold,
    color: palette.btnLight,
  },
});
