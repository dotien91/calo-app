import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { ScreenWidth } from "@freakycoder/react-native-helpers";

import Avatar from "@shared-components/user/Avatar";
import { translations } from "@localization";
import CS from "@theme/styles";
import { ICourseItem } from "models/course.model";
// import PressableBtn from "@shared-components/button/PressableBtn";
// import { SCREENS } from "constants";
import TextViewCollapsed from "@screens/course/components/text.view.collapsed";
import IconSvg from "assets/svg";
import { palette } from "@theme/themes";
import SkeletonPlaceholder from "@shared-components/skeleton";
import { SCREENS } from "constants";

interface AuthorViewProps {
  data?: ICourseItem;
}

const AuthorView = ({ data }: AuthorViewProps) => {
  const _gotoDetailTeacher = () => {
    NavigationService.navigate(SCREENS.TEACHER_DETAIL, {
      idTeacher: data?.user_id?._id,
    });
  };

  const IconText = ({ nameIcon, text }: { nameIcon: string; text: string }) => {
    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
      >
        <IconSvg name={nameIcon} size={24} color={palette.textOpacity6} />
        <Text style={[styles.txtBodyContent, { marginLeft: 8 }]}>{text}</Text>
      </View>
    );
  };

  if (!data?._id) {
    return (
      <View style={styles.container}>
        <SkeletonPlaceholder>
          <View style={styles.txtContentTitle} />
          <View style={styles.txtSubTitle} />
          <View style={styles.txtBodyContent} />
          <View style={{ ...CS.row, marginTop: 8 }}>
            <View style={styles.viewAvatar} />
            <View style={{ flex: 1, gap: 8, marginLeft: 8 }}>
              <View style={styles.txtBodyContent} />
              <View style={styles.txtBodyContent} />
              <View style={styles.txtBodyContent} />
            </View>
          </View>
          <View style={{ height: 40, width: ScreenWidth - 80 }} />
        </SkeletonPlaceholder>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.txtContentTitle}>
        {translations.course.instructor}
      </Text>
      <Text onPress={_gotoDetailTeacher} style={styles.txtSubTitle}>
        {data?.user_id?.display_name || ""}
      </Text>
      {/* <Text style={[styles.txtBodyContent, { marginTop: 8 }]}>
        {translations.course.instructor}
      </Text> */}
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <Avatar
          sourceUri={{ uri: data?.user_id?.user_avatar_thumbnail }}
          style={styles.viewAvatar}
        />
        <View style={{ marginLeft: 8, justifyContent: "space-between" }}>
          <IconText
            nameIcon="icRateStar"
            text={`${data?.rating.toFixed(2)} ${
              translations.course.rankTeacher
            }`}
          />
          <IconText
            nameIcon="icReview"
            text={`${data?.user_id.rating_count || 0} ${
              translations.course.reviews
            }`}
          />
          <IconText
            nameIcon="icStudent"
            text={`${data?.user_id.member_count || 0} ${
              translations.course.student
            }`}
          />
          <IconText
            nameIcon="icBookFull"
            text={`${data?.user_id.course_count || 0} ${
              translations.course.course
            }`}
          />
        </View>
      </View>
      <TextViewCollapsed text={data?.user_id.bio} />
      {/* <PressableBtn
        style={{ height: 40, ...CS.center, borderWidth: 1, marginTop: 8 }}
        onPress={_gotoDetailTeacher}
      >
        <Text>{translations.course.viewProfile}</Text>
      </PressableBtn> */}
    </View>
  );
};

export default React.memo(AuthorView);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 20,
  },

  txtContentTitle: {
    ...CS.hnSemiBold,
    fontSize: 24,
    lineHeight: 32,
    minHeight: 32,
  },
  txtSubTitle: {
    ...CS.hnSemiBold,
    lineHeight: 24,
    marginTop: 16,
    minHeight: 24,
  },
  txtBodyContent: {
    ...CS.hnMedium,
    ...CS.textOpacity6,
    lineHeight: 24,
    minHeight: 24,
  },
  viewAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginTop: 8,
  },
});
