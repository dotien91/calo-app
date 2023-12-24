import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const pressGoBack = () => {};
interface TypeHeaderPost {
  onPressPost: () => void;
}

const HeaderPost = ({ onPressPost }: TypeHeaderPost) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.buttonLeft} onPress={pressGoBack}>
        <IconSvg name="icBack" />
      </Pressable>
      <Text style={styles.textHeader}>Tạo bài viết</Text>
      <Pressable onPress={onPressPost} style={styles.buttonRight}>
        <Text style={styles.textPost}>Đăng</Text>
      </Pressable>
    </View>
  );
};

export default HeaderPost;

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  buttonLeft: {
    height: 32,
    width: 80,
    justifyContent: "center",
  },
  buttonRight: {
    height: 32,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.primary,
    borderRadius: 10,
  },
  textHeader: {
    ...CommonStyle.hnMedium,
    fontSize: 20,
    color: palette.mainColor2,
  },
  textPost: {
    ...CommonStyle.hnMedium,
    fontSize: 14,
    color: palette.white,
  },
});
