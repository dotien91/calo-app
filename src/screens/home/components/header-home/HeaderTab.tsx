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
// import { useUserHook } from "@helpers/hooks/useUserHook";
// import { getStatusBarHeight } from "react-native-safearea-height";
// import ListLiveStream from "../list-livestream/list.liveStream";
// import CourseView from "../list-course/list.course";
// import FastImage from "react-native-fast-image";
import AudioView from "@screens/audio/audio-list/audio.view";
import { navigate } from "@helpers/navigation.helper";
import AfiliateShortcut from "@screens/affiliate/components/afiliate.shortcut";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";

const HeaderTab = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const userData = useStore((state) => state.userData);
  const listCategorys = [
    {
      title: translations.listCategory.course,
      icon: "icCard",
      screen: SCREENS.COURSE_TAB,
      id: "course",
    },
    {
      id: "tutor",
      title: translations.listCategory.tutor,
      icon: "icCard1",
      screen: SCREENS.COURSE_TAB,
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
          size={(SCREEN_WIDTH - 56) / 5}
        />
        <TextBase textAlign="center" fontSize={14}>
          {item.title}
        </TextBase>
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
        style={[
          CommonStyle.flexRear,
          { paddingHorizontal: 16, marginBottom: 8 },
        ]}
      >
        {listCategorys.map((item, index) => {
          return renderItem(item, index);
        })}
      </View>
      {/* <CourseView /> */}
      <AfiliateShortcut />
      <AudioView
        extraParams={userData?._id ? { type: "suggestion" } : {}}
        onPress={gotoAudioBook}
      />
      <InviteView />
      <ListLiveStream group_id={null} />
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
