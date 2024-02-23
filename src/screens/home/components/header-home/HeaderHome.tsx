import React, { useMemo } from "react";
import { View, Image, TouchableOpacity, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import useStore from "@services/zustand/store";
import CommonStyle from "@theme/styles";
import createStyles from "./HeaderHome.style";
import { SCREENS } from "constants";
import PressableBtn from "@shared-components/button/PressableBtn";

const SIZE_AVATAR = 30;
const BORDER_AVATAR = 12;
const HeaderHome = () => {
  const userData = useStore((state) => state.userData);
  const linkAvatar = useStore((state) => state.linkAvatar);

  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const gotoProfile = () => {
    if (userData) {
      NavigationService.push(SCREENS.PROFILE_CURRENT_USER, {
        _id: userData._id,
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
            linkAvatar.trim().length > 0
              ? { uri: linkAvatar }
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
  }, [linkAvatar]); // eslint-disable-line react-hooks/exhaustive-deps

  const goToSearchScreen = () => {
    NavigationService.navigate(SCREENS.COURSE_CATEGORY);
  };

  const goToChatScreen = () => {
    NavigationService.navigate(SCREENS.CHAT);
  };

  return (
    <View style={styles.container}>
      {Avatar}
      <PressableBtn style={styles.viewInput} onPress={goToSearchScreen}>
        <Icon
          name="search-outline"
          size={24}
          type={IconType.Ionicons}
          color={colors.text}
        />
        <TextInput
          onPressIn={goToSearchScreen}
          style={[CommonStyle.flex1, { color: colors.text }]}
          placeholder={translations.search}
          placeholderTextColor={colors.placeholder}
          editable={false}
        />
      </PressableBtn>
      <TouchableOpacity onPress={goToChatScreen}>
        <Icon
          name="chatbubbles-outline"
          size={24}
          type={IconType.Ionicons}
          color={colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderHome;
