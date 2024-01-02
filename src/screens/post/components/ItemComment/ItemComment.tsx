/* eslint-disable camelcase */

import { useTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";
import IconSvg from "assets/svg";
import React, { useMemo, useState } from "react";
import { Text, View, StyleSheet, Pressable, Image } from "react-native";
import { convertLastActive } from "../ItemPost/time";
import Icon from "react-native-vector-icons/Ionicons";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import { postLikeCommnent } from "@services/api/post";

const SIZE_AVATAR = 30;
const BORDER_AVATAR = 12;
const FONT_SIZE = 12;
const PADDING_LEFT = 12;

interface ItemCommentProps {
  data: any;
  onPressReply: (data: string) => void;
}

interface ItemReplyProps {
  item: any;
  onPressReply: (data: string) => void;
}

const ItemReply = ({ item, onPressReply }: ItemReplyProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const [isLike, setIsLike] = useState<boolean>(item?.is_like);
  const [likeNumber, setLikeNumber] = useState<number>(item?.like_number);

  const pressLikeComment = async () => {
    const params = {
      comment_id: item._id,
    };
    const res = await postLikeCommnent(params);
    const { community_id, is_like, vote_number } = res;
    if (community_id) {
      setIsLike(is_like);
      setLikeNumber(vote_number);
    }
  };

  const AvatarRep = useMemo(() => {
    return (
      <View
        style={{
          width: SIZE_AVATAR,
          height: SIZE_AVATAR,
          borderRadius: BORDER_AVATAR,
        }}
      >
        <Image
          source={{ uri: item?.user_id?.user_avatar_thumbnail }}
          style={{
            width: SIZE_AVATAR,
            height: SIZE_AVATAR,
            borderRadius: BORDER_AVATAR,
          }}
        />
      </View>
    );
  }, [item]);

  const pressMore = () => {};

  const HeaderItemComment = useMemo(() => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            flex: 1,
          }}
        >
          <Text
            style={{
              ...CommonStyle.hnBold,
              fontSize: FONT_SIZE,
              color: colors.mainColor2,
            }}
          >
            {item?.user_id?.display_name}
          </Text>
          {item?.user_id?.official_status && (
            <IconSvg name="icVerify" size={14} />
          )}
          <View
            style={{
              width: 2,
              height: 2,
              borderRadius: 1,
              backgroundColor: colors.text,
            }}
          />
          <Text
            style={{
              ...CommonStyle.hnRegular,
              color: colors.text,
              fontSize: FONT_SIZE,
            }}
          >
            {convertLastActive(item?.createdAt)}
          </Text>
        </View>
        <Pressable onPress={pressMore}>
          <Icon size={20} name="ellipsis-vertical" />
        </Pressable>
      </View>
    );
  }, [item]); // eslint-disable-line react-hooks/exhaustive-deps

  const ContentStatus = useMemo(() => {
    return (
      <Text
        style={{
          color: colors.mainColor2,
          ...CommonStyle.hnRegular,
          fontSize: FONT_SIZE,
          marginBottom: 4,
        }}
      >
        {item?.content}
      </Text>
    );
  }, [item]); // eslint-disable-line react-hooks/exhaustive-deps

  const LikeCommentReply = () => {
    return (
      <View style={styles.containerLikeShare}>
        <Pressable onPress={pressLikeComment} style={[styles.viewLike]}>
          <Text style={isLike ? styles.textLiked : styles.textLikeShare}>
            {likeNumber > 0 && likeNumber} {translations.like}
          </Text>
        </Pressable>
        <View
          style={{
            width: 2,
            height: 2,
            borderRadius: 1,
            backgroundColor: colors.text,
          }}
        />
        <Pressable
          onPress={() => onPressReply(item)}
          style={[styles.viewLike, { justifyContent: "center" }]}
        >
          <Text style={styles.textLikeShare}>{translations.reply}</Text>
        </Pressable>
      </View>
    );
  };
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        marginTop: 10,
      }}
    >
      {AvatarRep}
      <View style={{ paddingLeft: PADDING_LEFT, flex: 1 }}>
        {HeaderItemComment}
        {ContentStatus}
        <LikeCommentReply />
      </View>
    </View>
  );
};

