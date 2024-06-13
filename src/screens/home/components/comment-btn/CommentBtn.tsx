import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
// import useStore from "@services/zustand/store";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import * as React from "react";
import { Text, StyleSheet } from "react-native";

interface CommentBtnProps {
  pressComment?: () => void;
}

const CommentBtn = ({ pressComment }: CommentBtnProps) => {
  return (
    <PressableBtn
      onPress={pressComment}
      style={[styles.viewLike, { justifyContent: "center" }]}
    >
      <IconSvg size={20} name="icCmtPost" />
      <Text style={styles.textLikeShare}>{translations.post.comment}</Text>
    </PressableBtn>
  );
};

export default CommentBtn;

const styles = StyleSheet.create({
  viewLike: {
    ...CS.flex1,
    flexDirection: "row",
    alignItems: "center",
  },
  textLikeShare: {
    ...CS.hnRegular,
    color: palette.textOpacity8,
    marginLeft: 8,
  },
});
