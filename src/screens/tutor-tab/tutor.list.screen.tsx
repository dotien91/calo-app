import { View } from "react-native";
import React, { useCallback } from "react";
import useStore from "@services/zustand/store";
import { EnumCourseType } from "models/course.model";
import CourseToolbar from "@screens/course-tab/components/course.toolbar";
import { getStatusBarHeight } from "react-native-safearea-height";
import { ListCourse } from "@screens/course-tab/course-list/course.list.screen";
import { useFocusEffect } from "@react-navigation/native";

const MentorListScreen = () => {
  const setCourseCurrentType = useStore((state) => state.setCourseCurrentType);
  useFocusEffect(
    useCallback(() => {
      setCourseCurrentType({ id: EnumCourseType.tutor, name: "Tutor" });
    }, []),
  );
  //   console.log("heelo")
  return (
    <View style={{ flex: 1, paddingTop: getStatusBarHeight() }}>
      <CourseToolbar />
      <ListCourse isTabCourse={false} />
    </View>
  );
};

export default MentorListScreen;