const ItemComment = ({ data, onPressReply }: ItemCommentProps) => {
  const theme = useTheme();
  const { colors } = theme;

  const pressMore = () => {};
  // const [listReply, setListReply] = useState<any[]>(data?.child || []);
  const listReply = data?.child || [];
  const [isLike, setIsLike] = useState<boolean>(data?.is_like);
  const [likeNumber, setLikeNumber] = useState<number>(data.like_number);
  const Avatar = useMemo(() => {
    return (
      <View
        style={{
          width: SIZE_AVATAR,
          height: SIZE_AVATAR,
          borderRadius: BORDER_AVATAR,
        }}
      >
        <Image
          source={{ uri: data?.user_id?.user_avatar_thumbnail }}
          style={{
            width: SIZE_AVATAR,
            height: SIZE_AVATAR,
            borderRadius: BORDER_AVATAR,
          }}
        />
      </View>
    );
  }, [data]);

  const HeaderItemComment = useMemo(() => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            flex: 1,
          }}
        >
          <Text
            style={{
              ...CommonStyle.hnBold,
              fontSize: FONT_SIZE,
              color: colors.mainColor2,
            }}
          >
            {data?.user_id?.display_name}
          </Text>
          {data?.user_id?.official_status && (
            <IconSvg name="icVerify" size={14} />
          )}
          <View
            style={{
              width: 2,
              height: 2,
              borderRadius: 1,
              backgroundColor: colors.text,
            }}
          />
          <Text
            style={{
              ...CommonStyle.hnRegular,
              color: colors.text,
              fontSize: FONT_SIZE,
            }}
          >
            {convertLastActive(data?.createdAt)}
          </Text>
        </View>
        <Pressable onPress={pressMore}>
          <Icon size={20} name="ellipsis-vertical" />
        </Pressable>
      </View>
    );
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps
  const ContentStatus = useMemo(() => {
    return (
      <Text
        style={{
          color: colors.mainColor2,
          ...CommonStyle.hnRegular,
          fontSize: FONT_SIZE,
          marginBottom: 4,
        }}
      >
        {data?.content}
      </Text>
    );
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const pressLikeComment = async () => {
    const params = {
      comment_id: data._id,
    };
    // console.log("params...", params);
    console.log("data...", JSON.stringify(data));
    const res = await postLikeCommnent(params);
    // console.log("res.like.comment...", res);
    const { community_id, is_like, vote_number } = res;
    if (community_id) {
      setIsLike(is_like);
      setLikeNumber(vote_number);
    }
  };
  const pressCommnet = () => {};

  const LikeComment = () => {
    return (
      <View style={styles.containerLikeShare}>
        <Pressable onPress={pressLikeComment} style={[styles.viewLike]}>
          <Text style={isLike ? styles.textLiked : styles.textLikeShare}>
            {likeNumber > 0 && likeNumber} {translations.like}
          </Text>
        </Pressable>
        {data?.child_number > 0 && (
          <View
            style={{
              width: 2,
              height: 2,
              borderRadius: 1,
              backgroundColor: colors.text,
            }}
          />
        )}
        {data?.child_number > 0 && (
          <Pressable onPress={pressCommnet} style={[styles.viewLike]}>
            <Text style={styles.textLikeShare}>
              {data.child_number} {translations.comment}
            </Text>
          </Pressable>
        )}
        <View
          style={{
            width: 2,
            height: 2,
            borderRadius: 1,
            backgroundColor: colors.text,
          }}
        />
        <Pressable
          onPress={() => onPressReply(data)}
          style={[styles.viewLike, { justifyContent: "center" }]}
        >
          <Text style={styles.textLikeShare}>{translations.reply}</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {Avatar}
      <View style={{ paddingLeft: PADDING_LEFT, flex: 1 }}>
        {HeaderItemComment}
        {ContentStatus}
        <LikeComment />
        {listReply.map((item) => {
          return (
            <ItemReply key={item._id} item={item} onPressReply={onPressReply} />
          );
        })}
      </View>
    </View>
  );
};

export default ItemComment;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 2,
    backgroundColor: palette.background,
    paddingTop: 14,
    paddingBottom: 4,
  },

  containerLikeShare: {
    flexDirection: "row",
    marginTop: 4,
    alignItems: "center",
    gap: 8,
  },
  viewLike: {
    flexDirection: "row",
    alignItems: "center",
  },
  textLikeShare: {
    ...CommonStyle.hnRegular,
    fontSize: FONT_SIZE,
    color: palette.text,
  },
  textLiked: {
    ...CommonStyle.hnRegular,
    fontSize: FONT_SIZE,
    color: palette.primary,
  },
});
