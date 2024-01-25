import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
// import * as NavigationService from "react-navigation-helpers";

import Avatar from "@shared-components/user/Avatar";
import { translations } from "@localization";
import CS from "@theme/styles";
import { ICourseItem } from "models/course.model";
// import PressableBtn from "@shared-components/button/PressableBtn";
// import { SCREENS } from "constants";
import TextViewCollapsed from "@screens/course/components/text.view.collapsed";
import IconSvg from "assets/svg";
import { palette } from "@theme/themes";

interface AuthorViewProps {
  data?: ICourseItem;
}

const AuthorView = ({ data }: AuthorViewProps) => {
  // const _gotoDetailTeacher = () => {
  //   NavigationService.navigate(SCREENS.TEACHER_DETAIL);
  // };

  const IconText = ({ nameIcon, text }: { nameIcon: string; text: string }) => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <IconSvg name={nameIcon} size={24} color={palette.textOpacity6} />
        <Text style={[styles.txtBodyContent, { marginLeft: 8 }]}>{text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.txtContentTitle}>
        {translations.course.instructor}
      </Text>
      <Text style={styles.txtSubTitle}>
        {data?.user_id?.display_name || ""}
      </Text>
      <Text style={styles.txtBodyContent}>
        {translations.course.instructor}
      </Text>
      <View style={{ flexDirection: "row" }}>
        <Avatar
          sourceUri={{ uri: data?.avatar?.media_thumbnail }}
          style={{ width: 88, height: 88, borderRadius: 44 }}
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
            text={`${data?.user_id.rating_count} ${translations.course.reviews}`}
          />
          <IconText
            nameIcon="icStudent"
            text={`${data?.user_id.member_count} ${translations.course.student}`}
          />
          <IconText
            nameIcon="icBookFull"
            text={`${data?.user_id.course_count} ${translations.course.course}`}
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
    marginTop: 8,
  },

  txtContentTitle: {
    ...CS.hnBold,
    fontSize: 24,
    lineHeight: 32,
  },
  txtSubTitle: {
    ...CS.hnSemiBold,
    lineHeight: 24,
  },
  txtBodyContent: {
    ...CS.hnMedium,
    ...CS.textOpacity6,
    lineHeight: 24,
  },
});
