import * as React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";

import LikeBtn from "../like-btn/LikeBtn";

import { TypedPost } from "shared/models";
import createStyles from "./post.item.style";
import { translations } from "@localization";
import { sharePost } from "@utils/share.utils";
import CommentBtn from "../comment-btn/CommentBtn";
import useStore from "@services/zustand/store";
import { palette } from "@theme/themes";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import IconSvg from "assets/svg";
import PressableBtn from "@shared-components/button/PressableBtn";
interface LikeSharePostItemProps {
  data: TypedPost;
  pressComment: () => void;
}

const CountComment = ({ data }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const listCountComments = useStore((state) => state.listCountComments);
  const listLike = useStore((state) => state.listLike);
  const [cmtNumber, setCmtNumber] = React.useState<number | string>("0");
  const [likeNumber, setLikeNumber] = React.useState(data?.like_number || 0);
  React.useEffect(() => {
    const updateCommentAndLikeNumbers = () => {
      const commentIndex = listCountComments.findIndex(
        (item) => item._id === data?._id,
      );
      if (commentIndex >= 0) {
        setCmtNumber(listCountComments[commentIndex].numberComments);
      } else {
        setCmtNumber(data?.comment_number || 0);
      }

      const likeIndex = listLike.findIndex((item) => item._id === data?._id);
      if (likeIndex >= 0) {
        setLikeNumber(listLike[likeIndex].numberLike);
      }
    };

    updateCommentAndLikeNumbers();
  }, [listCountComments, listLike, data]);
  return (
    <View
      style={[
        styles.containerLikeShare,
        cmtNumber > 0 || likeNumber > 0
          ? { borderBottomWidth: 1, borderColor: palette.borderColor }
          : {},
      ]}
    >
      {likeNumber > 0 && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Icon
            type={IconType.Ionicons}
            size={16}
            name={"heart"}
            color={palette.textOpacity6}
          />
          <Text style={styles.text}>{likeNumber}</Text>
        </View>
      )}
      {cmtNumber > 0 && (
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Text style={styles.text}>
            {cmtNumber} {translations.post.comment.toLowerCase()}
          </Text>
        </View>
      )}
    </View>
  );
};

const BtnShare = () => {
  const userData = useStore((store) => store.userData);

  const _sharePost = () => {
    sharePost(userData?.invitation_code);
    // shareCodeInvite(userData?.invitation_code || "");
  };
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  return (
    <PressableBtn
      onPress={_sharePost}
      style={[styles.viewLike, { justifyContent: "flex-end" }]}
    >
      <IconSvg size={20} name="icShare" />
      <Text style={styles.textLikeShare}>{translations.post.share}</Text>
    </PressableBtn>
  );
};

const LikeSharePostItem = ({ data, pressComment }: LikeSharePostItemProps) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <>
      <CountComment data={data} />
      <View style={styles.containerLikeShare}>
        <LikeBtn data={data} />
        <CommentBtn pressComment={pressComment} />
        <BtnShare />
      </View>
    </>
  );
};

export default LikeSharePostItem;
