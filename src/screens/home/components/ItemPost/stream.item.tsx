/* eslint-disable camelcase */
import React, { useMemo, useState } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";

import CommonStyle from "@theme/styles";
import IconSvg from "assets/svg";
import { convertLastActive } from "@utils/time.utils";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";
import { showDetailImageView } from "@helpers/super.modal.helper";
import { sharePost } from "@utils/share.utils";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import createStyles from "./ItemPost.style";
import { showStickBottom } from "@shared-components/stick-bottom/HomeStickBottomModal";
import VideoPlayer from "@shared-components/video.player.component";
import LiveBadge from "@screens/stream/components/LiveBadge/LiveBadge";

const { width } = Dimensions.get("screen");

const PADDING_HORIZONTAL = 16;
const SIZE_AVATAR = 30;
const BORDER_AVATAR = 12;
const GAP_HEADER = 10;
const GAP_IMAGE = 4;
const FONT_SIZE = 16;
const BORDER_RADIUS2 = 12;
const PADDING_LEFT = 12;
const SIZE_IMAGE1 = width - PADDING_HORIZONTAL * 2 - PADDING_LEFT - SIZE_AVATAR;
const SIZE_IMAGE2 = (SIZE_IMAGE1 - 4) / 2;

interface StreamItemProps {
  data: any;
  refreshing?: boolean;
}

const StreamItem = ({ data, refreshing }: StreamItemProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const [isLike, setIsLike] = useState<boolean>(data?.is_like);
  const [likeNumber, setLikeNumber] = useState<number>(data?.like_number);
  const updateListLike = useStore((state) => state.updateListLike);
  const styles = React.useMemo(() => createStyles(theme), [theme]);

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
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const pressLike = async () => {};

  const _showStickBottom = () => {
    showStickBottom(data, "post");
  };

  const HeaderItemPost = useMemo(() => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View
          style={{
            ...CommonStyle.flex1,
            flexDirection: "row",
            alignItems: "center",
            gap: GAP_HEADER,
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
      </View>
    );
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const HasTag = useMemo(() => {
    if (
      data &&
      data.post_category &&
      data.post_category.category_content &&
      data.post_category.category_content.trim() !== ""
    )
      return (
        <Text
          style={{
            ...CommonStyle.hnBold,
            fontSize: FONT_SIZE,
            color: colors.primary,
          }}
        >
          #{data.post_category.category_content}
        </Text>
      );
    return null;
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const ContentStatus = useMemo(() => {
    return (
      <Text
        numberOfLines={2}
        style={{
          color: colors.mainColor2,
          ...CommonStyle.hnRegular,
          fontSize: FONT_SIZE,
          marginBottom: 4,
        }}
      >
        {data?.post_content}
      </Text>
    );
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const PlayVideo = () => {
    return (
      <View
        style={{
          ...CommonStyle.fillParent,
          zIndex: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon
          size={62}
          name={"play-circle"}
          type={IconType.Ionicons}
          color={colors.text}
        />
      </View>
    );
  };

  const pressComment = () => {
    const param = { id: data._id, data: data, isComment: true };
    NavigationService.push(SCREENS.POST_DETAIL, param);
  };

  const LikeShare = () => {
    return (
      <View style={styles.containerLikeShare}>
        <Pressable
          onPress={pressLike}
          style={[styles.viewLike, { justifyContent: "flex-start" }]}
        >
          <Icon
            type={IconType.Ionicons}
            size={16}
            name={isLike ? "heart" : "heart-outline"}
            color={isLike ? colors.primary : colors.text}
          />

          <Text style={styles.textLikeShare}>{likeNumber}</Text>
        </Pressable>
        <Pressable
          onPress={pressComment}
          style={[styles.viewLike, { justifyContent: "center" }]}
        >
          <Icon
            type={IconType.Ionicons}
            size={16}
            name="chatbubbles-outline"
            color={colors.text}
          />
          <Text style={styles.textLikeShare}>
            {data?.comment_number || "0"}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => sharePost(data.post_slug)}
          style={[styles.viewLike, { justifyContent: "flex-end" }]}
        >
          <Icon
            type={IconType.Ionicons}
            size={16}
            name="share-social-outline"
            color={colors.text}
          />
          <Text style={styles.textLikeShare}>{translations.post.share}</Text>
        </Pressable>
      </View>
    );
  };

  const detailScreen = () => {
    const param = { id: data._id, data: data, isLike: isLike };
    NavigationService.push(SCREENS.POST_DETAIL, param);
  };
  const showImageVideo = (index: number) => {
    //gọi supermodal hiển thị danh sách image, video
    // truyền vào danh sách
    const listMedia = data.attach_files.filter(
      (i: any) =>
        i.media_mime_type.includes("image") ||
        i.media_mime_type.includes("video"),
    );
    const listLink = listMedia.map((i: any) => ({
      url: i.media_url,
      type: i.media_type,
      media_meta: i.media_meta,
    }));
    showDetailImageView(listLink, index, listMedia[0].media_type);
  };

  const renderVideoLive = () => {
    return (
      <View style={{ flex: 1, ...CommonStyle.flexCenter, borderRadius: 10 }}>
        <LiveBadge
          customStyle={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
        <VideoPlayer
          mediaUrl={data.livestream_data?.m3u8_url}
          // mediaUrl={
          //   "https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8"
          // }
          resizeMode="cover"
          width={styles.image11.width}
          height={styles.image11.height}
          autoPlay={false}
          onPress={goToViewStream}
        />
      </View>
    );
  };

  const goToViewStream = () => {
    NavigationService.navigate(SCREENS.VIEW_LIVE_STREAM, {
      liveStreamId: data._id,
    });
  };

  return (
    <View style={styles.container}>
      {Avatar}
      <View style={{ paddingLeft: PADDING_LEFT, ...CommonStyle.flex1 }}>
        <Pressable onPress={goToViewStream} style={CommonStyle.flex1}>
          {HeaderItemPost}
          {HasTag}
          {ContentStatus}
          {renderVideoLive()}
        </Pressable>
        {/* <LikeShare /> */}
      </View>
    </View>
  );
};

export default StreamItem;
