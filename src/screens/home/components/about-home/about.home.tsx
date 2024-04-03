import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import createStyles from "./about.home.style";
import { useTheme } from "@react-navigation/native";
import IconSvg from "assets/svg";
import { SCREENS } from "constants";
import useStore from "@services/zustand/store";
import { EnumCourseType } from "models/course.model";
import InviteView from "../invite-me/invite";
import ListLiveStream from "../list-livestream/list.liveStream";
import CourseView from "../list-course/list.course";
// import ListLiveStream from "../list-livestream/list.liveStream";

const AboutHome = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const listCategorys = [
    {
      title: translations.listCategory.course,
      textColor: "#E14242",
      iconColor: "#E14242",
      icon: "icBook",
      screen: SCREENS.COURSE_LIST,
      color: "#FFEDED",
      id: "course",
    },
    {
      id: "tutor",
      title: translations.listCategory.tutor,
      textColor: "#FFA347",
      iconColor: "#FFA347",
      icon: "icGraduate",
      screen: SCREENS.COURSE_LIST,
      color: "#FFF3DA",
    },
    {
      title: translations.listCategory.affiliate,
      textColor: "#2BC456",
      iconColor: "#2BC456",
      icon: "icAffiliate",
      screen: SCREENS.HOME_AFFILIATE,
      color: "#E8F7EF",
    },
  ];

  React.useEffect(() => {
    console.log("rerender");
  }, []);

  const setCourseCurrentType = useStore((state) => state.setCourseCurrentType);
  const userData = useStore((state) => state.userData);

  const _onPress = (item) => {
    if (item?.id == EnumCourseType.tutor) {
      setCourseCurrentType({
        id: EnumCourseType.tutor,
        name: translations.course.teacher,
      });
    }
    if (item?.id == EnumCourseType.course) {
      setCourseCurrentType({
        id: EnumCourseType.course,
        name: translations.course.course,
      });
    }
    NavigationService.navigate(item.screen, {
      params: item.params,
    });
  };

  return (
    <View style={styles.viewHeaderStyle}>
      {!!userData?.display_name && (
        <View style={CommonStyle.flex2}>
          <Text style={styles.styleTxtText}>{translations.welcomeBack}</Text>
          <Text style={styles.styleTxtText2}>{userData?.display_name}</Text>
        </View>
      )}
      <View style={CommonStyle.flex2}>
        <Text style={styles.styleTxtTitle}>
          {translations.listCategory.descriptionTitle}
        </Text>
      </View>
      <View>
        {listCategorys.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => _onPress(item)}
              style={[
                styles.styleItemNaviCategory,
                { backgroundColor: item.color },
              ]}
              key={index}
            >
              <View style={CommonStyle.flexStart}>
                <IconSvg
                  style={{
                    paddingRight: 2,
                    alignContent: "center",
                    justifyContent: "center",
                    marginRight: 8,
                  }}
                  color={item.iconColor}
                  name={item.icon}
                  size={24}
                />
                <Text
                  style={[styles.styleTextItemTitle, { color: item.textColor }]}
                >
                  {item.title}
                </Text>
              </View>

              <View
                style={[
                  styles.styleViewIcon,
                  { backgroundColor: item.iconColor },
                ]}
              >
                <Icon
                  name="chevron-forward-outline"
                  type={IconType.Ionicons}
                  color="#FFF"
                  size={24}
                ></Icon>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <InviteView />
      <ListLiveStream />
      <CourseView />
    </View>
  );
};

export default AboutHome;
