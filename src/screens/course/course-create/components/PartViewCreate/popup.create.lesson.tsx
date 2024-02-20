import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { SCREENS } from "constants";
import { closeSuperModal } from "@helpers/super.modal.helper";
import { USER_TOKEN, _getJson } from "@services/local-storage";

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
        <Text style={{ ...CS.hnRegular }}>Add video</Text>
      </PressableBtn>
      <PressableBtn onPress={_gotoAddFile}>
        <Text style={{ ...CS.hnRegular }}>Add file</Text>
      </PressableBtn>
      <View style={{ height: 20 }} />
    </View>
  );
};

export default PopupCreateLesson;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  viewAdd: {
    height: 40,
  },
});
