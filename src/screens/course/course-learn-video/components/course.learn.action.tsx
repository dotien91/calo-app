import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import IconSvg from "assets/svg";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { ICourseModuleItem } from "models/course.model";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { shareCourse } from "@utils/share.utils";
import useStore from "@services/zustand/store";
import { SCREENS } from "constants";

interface CourseLearnActionProps {
  item: ICourseModuleItem;
  course_id: string;
}

const CourseLearnAction = ({ course_id, item }: CourseLearnActionProps) => {
  const listFavourites = useStore((state) => state.listFavourites);
  const addToFavourites = useStore((state) => state.addToFavourites);
  const [isLike, setIsLike] = React.useState(false);
  const userData = useStore((state) => state.userData);

  React.useEffect(() => {
    const like =
      (listFavourites || []).findIndex((item) => item === course_id) > 0;
    setIsLike(like);
  }, [listFavourites]);

  const _onPressAboutThisCourse = () => {
    NavigationService.navigate(SCREENS.COURSE_DETAIL, {
      course_id,
      // dataCourse: item,
    });
  };
  const _onPressShareThisCourse = () => {
    shareCourse(userData?.invitation_code, item?.title);
  };
  // const _onPressResources = () => {};
  const _onPressAddCourseToFavourites = () => {
    // add to favourites
    addToFavourites(course_id);
  };
  const _onPressReportAPlaybackProblem = () => {
    showSuperModal({
      styleModalType: EnumStyleModalType.Bottom,
      contentModalType: EnumModalContentType.Report,
      data: {
        report_type: "course",
        partner_id: course_id,
      },
    });
  };
  return (
    <View style={styles.container}>
      <ItemAction
        title={translations.course.aboutThisCourse}
        onPress={_onPressAboutThisCourse}
        iconName="icMoreH"
      />
      <ItemAction
        title={translations.course.shareThisCourse}
        onPress={_onPressShareThisCourse}
        iconName="icShare"
      />
      {/* <ItemAction
        title={translations.course.resources}
        onPress={_onPressResources}
        iconName="icFile"
      /> */}
      <ItemAction
        title={translations.course.addCourseToFavourites}
        onPress={_onPressAddCourseToFavourites}
        iconName={isLike ? "icHearted" : "icHeart"}
      />
      <ItemAction
        title={translations.report}
        onPress={_onPressReportAPlaybackProblem}
        iconName="icWarningCircle"
      />
    </View>
  );
};

interface ItemActionProps {
  title: string;
  onPress: () => void;
  iconName: string;
}

const ItemAction = ({ title, iconName, onPress }: ItemActionProps) => {
  return (
    <PressableBtn
      style={{ flexDirection: "row", height: 40, alignItems: "center" }}
      onPress={onPress}
    >
      <IconSvg name={iconName} size={16} color={palette.text} />
      <Text style={{ ...CS.hnRegular, marginLeft: 8 }}>{title}</Text>
    </PressableBtn>
  );
};

export default CourseLearnAction;

const styles = StyleSheet.create({
  container: {
    ...CS.flex1,
    paddingHorizontal: 16,
    backgroundColor: palette.background,
  },
});
