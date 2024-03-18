/* eslint-disable camelcase */

import React, { useEffect, useMemo, useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { useTheme } from "@react-navigation/native";

import createStyles from "./ItemComment.style";

import IconSvg from "assets/svg";
import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import { postLikeCommnent } from "@services/api/post";
import useStore from "@services/zustand/store";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showToast,
  showWarningLogin,
} from "@helpers/super.modal.helper";
import { convertLastActive } from "@utils/time.utils";
import { TypedComment } from "shared/models";
import PressableBtn from "@shared-components/button/PressableBtn";
import AvatarPost from "@screens/home/components/post-item/avatar.post";

const SIZE_AVATAR = 32;
const PADDING_LEFT = 12;

interface ItemCommentProps {
  data: TypedComment;
  onPressReply: (data: string) => void;
}

interface ItemReplyProps {
  item: TypedComment;
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
      <AvatarPost data={item?.user_id} sizeAvatar={SIZE_AVATAR} showLevel />
    );
  }, [item]);

  const _showStickBottom = () =>
    showSuperModal({
      contentModalType: EnumModalContentType.CommentAction,
      styleModalType: EnumStyleModalType.Bottom,
      data: item,
    });

  const HeaderItemComment = useMemo(() => {
    return (
      <View style={styles.containerHeader}>
        <View style={styles.viewTxtHeader}>
          <Text style={styles.txtHeader}>{item?.user_id?.display_name}</Text>
          {item?.user_id?.official_status && (
            <IconSvg name="icVerify" size={14} />
          )}
          {/* <View style={styles.viewDot} /> */}
          <Text style={styles.txtTimeHeader}>
            {convertLastActive(item?.createdAt)}
          </Text>
        </View>
        {!item?.sending && (
          <PressableBtn onPress={_showStickBottom}>
            <Icon
              size={20}
              name="ellipsis-vertical"
              type={IconType.Ionicons}
              color={colors.textOpacity6}
            />
          </PressableBtn>
        )}
      </View>
    );
  }, [item]); // eslint-disable-line react-hooks/exhaustive-deps

  const ContentStatus = useMemo(() => {
    return (
      <View style={styles.viewContentComment}>
        <Text style={styles.txtContentComment}>{item?.content}</Text>
        {item.sending && (
          <ActivityIndicator
            color={colors.text}
            style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}
            size={"small"}
          />
        )}
      </View>
    );
  }, [item, item.content]); // eslint-disable-line react-hooks/exhaustive-deps

  const LikeCommentReply = () => {
    const replyItem = item;
    replyItem.parent_id = repCmtId;
    return (
      <View style={styles.containerLikeShare}>
        <PressableBtn onPress={pressLikeCommentRep} style={[styles.viewLike]}>
          <Text style={isLike ? styles.textLiked : styles.textLikeShare}>
            {likeNumber > 0 && likeNumber} {translations.like}
          </Text>
        </PressableBtn>
        <PressableBtn
          onPress={() => onPressReplyChild(replyItem)}
          style={[styles.viewLike, { justifyContent: "center" }]}
        >
          <Text style={styles.textReply}>{translations.reply}</Text>
        </PressableBtn>
      </View>
    );
  };

  return (
    <View style={styles.containerItemRep}>
      {AvatarRep}
      <View style={{ paddingLeft: PADDING_LEFT, ...CommonStyle.flex1 }}>
        {HeaderItemComment}
        {ContentStatus}
        {!item.sending && <LikeCommentReply />}
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

  const [listReply, setListReply] = useState<TypedComment[]>([]);
  const [isLike, setIsLike] = useState<boolean>(data?.is_like);
  const [likeNumber, setLikeNumber] = useState<number>(data.like_number);
  useEffect(() => {
    setListReply(data.child || []);
  }, [data, data.child]);

  const Avatar = useMemo(() => {
    return (
      <AvatarPost sizeAvatar={SIZE_AVATAR} data={data?.user_id} showLevel />
    );
  }, [data]);
  const _showStickBottom = () => {
    if (!userData) {
      showWarningLogin();
    } else {
      showSuperModal({
        contentModalType: EnumModalContentType.CommentAction,
        styleModalType: EnumStyleModalType.Bottom,
        data,
      });
    }
  };

  const HeaderItemComment = useMemo(() => {
    return (
      <View style={styles.containerHeader}>
        <View style={styles.viewTxtHeader}>
          <Text numberOfLines={2} style={styles.txtHeader}>
            {data?.user_id?.display_name}
          </Text>
          {data?.user_id?.official_status && (
            <IconSvg name="icVerify" size={14} />
          )}
          {/* <View style={styles.viewDot} /> */}
          <Text style={styles.txtTimeHeader}>
            {convertLastActive(data?.createdAt)}
          </Text>
        </View>
        {!data.sending && (
          <PressableBtn onPress={_showStickBottom}>
            <Icon
              size={20}
              name="ellipsis-vertical"
              type={IconType.Ionicons}
              color={colors.textOpacity6}
            />
          </PressableBtn>
        )}
      </View>
    );
  }, [data, data.user_id]); // eslint-disable-line react-hooks/exhaustive-deps
  const ContentStatus = useMemo(() => {
    return (
      <View style={styles.viewContentComment}>
        <Text style={styles.txtContentComment}>{data?.content}</Text>
        {data.sending && (
          <ActivityIndicator
            color={colors.text}
            style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}
            size={"small"}
          />
        )}
      </View>
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
        <PressableBtn onPress={pressLikeComment} style={styles.viewLike}>
          <Text style={isLike ? styles.textLiked : styles.textLikeShare}>
            {likeNumber > 0 && likeNumber} {translations.like}
          </Text>
        </PressableBtn>
        {/* {data?.child_number > 0 && <View style={styles.viewDot} />} */}
        {data?.child_number > 0 && (
          <PressableBtn onPress={pressCommnet} style={styles.viewLike}>
            <Text style={styles.textLikeShare}>
              {data.child_number} {translations.comment}
            </Text>
          </PressableBtn>
        )}
        {/* <View style={styles.viewDot} /> */}
        <PressableBtn
          onPress={() => onPressReply(data)}
          style={[styles.viewLike, { justifyContent: "center" }]}
        >
          <Text style={styles.textReply}>{translations.reply}</Text>
        </PressableBtn>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {Avatar}
      <View style={{ paddingLeft: PADDING_LEFT, ...CommonStyle.flex1 }}>
        {HeaderItemComment}
        {ContentStatus}
        {!data.sending && <LikeComment />}
        {listReply.length > 0 &&
          listReply
            .filter((item) => listCommentDelete.indexOf(item?._id) < 0)
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

export default React.memo(ItemComment);
