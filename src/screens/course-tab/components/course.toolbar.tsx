import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local Imports
 */
import createStyles from "../course.style";
import CS from "@theme/styles";
import PressableBtn from "@shared-components/button/PressableBtn";
import useStore from "@services/zustand/store";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { SCREENS } from "constants";
import { EnumCourseType } from "models/course.model";
import { translations } from "@localization";

// interface CourseToolbarType {}

const CourseToolbar = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const setCourseCurrentType = useStore((state) => state.setCourseCurrentType);

  const courseCurrentType = useStore((state) => state.courseCurrentType);

  const openCategoryDetailScreen = () => {
    NavigationService.navigate(SCREENS.COURSE_CATEGORY, {
      defaultParams: {
        title: courseCurrentType.name,
      },
    });
  };

  const openFilterDetailModal = async () => {
    showSuperModal({
      contentModalType: EnumModalContentType.FilterListCourse,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        courseType: courseCurrentType.id,
        callback: openCategoryDetailScreen,
      },
    });
  };

  const openSelectTypeCourseModal = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.FilterTypeCourse,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        defaultItem: courseCurrentType,
        title: translations.course.selectModal,
        options: [
          {
            name: "Course",
            id: EnumCourseType.course,
            iconImg: require("assets/images/book.png"),
          },
          {
            name: "Tutor",
            id: EnumCourseType.tutor,
            iconImg: require("assets/images/graduate.png"),
          },
        ],

        callback: setCourseCurrentType,
      },
    });
  };

  const openSearchCourse = () => {
    NavigationService.navigate(SCREENS.COURSE_CATEGORY);
  };

  return (
    <View style={styles.selectView}>
      <TouchableOpacity onPress={openSelectTypeCourseModal}>
        <View style={{ ...CS.flexStart }}>
          <Text style={styles.txtSelect}>{courseCurrentType.name}</Text>
          <Icon
            name={"chevron-down"}
            type={IconType.Feather}
            size={20}
            style={{ color: colors.primary }}
          />
        </View>
      </TouchableOpacity>
      <View style={CS.flexEnd}>
        <PressableBtn onPress={openSearchCourse} style={styles.headerIcon}>
          <Icon
            name={"search"}
            type={IconType.Feather}
            size={20}
            style={{ color: colors.textOpacity8 }}
          />
        </PressableBtn>
        <View style={{ width: 16 }} />
        <PressableBtn onPress={openFilterDetailModal} style={styles.headerIcon}>
          <Icon
            name={"sliders"}
            type={IconType.Feather}
            size={20}
            style={{ color: colors.textOpacity8 }}
          />
        </PressableBtn>
      </View>
    </View>
  );
};

export default React.memo(CourseToolbar);
