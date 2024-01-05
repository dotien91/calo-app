import { translations } from "@localization";
import useStore from "@services/zustand/store";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import * as React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

const SIZE_AVATAR = 30;
const BORDER_AVATAR = 12;
const HeaderHome = () => {
  const userData = useStore((state) => state.userData);
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
        <Icon name="search-outline" size={24} />
        <TextInput
          style={CommonStyle.flex1}
          placeholder={translations.search}
          editable={false}
        />
      </Pressable>
      <View>
        <Icon name="chatbubbles-outline" size={24} />
      </View>
    </View>
  );
};

export default HeaderHome;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    backgroundColor: palette.background,
    paddingHorizontal: 16,
    gap: 10,
  },
  viewInput: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: palette.borderColor,
    borderRadius: 2,
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    gap: 10,
    alignItems: "center",
  },
});
