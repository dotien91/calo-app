import useStore from "@services/zustand/store";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import * as React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

interface CommentBtnProps {
  data: any;
  pressComment?: () => void;
}

const CommentBtn = ({ data, pressComment }: CommentBtnProps) => {
  const listCountComments = useStore((state) => state.listCountComments);
  const [cmtNumber, setCmtNumber] = React.useState<number | string>("0");
  React.useEffect(() => {
    const index = listCountComments.findIndex((item) => item._id === data?._id);
    if (index >= 0) {
      setCmtNumber(listCountComments[index].numberComments);
    } else {
      setCmtNumber(data?.comment_number || 0);
    }
  }, [listCountComments, data]);

  return (
    <TouchableOpacity
      onPress={pressComment}
      style={[styles.viewLike, { justifyContent: "center" }]}
    >
      <IconSvg size={16} name="icComment" color={palette.textOpacity8} />
      <Text style={styles.textLikeShare}>{cmtNumber}</Text>
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
    color: palette.text,
    marginLeft: 8,
  },
});
