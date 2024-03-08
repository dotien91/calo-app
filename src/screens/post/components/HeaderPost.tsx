import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { translations } from "@localization";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import PressableBtn from "@shared-components/button/PressableBtn";

interface TypeHeaderPost {
  onPressPost: () => void;
  visiblePost: boolean;
  pressGoBack: () => void;
  textPost: string;
}

const HeaderPost = ({
  onPressPost,
  visiblePost = false,
  pressGoBack,
  textPost,
}: TypeHeaderPost) => {
  return (
    <View style={styles.container}>
      <PressableBtn style={styles.buttonLeft} onPress={pressGoBack}>
        <IconSvg name="icBack" size={64} />
      </PressableBtn>
      <Text style={styles.textHeader}>{translations.createPost}</Text>
      <View style={[{ ...styles.buttonLeft }, { alignItems: "flex-end" }]}>
        <PressableBtn
          onPress={visiblePost ? onPressPost : () => {}}
          style={visiblePost ? styles.buttonRight : styles.buttonRightDisable}
        >
          <Text style={visiblePost ? styles.textPost : styles.textPostDisable}>
            {textPost}
          </Text>
        </PressableBtn>
      </View>
    </View>
  );
};

export default HeaderPost;

const styles = StyleSheet.create({
  container: {
    ...CS.flexRear,
    width: "100%",
    height: 48,
    paddingHorizontal: 20,
    backgroundColor: palette.white,
    shadowColor: "rgba(0,0,0,0.8)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    elevation: 1,
    shadowRadius: 5,
  },
  buttonLeft: {
    height: 32,
    width: 80,
    justifyContent: "center",
  },
  buttonRight: {
    ...CS.center,
    width: 64,
    height: 40,
    backgroundColor: palette.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  buttonRightDisable: {
    ...CS.center,
    width: 64,
    height: 40,
    backgroundColor: palette.borderColor,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  textHeader: {
    ...CS.hnBold,
    fontSize: 16,
    color: palette.mainColor2,
  },
  textPost: {
    ...CS.hnMedium,
    fontSize: 14,
    color: palette.white,
  },
  textPostDisable: {
    ...CS.hnMedium,
    fontSize: 14,
    color: palette.placeholder,
  },
});
