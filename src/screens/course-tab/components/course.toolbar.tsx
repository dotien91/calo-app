import React, { useMemo } from "react";
import { View, Text } from "react-native";
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
// import { EnumCourseType } from "models/course.model";
import { translations } from "@localization";
import IconSvg from "assets/svg";

// interface CourseToolbarType {}

const CourseToolbar = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  // const setCourseCurrentType = useStore((state) => state.setCourseCurrentType);

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

  // const openSelectTypeCourseModal = () => {
  //   console.log("openSelectTypeCourseModal...", courseCurrentType);
  //   showSuperModal({
  //     contentModalType: EnumModalContentType.FilterTypeCourse,
  //     styleModalType: EnumStyleModalType.Bottom,
  //     data: {
  //       defaultItem: courseCurrentType,
  //       title: translations.course.selectModal,
  //       options: [
  //         {
  //           name: translations.course.course,
  //           id: EnumCourseType.course,
  //           iconSvg: "icBook",
  //         },
  //         {
  //           name: translations.course.teacher,
  //           id: EnumCourseType.tutor,
  //           iconSvg: "icGraduate",
  //         },
  //       ],

  //       callback: setCourseCurrentType,
  //     },
  //   });
  // };

  const openSearchCourse = () => {
    NavigationService.navigate(SCREENS.COURSE_CATEGORY);
  };

  return (
    <View style={styles.selectView}>
      {/* <TouchableOpacity onPress={openSelectTypeCourseModal}> */}
      <View style={styles.viewTitle}>
        <Text style={styles.txtSelect}>
          {courseCurrentType.id === "course"
            ? translations.course.course
            : translations.course.teacher}
          {/* <Icon
              name={"chevron-down"}
              type={IconType.Feather}
              size={20}
              style={{ color: colors.primary }}
            /> */}
        </Text>
      </View>
      {/* </TouchableOpacity> */}
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
          <IconSvg name="icSlider" size={20} color={colors.textOpacity8} />
        </PressableBtn>
      </View>
    </View>
  );
};

export default React.memo(CourseToolbar);
