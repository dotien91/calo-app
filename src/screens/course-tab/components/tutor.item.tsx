import React, { useMemo } from "react";
import { View, Text, Image } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

// import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import createStyles from "./course.component.style";
import CS from "@theme/styles";
import { TypedUser } from "models";
import Avatar from "@shared-components/user/Avatar";
import IconBtn from "@shared-components/button/IconBtn";
import PressableBtn from "@shared-components/button/PressableBtn";
import { SCREENS } from "constants";
import { translations } from "@localization";
import IconSvg from "assets/svg";
import { palette } from "@theme/themes";
import { Device } from "@utils/device.ui.utils";

interface TutorItemProps extends TypedUser {
  isHorizontalStyle: boolean;
  isSliderItem: boolean;
}
const mentorLable = (exp_time) => {
  switch (true) {
    case exp_time >= 1 && exp_time <= 7000:
      return { label: "Pre Master", color: palette.green };
    case exp_time > 7000 && exp_time <= 10000:
      return { label: "Master", color: palette.orange };
    case exp_time > 10000:
      return { label: "Master Pro", color: palette.primary };
    default:
      return { label: "", color: palette.text };
  }
};

const TutorItem = ({
  display_name,
  user_avatar_thumbnail,
  user_avatar,
  tutor_level,
  educations,
  description,
  student_count,
  rating,
  course_count,
  isSliderItem,
  exp_time,
  ...res
}: TutorItemProps) => {
  const theme = useTheme();
  // const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  // const [isLike, setIsLike] = React.useState(false);
  const labelMaster = mentorLable(exp_time);
  // const toggleLike = () => {
  //   setIsLike((old) => !old);
  // };
  const _gotoDetailTeacher = () => {
    NavigationService.navigate(SCREENS.TEACHER_DETAIL, {
      _id: res._id,
      userInfo: res.user_id,
    });
  };
  const objectToString = (data) => {
    return Object.keys(data)
      .map(function (key) {
        return "" + key + " " + data[key]; // line break for wrapping only
      })
      .join(" • ");
  };

  const renderEducations = () => {
    return educations.map((item, index) => (
      <View key={index} style={[CS.flexStart, { marginBottom: 8 }]}>
        <IconBtn name={"user"} customStyle={{ marginRight: 12 }} />
        <Text style={styles.tutorInfoTxt}>{objectToString(item)}</Text>
      </View>
    ));
  };

  const renderInfo = () => {
    return (
      <>
        <View
          style={[
            CS.flexStart,
            {
              alignItems: "flex-start",
              marginBottom: 8,
            },
          ]}
        >
          {renderImg()}
          <View style={{ flex: 1 }}>
            <View style={[{ alignItems: "flex-start" }]}>
              <Text numberOfLines={2} style={styles.tutorName}>
                {display_name}
              </Text>
              {exp_time && (
                <View
                  style={{
                    backgroundColor: labelMaster.color,
                    borderRadius: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    marginVertical: 2,
                  }}
                >
                  <Text
                    style={{
                      paddingTop: 2,
                      color: palette.white,
                      fontSize: 12,
                      paddingVertical: 1,
                      paddingHorizontal: 2,
                    }}
                  >
                    {labelMaster.label}
                  </Text>
                </View>
              )}
              {tutor_level && (
                <View style={CS.flexStart}>
                  <IconBtn name={"book"} customStyle={{ marginRight: 12 }} />
                  <Text style={styles.tutorInfoTxt}>Level {tutor_level}</Text>
                </View>
              )}
              {/* <IconBtn
                customStyle={styles.iconLike}
                onPress={toggleLike}
                // style={styles.iconLike}
                name={"heart"}
                color={isLike ? colors.danger : colors.text}
              /> */}
            </View>
            {/* <Text style={styles.lessonTxt}>50 min lesson</Text> */}
          </View>
        </View>
        {!!description && (
          <Text numberOfLines={2} style={styles.tutorIntro}>
            {description}
          </Text>
        )}
        {/* <Badge title="best-seller" /> */}
        {!!educations?.length && renderEducations()}
        <View>
          <View style={[CS.row, { gap: 8 }]}>
            <Text style={styles.tutorInfoTxt}>{`${student_count || 0} ${
              translations.course.student
            }${student_count >= 2 ? translations.course.many : ""}`}</Text>
            <View style={styles.viewDot} />
            <Text style={styles.tutorInfoTxt}>{`${course_count || 0} ${
              translations.course.course
            }`}</Text>
          </View>

          {rating > 0 ? (
            <View style={CS.row}>
              <Text style={styles.tutorInfoTxt}>{`${rating}`}</Text>
              <IconSvg size={16} name="icStar" color={palette.yellow} />
            </View>
          ) : (
            <Text style={styles.tutorInfoTxt}>
              {translations.course.emptyRate}
            </Text>
          )}
        </View>
      </>
    );
  };
  const renderImg = () => {
    return (
      <View>
        <Avatar
          style={{
            width: 64,
            height: 64,
            borderRadius: 99,
            marginRight: 10,
          }}
          sourceUri={{ uri: user_avatar || user_avatar_thumbnail }}
        />
        {/* <IconBtn customStyle={styles.iconFlag} name={"flag"} /> */}
        <Image
          style={{
            height: 20,
            width: 20,
            borderRadius: 10,
            position: "absolute",
            bottom: 0,
            right: 5,
          }}
          source={require("assets/images/vnflat.png")}
        ></Image>
      </View>
    );
  };
  return (
    <PressableBtn
      onPress={_gotoDetailTeacher}
      style={[
        styles.tutorItem,
        isSliderItem && {
          borderWidth: 1,
          padding: 12,
          borderRadius: 12,
          marginLeft: 0,
          width: Device.width - 80,
        },
      ]}
    >
      {renderInfo()}
    </PressableBtn>
  );
};

export default React.memo(TutorItem);
