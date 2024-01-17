/* eslint-disable camelcase */
import React, { useMemo } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import * as NavigationService from "react-navigation-helpers";

import createStyles from "./ItemPost.style";
import LikeBtn from "../like-btn/LikeBtn";

import CommonStyle from "@theme/styles";
import IconSvg from "assets/svg";
import { convertLastActive } from "@utils/time.utils";
import { SCREENS } from "constants";
import {
  showDetailImageView,
  showWarningLogin,
  showSuperModalByType,
} from "@helpers/super.modal.helper";
import { sharePost } from "@utils/share.utils";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import { TypedRequest } from "shared/models";

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

interface ItemPostProps {
  data: TypedRequest;
  isProfile?: boolean;
}

const ItemPost = ({ data, isProfile }: ItemPostProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const userData = useStore((state) => state.userData);

  const goToProfileCurrentUser = () => {
    if (!isProfile) {
      NavigationService.push(SCREENS.PROFILE_CURRENT_USER, {
        _id: data?.user_id?._id,
      });
    }
  };

  const Avatar = useMemo(() => {
    return (
      <Pressable
        onPress={goToProfileCurrentUser}
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
      </Pressable>
    );
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const _showStickBottom = () => {
    showSuperModalByType({
      type: "report",
      data: {
        report_type: "post",
        partner_id: data?.user_id?._id,
      },
    });
    // if (!userData) {
    //   showWarningLogin();
    // } else {
    //   showStickBottom(data, "post");
    // }
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
            onPress={goToProfileCurrentUser}
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
        <TouchableOpacity onPress={_showStickBottom}>
          <Icon
            size={20}
            name="ellipsis-vertical"
            type={IconType.Ionicons}
            color={colors.text}
          />
        </TouchableOpacity>
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
          ...CommonStyle.hnRegular,
          color: colors.mainColor2,
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
          color={colors.primary}
        />
      </View>
    );
  };

  const ListFile = useMemo(() => {
    const listFile = data?.attach_files || [];
    const listMedia = listFile.filter(
      (i: any) =>
        i.media_mime_type.includes("image") ||
        i.media_mime_type.includes("video"),
    );
    if (listMedia.length == 1) {
      return (
        <Pressable onPress={() => showImageVideo(0)} style={styles.image11}>
          <Image
            style={styles.image11}
            source={{ uri: listMedia[0].media_thumbnail }}
          />
          {listMedia[0].media_mime_type.includes("video") && <PlayVideo />}
        </Pressable>
      );
    }
    if (listMedia.length == 2) {
      return (
        <View
          style={{ flexDirection: "row", height: SIZE_IMAGE2, gap: GAP_IMAGE }}
        >
          <Pressable onPress={() => showImageVideo(0)} style={styles.image12}>
            <Image
              style={styles.image12}
              source={{ uri: listMedia[0].media_thumbnail }}
            />
            {listMedia[0].media_mime_type.includes("video") && <PlayVideo />}
          </Pressable>
          <Pressable onPress={() => showImageVideo(1)} style={styles.image22}>
            <Image
              style={styles.image22}
              source={{ uri: listMedia[1].media_thumbnail }}
            />
            {listMedia[1].media_mime_type.includes("video") && <PlayVideo />}
          </Pressable>
        </View>
      );
    }
    if (listMedia.length == 3) {
      return (
        <View
          style={{ flexDirection: "row", height: SIZE_IMAGE2, gap: GAP_IMAGE }}
        >
          <Pressable onPress={() => showImageVideo(0)} style={styles.image12}>
            <Image
              style={styles.image12}
              source={{ uri: listMedia[0].media_thumbnail }}
            />
            {listMedia[0].media_mime_type.includes("video") && <PlayVideo />}
          </Pressable>
          <View style={{ ...CommonStyle.flex1, gap: GAP_IMAGE }}>
            <Pressable onPress={() => showImageVideo(1)} style={styles.image23}>
              <Image
                style={styles.image23}
                source={{ uri: listMedia[1].media_thumbnail }}
              />
              {listMedia[1].media_mime_type.includes("video") && <PlayVideo />}
            </Pressable>
            <Pressable onPress={() => showImageVideo(2)} style={styles.image33}>
              <Image
                style={styles.image33}
                source={{ uri: listMedia[2].media_thumbnail }}
              />
              {listMedia[2].media_mime_type.includes("video") && <PlayVideo />}
            </Pressable>
          </View>
        </View>
      );
    }
    if (listMedia.length > 3) {
      return (
        <View
          style={{ flexDirection: "row", height: SIZE_IMAGE2, gap: GAP_IMAGE }}
        >
          <Pressable onPress={() => showImageVideo(0)} style={styles.image12}>
            <Image
              style={styles.image12}
              source={{ uri: listMedia[0].media_thumbnail }}
            />
            {listMedia[0].media_mime_type.includes("video") && <PlayVideo />}
          </Pressable>
          <View style={{ ...CommonStyle.flex1, gap: GAP_IMAGE }}>
            <Pressable
              onPress={() => showImageVideo(1)}
              style={{ ...CommonStyle.flex1 }}
            >
              <Image
                style={{
                  ...CommonStyle.flex1,
                  borderTopRightRadius: BORDER_RADIUS2,
                }}
                source={{ uri: listMedia[1].media_thumbnail }}
              />
              {listMedia[1].media_mime_type.includes("video") && <PlayVideo />}
            </Pressable>
            <Pressable
              onPress={() => showImageVideo(2)}
              style={{ ...CommonStyle.flex1 }}
            >
              <Image
                style={{
                  ...CommonStyle.flex1,
                  borderBottomRightRadius: BORDER_RADIUS2,
                }}
                source={{ uri: listMedia[2].media_thumbnail }}
              />
              <View
                style={{
                  ...CommonStyle.fillParent,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.blackOverlay,
                  borderBottomRightRadius: 12,
                }}
              >
                <Text style={{ color: colors.primary }}>
                  +{listMedia.length - 3}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      );
    }

    return null;
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const pressComment = () => {
    if (!userData) {
      showWarningLogin();
    } else {
      const param = { id: data._id, data: data, isComment: true };
      NavigationService.push(SCREENS.POST_DETAIL, param);
    }
  };

  const LikeShare = () => {
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
          <Text style={styles.textLikeShare}>
            {data?.comment_number || "0"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
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
        </TouchableOpacity>
      </View>
    );
  };

  const detailScreen = () => {
    if (!userData) {
      showWarningLogin();
    } else {
      const param = { id: data._id, data: data };
      NavigationService.push(SCREENS.POST_DETAIL, param);
    }
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

  return (
    <View style={styles.container}>
      {Avatar}
      <View style={{ paddingLeft: PADDING_LEFT, ...CommonStyle.flex1 }}>
        <Pressable onPress={detailScreen} style={CommonStyle.flex1}>
          {HeaderItemPost}
          {HasTag}
          {ContentStatus}
          {ListFile}
        </Pressable>
        <LikeShare />
      </View>
    </View>
  );
};

export default React.memo(ItemPost);
