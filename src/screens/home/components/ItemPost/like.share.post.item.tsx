import * as React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import LikeBtn from "../like-btn/LikeBtn";

import { TypedRequest } from "shared/models";
import createStyles from "./ItemPost.style";
import { translations } from "@localization";
import { sharePost } from "@utils/share.utils";

interface LikeSharePostItemProps {
  data: TypedRequest;
  pressComment: () => void;
}

const LikeSharePostItem = ({ data, pressComment }: LikeSharePostItemProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const _sharePost = () => {
    sharePost(data.post_slug);
  };
  return (
    <View style={styles.containerLikeShare}>
      <LikeBtn data={data} />
      <TouchableOpacity
        onPress={pressComment}
        style={[styles.viewLike, { justifyContent: "center" }]}
      >
        <Icon
          type={IconType.Ionicons}
          size={16}
          name="chatbubbles-outline"
          color={colors.text}
        />
        <Text style={styles.textLikeShare}>{data?.comment_number || "0"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={_sharePost}
        style={[styles.viewLike, { justifyContent: "flex-end" }]}
      >
        <Icon
          type={IconType.Ionicons}
          size={16}
          name="share-social-outline"
          color={colors.text}
        />
        <Text style={styles.textLikeShare}>{translations.post.share}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LikeSharePostItem;
