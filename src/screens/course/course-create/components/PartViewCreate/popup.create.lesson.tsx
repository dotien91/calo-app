import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { SCREENS } from "constants";
import { closeSuperModal } from "@helpers/super.modal.helper";
import { USER_TOKEN, _getJson } from "@services/local-storage";
import { translations } from "@localization";

interface PopupCreateLessonProps {
  course_id: string;
  parent_id: string;
}

const PopupCreateLesson = ({
  course_id,
  parent_id,
}: PopupCreateLessonProps) => {
  const _gotoAddVideo = () => {
    NavigationService.navigate(SCREENS.COURSE_ADD_MODULE, {
      course_id: course_id,
      parent_id: parent_id,
      type: "video",
    });
    closeSuperModal();
  };
  const _gotoAddFile = () => {
    NavigationService.navigate(SCREENS.COURSE_ADD_MODULE, {
      course_id: course_id,
      parent_id: parent_id,
      type: "file",
    });
    console.log(_getJson(USER_TOKEN));
    closeSuperModal();
  };

  return (
    <View style={styles.container}>
      <PressableBtn style={styles.viewAdd} onPress={_gotoAddVideo}>
        <Text style={styles.txtBtn}>{translations.course.addVideo}</Text>
      </PressableBtn>
      <PressableBtn onPress={_gotoAddFile}>
        <Text style={styles.txtBtn}>{translations.course.addFile}</Text>
      </PressableBtn>
    </View>
  );
};

export default PopupCreateLesson;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 30,
  },
  viewAdd: {
    height: 40,
  },
  txtBtn: {
    ...CS.hnRegular,
  },
});
