/* eslint-disable camelcase */

import React, { useEffect, useMemo, useState } from "react";
import { Text, View, Pressable, Image } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { useTheme } from "@react-navigation/native";

import createStyles from "./ItemComment.style";

import IconSvg from "assets/svg";
import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import { postLikeCommnent } from "@services/api/post";
import useStore from "@services/zustand/store";
import { showToast } from "@helpers/super.modal.helper";
import { convertLastActive } from "@utils/time.utils";
import { showStickBottom } from "@shared-components/stick-bottom/HomeStickBottomModal";
import { showWarningLogin } from "@screens/home/components/request-login/login.request";

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
  onPressReplyChild: (data: string) => void;
  repCmtId: string;
}

const ItemReply = ({ item, onPressReplyChild, repCmtId }: ItemReplyProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const userData = useStore((state) => state.userData);

  const [isLike, setIsLike] = useState<boolean>(item?.is_like);
  const [likeNumber, setLikeNumber] = useState<number>(item?.like_number);
  const pressLikeCommentRep = async () => {
    if (!userData) {
      showWarningLogin();
    } else {
      const params = {
        comment_id: item._id,
      };

      setIsLike((isLike) => !isLike);
      postLikeCommnent(params).then((res) => {
        if (!res.isError) {
          setLikeNumber(res.like_number);
        } else {
          setIsLike(!isLike);
          showToast({
            type: "error",
            message: translations.post.likeError,
          });
        }
      });
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

  const _showStickBottom = () => showStickBottom(item, "comment");

  const HeaderItemComment = useMemo(() => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View
          style={{
            ...CommonStyle.flex1,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
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
        <Pressable onPress={_showStickBottom}>
          <Icon
            size={20}
            name="ellipsis-vertical"
            type={IconType.Ionicons}
            color={colors.text}
          />
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
  }, [item, item.content]); // eslint-disable-line react-hooks/exhaustive-deps

  const LikeCommentReply = () => {
    const replyItem = item;
    replyItem.parent_id = repCmtId;
    return (
      <View style={styles.containerLikeShare}>
        <Pressable onPress={pressLikeCommentRep} style={[styles.viewLike]}>
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
          onPress={() => onPressReplyChild(replyItem)}
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
      <View style={{ paddingLeft: PADDING_LEFT, ...CommonStyle.flex1 }}>
        {HeaderItemComment}
        {ContentStatus}
        <LikeCommentReply />
      </View>
    </View>
  );
};

//////////////////////////////

const ItemComment = ({ data, onPressReply }: ItemCommentProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const listCommentDelete = useStore((state) => state.listCommentDelete);
  const userData = useStore((state) => state.userData);

  const [listReply, setListReply] = useState([]);
  const [isLike, setIsLike] = useState<boolean>(data?.is_like);
  const [likeNumber, setLikeNumber] = useState<number>(data.like_number);
  useEffect(() => {
    setListReply(data.child || []);
  }, [data, data.child]);

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
  const _showStickBottom = () => {
    if (!userData) {
      showWarningLogin();
    } else {
      showStickBottom(data, "comment");
    }
  };

  const HeaderItemComment = useMemo(() => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            ...CommonStyle.flex1,
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
        <Pressable onPress={_showStickBottom}>
          <Icon
            size={20}
            name="ellipsis-vertical"
            type={IconType.Ionicons}
            color={colors.text}
          />
        </Pressable>
      </View>
    );
  }, [data, data.user_id]); // eslint-disable-line react-hooks/exhaustive-deps
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
  }, [data, data.content]); // eslint-disable-line react-hooks/exhaustive-deps

  const pressLikeComment = async () => {
    if (!userData) {
      showWarningLogin();
    } else {
      const params = {
        comment_id: data._id,
      };
      setIsLike((isLike) => !isLike);
      postLikeCommnent(params).then((res) => {
        if (!res.isError) {
          setLikeNumber(res.like_number);
        } else {
          setIsLike((isLike) => !isLike);
          showToast({
            type: "error",
            message: translations.post.likeError,
          });
        }
      });
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
      <View style={{ paddingLeft: PADDING_LEFT, ...CommonStyle.flex1 }}>
        {HeaderItemComment}
        {ContentStatus}
        <LikeComment />
        {listReply.length > 0 &&
          listReply
            .filter((item) => listCommentDelete.indexOf(item._id) < 0)
            .map((item) => {
              return (
                <ItemReply
                  key={item._id}
                  item={item}
                  repCmtId={data._id}
                  onPressReplyChild={onPressReply}
                />
              );
            })}
      </View>
    </View>
  );
};

export default ItemComment;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     paddingHorizontal: 16,
//     marginBottom: 2,
//     backgroundColor: palette.background,
//     paddingTop: 14,
//     paddingBottom: 4,
//   },

//   containerLikeShare: {
//     flexDirection: "row",
//     marginTop: 4,
//     alignItems: "center",
//     gap: 8,
//   },
//   viewLike: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   textLikeShare: {
//     ...CommonStyle.hnRegular,
//     fontSize: FONT_SIZE,
//     color: palette.text,
//   },
//   textLiked: {
//     ...CommonStyle.hnRegular,
//     fontSize: FONT_SIZE,
//     color: palette.primary,
//   },
// });
