import React, { useMemo } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import * as NavigationService from "react-navigation-helpers";

import useStore from "@services/zustand/store";
import createStyles from "./HeaderHome.style";
import PressableBtn from "@shared-components/button/PressableBtn";
import { SCREENS } from "constants";
import TextBase from "@shared-components/TextBase";
import formatMoney from "@shared-components/input-money/format.money";
import IconSvg from "assets/svg";
import { palette } from "@theme/themes";
import { getCount } from "@services/api/chat.api";
import CS from "@theme/styles";
import { EnumColors } from "models";
import { navigate } from "@helpers/navigation.helper";

const SIZE_AVATAR = 40;
const BORDER_AVATAR = 20;
const HeaderHome = () => {
  const userData = useStore((state) => state.userData);
  const userInfo = useStore((state) => state.userInfo);
  const userMedia = useStore((state) => state.userMedia);
  const unreadNumber = useStore((state) => state.unreadNumber);
  const setUnreadNumber = useStore((state) => state.setUnreadNumber);

  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  React.useEffect(() => {
    getCount({
      read_count: "unread",
    }).then((res) => {
      console.log(22222, res);
      if (!res.isError) {
        setUnreadNumber(res?.data?.count ?? 0);
      }
    });
  }, []);

  const gotoProfile = () => {
    if (userData) {
      NavigationService.push(SCREENS.PROFILE_CURRENT_USER, {
        _id: userData?._id,
        userInfo: userData,
      });
    } else {
      NavigationService.push(SCREENS.LOGIN_PAGE);
    }
  };
  const Avatar = useMemo(() => {
    return (
      <PressableBtn
        style={{
          width: SIZE_AVATAR,
          height: SIZE_AVATAR,
          borderRadius: BORDER_AVATAR,
        }}
        onPress={gotoProfile}
      >
        <Image
          // source={{ uri: userData?.user_avatar_thumbnail  }}
          source={
            (userMedia?.user_avatar || "").trim().length > 0
              ? { uri: userMedia?.user_avatar }
              : require("@assets/images/default_avatar.jpg")
          }
          style={{
            width: SIZE_AVATAR,
            height: SIZE_AVATAR,
            borderRadius: BORDER_AVATAR,
          }}
        />
        {(userData?.current_point || userData?.target_point) && (
          <View style={stylex.viewLevelAbsolute}>
            <View
              style={[
                stylex.viewLevel,
                {
                  backgroundColor: userData?.target_point
                    ? palette.red
                    : palette.green,
                },
              ]}
            >
              <Text style={stylex.txtLevel}>
                {userData?.target_point || userData?.current_point}
              </Text>
            </View>
          </View>
        )}
      </PressableBtn>
    );
  }, [userData]); // eslint-disable-line react-hooks/exhaustive-deps

  const goToSearchScreen = () => {
    NavigationService.navigate(SCREENS.COURSE_CATEGORY, {
      defaultIndex: 2,
    });
  };

  const gotoCalendar = () => {
    navigate(SCREENS.TEACHER_COURSES);
  };

  const goToChatScreen = () => {
    NavigationService.navigate(SCREENS.CHAT);
  };
  return (
    <View style={styles.container}>
      {Avatar}
      <View style={styles.viewCup}>
        {userData?._id && (
          <TextBase fontSize={20} fontWeight="600">
            {formatMoney(userInfo?.point)}
          </TextBase>
        )}
        {userData?._id && (
          <IconSvg name="icCoinStar" size={16} color={palette.yellow} />
        )}
      </View>
      <PressableBtn style={styles.viewInput} onPress={gotoCalendar}>
        <IconSvg name="icCalendar" size={20} color={colors.textOpacity6} />
      </PressableBtn>
      <PressableBtn style={styles.viewInput} onPress={goToSearchScreen}>
        <Icon
          name="search-outline"
          size={20}
          type={IconType.Ionicons}
          color={colors.textOpacity6}
        />
      </PressableBtn>
      <TouchableOpacity style={styles.viewInput} onPress={goToChatScreen}>
        <IconSvg name="icMessage" size={20} color={colors.textOpacity6} />
        {unreadNumber > 0 && (
          <View style={stylex.badge}>
            <TextBase fontSize={12} fontWeight="600" color={EnumColors.white}>
              {unreadNumber}
            </TextBase>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const stylex = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -6,
    top: -6,
    width: 18,
    height: 18,
    borderRadius: 99,
    zIndex: 1,
    backgroundColor: palette.primary,
    ...CS.center,
  },
  viewLevelAbsolute: {
    position: "absolute",
    bottom: -5,
    left: 0,
    right: 0,
    height: 10,
    zIndex: 1,
    ...CS.center,
  },
  viewLevel: {
    borderRadius: 5,
    backgroundColor: palette.red,
    paddingHorizontal: 8,
    ...CS.center,
  },
  txtLevel: {
    fontSize: 8,
    color: palette.white,
  },
});

export default React.memo(HeaderHome);
