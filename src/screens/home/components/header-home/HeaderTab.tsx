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

import { navigate } from "@helpers/navigation.helper";
import CourseView from "../list-course/list.course";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

const HeaderTab = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const userData = useStore((state) => state.userData);

  const listCategorys = [
    {
      title: translations.listCategory.course,
      textColor: "#E14242",
      iconColor: "#E14242",
      icon: "icBook",
      screen: SCREENS.COURSE_TAB,
      color: "#FFEDED",
      id: "course",
    },
    {
      id: "tutor",
      title: translations.listCategory.tutor,
      textColor: "#FFA347",
      iconColor: "#FFA347",
      icon: "icGraduate",
      screen: SCREENS.MENTOR_TAB,
      color: "#FFF3DA",
    },
    {
      id: "affiliate",
      title: translations.listCategory.affiliate,
      textColor: "#2BC456",
      iconColor: "#2BC456",
      icon: "icAffiliate",
      screen: SCREENS.HOME_AFFILIATE,
      color: "#E8F7EF",
    },
  ];

  // const { isLoggedIn } = useUserHook();

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
        style={[styles.styleItemNaviCategory, { backgroundColor: item.color }]}
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
          <Text style={[styles.styleTextItemTitle, { color: item.textColor }]}>
            {item.title}
          </Text>
        </View>

        <View
          style={[styles.styleViewIcon, { backgroundColor: item.iconColor }]}
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
  };

  const gotoAudioBook = () => {
    // NavigationService.navigate(SCREENS.DISCOVERSCREEN_TAB, {
    //   screen: SCREENS.AUDIO_BOOK,
    //   initial: true,
    // });
    navigate(SCREENS.DISCOVERSCREEN_TAB);
    setTimeout(() => {
      navigate(SCREENS.AUDIO_BOOK);
    }, 1);
  };
  return (
    <View style={[styles.viewHeaderStyle]}>
      {!!userData?.display_name && (
        <View style={[CommonStyle.flex2, { marginTop: 6 }]}>
          <Text
            style={styles.styleTxtText2}
          >{`${translations.hi} ${userData?.display_name},`}</Text>
          <Text style={styles.styleTxtText}>{translations.welcomeBack}</Text>
        </View>
      )}
      <View style={CommonStyle.flex2}>
        <Text style={styles.styleTxtTitle}>
          {translations.listCategory.descriptionTitle}
        </Text>
      </View>
      <View
      // style={[
      //   CommonStyle.flexRear,
      //   { paddingHorizontal: 16, marginBottom: 8 },
      // ]}
      >
        {listCategorys.map((item, index) => {
          return renderItem(item, index);
        })}
      </View>
      {/* <AfiliateShortcut /> */}
      <CourseView />
      <InviteView />
      {/* <View style={{ paddingTop: 10 }}>
        <FastImage
          source={require("../../../../assets/images/coverhome.png")}
          style={{ height: 120 }}
        />
      </View> */}
    </View>
  );
};

export default HeaderTab;
