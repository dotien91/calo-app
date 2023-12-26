import { translations } from "@localization";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const pressGoBack = () => {};
interface TypeHeaderPost {
  onPressPost: () => void;
  visiblePost: boolean;
}

const HeaderPost = ({ onPressPost, visiblePost = false }: TypeHeaderPost) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.buttonLeft} onPress={pressGoBack}>
        <IconSvg name="icBack" />
      </Pressable>
      <Text style={styles.textHeader}>{translations.createPost}</Text>
      <View style={[{ ...styles.buttonLeft }, { alignItems: "flex-end" }]}>
        <Pressable
          onPress={visiblePost ? onPressPost : () => {}}
          style={visiblePost ? styles.buttonRight : styles.buttonRightDisable}
        >
          <Text style={visiblePost ? styles.textPost : styles.textPostDisable}>
            {translations.post}
          </Text>
        </Pressable>
      </View>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.secondColor,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  buttonRightDisable: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.borderColor,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  textHeader: {
    ...CommonStyle.hnSemiBold,
    fontSize: 16,
    color: palette.mainColor2,
  },
  textPost: {
    ...CommonStyle.hnBold,
    fontSize: 14,
    color: palette.primary,
  },
  textPostDisable: {
    ...CommonStyle.hnBold,
    fontSize: 14,
    color: palette.mainColor2,
  },
});
