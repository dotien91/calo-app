import { translations } from "@localization";
import { useTheme } from "@react-navigation/native";
import useStore from "@services/zustand/store";
import CommonStyle from "@theme/styles";
import * as React from "react";
import { View, Image, Pressable, TouchableOpacity } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { TextInput } from "react-native-gesture-handler";
import createStyles from "./HeaderHome.style";
import { SCREENS } from "constants";

const SIZE_AVATAR = 30;
const BORDER_AVATAR = 12;
const HeaderHome = () => {
  const userData = useStore((state) => state.userData);
  console.log("userData.....", userData);
  const theme = useTheme();
  const { colors } = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const gotoProfile = () => {
    if (userData) {
      NavigationService.push(SCREENS.PROFILE_CURRENT_USER, {
        _id: userData._id,
      });
    } else {
      NavigationService.push(SCREENS.LOGIN_PAGE);
    }
  };
  const Avatar = React.useMemo(() => {
    return (
      <Pressable
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
            userData?.user_avatar_thumbnail
              ? { uri: userData.user_avatar_thumbnail }
              : require("@assets/images/default_avatar.jpg")
          }
          style={{
            width: SIZE_AVATAR,
            height: SIZE_AVATAR,
            borderRadius: BORDER_AVATAR,
          }}
        />
      </Pressable>
    );
  }, [userData]); // eslint-disable-line react-hooks/exhaustive-deps

  const goToSearchScreen = () => {
    NavigationService.navigate(SCREENS.SEARCH);
  };

  const goToChatScreen = () => {
    NavigationService.navigate(SCREENS.CHAT);
  };

  return (
    <View style={styles.container}>
      {Avatar}
      <Pressable style={styles.viewInput} onPress={goToSearchScreen}>
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
      </Pressable>
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
