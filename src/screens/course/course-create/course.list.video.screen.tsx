import React from "react";
import { View, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import CS from "@theme/styles";
import PartViewCreate from "./components/PartViewCreate/part.view.create";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";

const CourseListVideoScreen = () => {
  const route = useRoute();
  const course_id = route.params?.["course_id"];

  const _pressSuccess = () => {
    NavigationService.popToTop();
  };

  return (
    <View style={CS.safeAreaView}>
      <Header
        text={translations.course.educationProgram}
        textRight={translations.home.select}
        onPressRight={_pressSuccess}
      />
      <ScrollView>
        <PartViewCreate id={course_id} hide={false} />
      </ScrollView>
    </View>
  );
};

export default CourseListVideoScreen;
