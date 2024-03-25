import React, { useMemo } from "react";
import { View, Image, TouchableOpacity } from "react-native";
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

const SIZE_AVATAR = 40;
const BORDER_AVATAR = 20;
const HeaderHome = () => {
  const userData = useStore((state) => state.userData);
  const userInfo = useStore((state) => state.userInfo);
  const userMedia = useStore((state) => state.userMedia);

  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
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
      </PressableBtn>
    );
  }, [userMedia]); // eslint-disable-line react-hooks/exhaustive-deps

  const goToSearchScreen = () => {
    NavigationService.navigate(SCREENS.COURSE_CATEGORY, {
      defaultIndex: 2,
    });
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
          <IconSvg name="icCup" size={16} color={palette.yellow} />
        )}
      </View>
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
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(HeaderHome);
