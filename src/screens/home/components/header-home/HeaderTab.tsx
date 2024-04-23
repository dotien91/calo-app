import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import createStyles from "../about-home/about.home.style";
import { useTheme } from "@react-navigation/native";
import IconSvg from "assets/svg";
import { SCREENS } from "constants";
import useStore from "@services/zustand/store";
import { EnumCourseType } from "models/course.model";
import InviteView from "../invite-me/invite";
import ListLiveStream from "../list-livestream/list.liveStream";
import TextBase from "@shared-components/TextBase";
import { useUserHook } from "@helpers/hooks/useUserHook";
import { getStatusBarHeight } from "react-native-safearea-height";
// import ListLiveStream from "../list-livestream/list.liveStream";
import CourseView from "../list-course/list.course";
import FastImage from "react-native-fast-image";

const HeaderTab = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const listCategorys = [
    {
      title: translations.listCategory.course,
      icon: "icCard",
      screen: SCREENS.COURSE_LIST,
      id: "course",
    },
    {
      id: "tutor",
      title: translations.listCategory.tutor,
      icon: "icCard1",
      screen: SCREENS.COURSE_LIST,
    },
    {
      title: translations.listCategory.affiliate,
      icon: "icCard2",
      screen: SCREENS.HOME_AFFILIATE,
      color: "#E8F7EF",
    },
    {
      title: translations.listCategory.club,
      icon: "icCard3",
      screen: SCREENS.CLUB_TAB,
      color: "#E8F7EF",
    },
  ];

  const { isLoggedIn } = useUserHook();

  const setCourseCurrentType = useStore((state) => state.setCourseCurrentType);

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

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => _onPress(item)}
        style={styles.styleItemNaviCategory}
        key={index}
      >
        <IconSvg
          style={{
            ...CommonStyle.flexCenter,
            marginHorizontal: 2,
          }}
          color={item.iconColor}
          name={item.icon}
          size={64}
        />
        <TextBase textAlign="center" fontSize={14}>
          {item.title}
        </TextBase>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.viewHeaderStyle,
        {
          marginTop: isLoggedIn()
            ? getStatusBarHeight() + 94
            : getStatusBarHeight() + 46,
        },
      ]}
    >
      <View style={CommonStyle.flex2}>
        <Text style={styles.styleTxtTitle}>
          {translations.listCategory.descriptionTitle}
        </Text>
      </View>
      <View
        style={[
          CommonStyle.flexRear,
          { paddingHorizontal: 16, marginBottom: 8 },
        ]}
      >
        {listCategorys.map((item, index) => {
          return renderItem(item, index);
        })}
      </View>
      <CourseView />
      <InviteView />
      <ListLiveStream />
      <View style={{ paddingTop: 10 }}>
        <FastImage
          source={require("../../../../assets/images/coverhome.png")}
          style={{ height: 120 }}
        />
      </View>
    </View>
  );
};

export default HeaderTab;
