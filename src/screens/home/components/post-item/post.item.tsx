/* eslint-disable camelcase */
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import createStyles from "./post.item.style";
import HeaderItempost from "./header.post.item";
import AvatarPost from "./avatar.post";
import ListFile from "./list.media.post.item";
import LikeSharePostItem from "./like.share.post.item";

import CommonStyle from "@theme/styles";
import { SCREENS } from "constants";
import { showWarningLogin } from "@helpers/super.modal.helper";
import useStore from "@services/zustand/store";
import { TypedPost } from "shared/models";
import PressableBtn from "@shared-components/button/PressableBtn";

const SIZE_AVATAR = 32;
const FONT_SIZE = 16;

interface ItemPostProps {
  data: TypedPost;
  isProfile?: boolean;
}

const ItemPost = ({ data, isProfile }: ItemPostProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const userData = useStore((state) => state.userData);

  const goToProfileCurrentUser = () => {
    if (!isProfile) {
      NavigationService.navigate(SCREENS.PROFILE_CURRENT_USER, {
        _id: data?.user_id?._id,
        userInfo: data.user_id,
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

  return (
    <View style={styles.container}>
      <AvatarPost
        data={data}
        pressAvatar={goToProfileCurrentUser}
        sizeAvatar={SIZE_AVATAR}
        showLevel
      />
      <View style={{ ...CommonStyle.flex1 }}>
        <PressableBtn
          onPress={detailScreen}
          style={[CommonStyle.flex1, { paddingLeft: 8 }]}
        >
          <HeaderItempost data={data} onPress={goToProfileCurrentUser} />
          {HasTag}
          {ContentStatus}
          <ListFile listFile={data?.attach_files || []} />
        </PressableBtn>
        <LikeSharePostItem data={data} pressComment={pressComment} />
      </View>
    </View>
  );
};

export default React.memo(ItemPost);
