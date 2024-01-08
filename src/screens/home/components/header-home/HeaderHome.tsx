import { translations } from "@localization";
import { useTheme } from "@react-navigation/native";
import useStore from "@services/zustand/store";
import CommonStyle from "@theme/styles";
import * as React from "react";
import { View, Image, Pressable } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { TextInput } from "react-native-gesture-handler";
import createStyles from "./HeaderHome.style";

const SIZE_AVATAR = 30;
const BORDER_AVATAR = 12;
const HeaderHome = () => {
  const userData = useStore((state) => state.userData);
  const theme = useTheme();
  const { colors } = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const Avatar = React.useMemo(() => {
    return (
      <Pressable
        style={{
          width: SIZE_AVATAR,
          height: SIZE_AVATAR,
          borderRadius: BORDER_AVATAR,
        }}
      >
        <Image
          // source={{ uri: userData?.user_avatar_thumbnail  }}
          source={
            userData?.user_avatar_thumbnail
              ? { uri: userData.user_avatar_thumbnail }
              : require("assets/image/default_avatar.jpg")
          }
          style={{
            width: SIZE_AVATAR,
            height: SIZE_AVATAR,
            borderRadius: BORDER_AVATAR,
          }}
        />
      </Pressable>
    );
  }, [userData]);
  return (
    <View style={styles.container}>
      {Avatar}
      <Pressable
        style={styles.viewInput}
        onPress={() => {
          console.log("go to search");
        }}
      >
        <Icon
          name="search-outline"
          size={24}
          type={IconType.Ionicons}
          color={colors.text}
        />
        <TextInput
          style={CommonStyle.flex1}
          placeholder={translations.search}
          editable={false}
        />
      </Pressable>
      <View>
        <Icon
          name="chatbubbles-outline"
          size={24}
          type={IconType.Ionicons}
          color={colors.text}
        />
      </View>
    </View>
  );
};

export default HeaderHome;
