import { translations } from "@localization";
// import useStore from "@services/zustand/store";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import * as React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

interface CommentBtnProps {
  pressComment?: () => void;
}

const CommentBtn = ({ pressComment }: CommentBtnProps) => {
  const [buttonColor, setButtonColor] = React.useState(palette.background);
  return (
    <TouchableOpacity
      onPress={pressComment}
      onPressIn={() => setButtonColor(palette.textOpacity4)}
      onPressOut={() => setButtonColor(palette.background)}
      style={[
        styles.viewLike,
        { justifyContent: "center", backgroundColor: buttonColor },
      ]}
    >
      <IconSvg size={16} name="icComment" color={palette.textOpacity6} />
      <Text style={styles.textLikeShare}>{translations.post.comment}</Text>
    </TouchableOpacity>
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
