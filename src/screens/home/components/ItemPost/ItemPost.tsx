/* eslint-disable camelcase */
import React, { useMemo } from "react";
import { Dimensions, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import createStyles from "./ItemPost.style";

import CommonStyle from "@theme/styles";
import { SCREENS } from "constants";
import { showWarningLogin } from "@helpers/super.modal.helper";
import useStore from "@services/zustand/store";
import { TypedRequest } from "shared/models";
import AvatarPost from "./avatar.post";
import HeaderItempost from "./header.post.item";
import ListFile from "./list.media.post.item";
import LikeSharePostItem from "./like.share.post.item";
import PressableBtn from "@shared-components/button/PressableBtn";

const { width } = Dimensions.get("screen");
const PADDING_HORIZONTAL = 16;
const SIZE_AVATAR = 30;
const FONT_SIZE = 16;
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

  const pressComment = () => {
    if (!userData) {
      showWarningLogin();
    } else {
      const param = { id: data._id, data: data, isComment: true };
      NavigationService.push(SCREENS.POST_DETAIL, param);
    }
  };
  const detailScreen = () => {
    if (!userData) {
      showWarningLogin();
    } else {
      const param = { id: data._id, data: data };
      NavigationService.push(SCREENS.POST_DETAIL, param);
    }
  };
  // const showImageVideo = (index: number) => {
  //   const listMedia = data.attach_files.filter(
  //     (i: any) =>
  //       i.media_mime_type.includes("image") ||
  //       i.media_mime_type.includes("video"),
  //   );
  //   showSuperModal({
  //     contentModalType: EnumModalContentType.Library,
  //     styleModalType: EnumStyleModalType.Middle,
  //     data: {
  //       listMedia,
  //       indexMedia: index,
  //     },
  //   });
  // };

  return (
    <View style={styles.container}>
      <AvatarPost
        data={data}
        pressAvatar={goToProfileCurrentUser}
        sizeAvatar={SIZE_AVATAR}
      />
      <View style={{ ...CommonStyle.flex1 }}>
        <PressableBtn
          onPress={detailScreen}
          style={[CommonStyle.flex1, { paddingLeft: 8 }]}
        >
          <HeaderItempost data={data} onPress={goToProfileCurrentUser} />
          {HasTag}
          {ContentStatus}
          <ListFile listFile={data.attach_files} sizeImage2={SIZE_IMAGE2} />
        </PressableBtn>
        <LikeSharePostItem data={data} pressComment={pressComment} />
      </View>
    </View>
  );
};

export default React.memo(ItemPost);
