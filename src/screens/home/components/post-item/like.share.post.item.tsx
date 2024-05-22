import * as React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";

import LikeBtn from "../like-btn/LikeBtn";

import { TypedPost } from "shared/models";
import createStyles from "./post.item.style";
import { translations } from "@localization";
import { sharePost } from "@utils/share.utils";
import IconSvg from "assets/svg";
import CommentBtn from "../comment-btn/CommentBtn";
import useStore from "@services/zustand/store";
interface LikeSharePostItemProps {
  data: TypedPost;
  pressComment: () => void;
}

const LikeSharePostItem = ({ data, pressComment }: LikeSharePostItemProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const userData = useStore((store) => store.userData);

  const _sharePost = () => {
    sharePost(userData?.invitation_code);
    // shareCodeInvite(userData?.invitation_code || "");
  };

  return (
    <View style={styles.containerLikeShare}>
      <LikeBtn data={data} />
      {/* <TouchableOpacity
        onPress={pressComment}
        style={[styles.viewLike, { justifyContent: "center" }]}
      >
        <IconSvg size={16} name="icComment" color={colors.textOpacity8} />

        <Text style={styles.textLikeShare}>{data?.comment_number || "0"}</Text>
      </TouchableOpacity> */}
      <CommentBtn data={data} pressComment={pressComment} />
      <TouchableOpacity
        onPress={_sharePost}
        style={[styles.viewLike, { justifyContent: "flex-end" }]}
      >
        <IconSvg size={16} name="icSharePost" color={colors.text} />
        <Text style={styles.textLikeShare}>{translations.post.share}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LikeSharePostItem;
