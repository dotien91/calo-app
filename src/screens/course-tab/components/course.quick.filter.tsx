import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local Imports
 */
import createStyles from "../course.style";
import { quickFilterCourse } from "constants/course.constant";
import { translations } from "@localization";
import { SCREENS } from "constants";
import useStore from "@services/zustand/store";
import CourseCategoryTitle from "../course-list/course.category.title";

// interface CourseFilterType {}

const CourseQuickFilter = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // eslint-disable-next-line no-empty-pattern
  const setListCourseFilterParams = useStore(
    (state) => state.setListCourseFilterParams,
  );

  const onPressBtnFilter = (item) => {
    setListCourseFilterParams({ [item.type]: [item.id] });
    NavigationService.navigate(SCREENS.COURSE_CATEGORY, {
      defaultParams: {
        title: item.name,
        [item.type]: [item.id],
      },
    });
  };

  const renderItem = (item, key) => {
    return (
      <TouchableOpacity
        key={key}
        onPress={() => onPressBtnFilter(item)}
        style={styles.btnFilter}
      >
        <Text style={styles.txtFilter}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.boxFilter}>
      <View>
        <CourseCategoryTitle
          hideViewAll={true}
          title={translations.course.typeLearning}
        />
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.wrapBtnFilter}
        >
          {quickFilterCourse.map((item, index) => renderItem(item, index))}
        </ScrollView>
      </View>
    </View>
  );
};

export default React.memo(CourseQuickFilter);
