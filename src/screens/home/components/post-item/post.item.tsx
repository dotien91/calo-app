/* eslint-disable camelcase */
import React, { useMemo } from "react";
import { Linking, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import Hyperlink from "react-native-hyperlink";

import createStyles from "./post.item.style";
import HeaderItempost from "./header.post.item";
import AvatarPost from "./avatar.post";
import ListFile from "./list.media.post.item";
import LikeSharePostItem from "./like.share.post.item";

import CommonStyle from "@theme/styles";
import { SCREENS } from "constants";
import { TypedPost } from "shared/models";
import PressableBtn from "@shared-components/button/PressableBtn";
import ListFilePostItem from "./list.file.post.item copy";
import VisibilitySensor from "visibility-sensor-react-native";
const a =
  "https://files.exam24h.com/short/2024/06/03_1717383863099/6617c4568eb0c7a297dea6a5/IMG_4040.mov";

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
      <Hyperlink
        linkStyle={styles.link}
        onPress={(url) => Linking.openURL(url)}
      >
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
      </Hyperlink>
    );
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const pressComment = React.useCallback(() => {
    const param = { id: data._id, data: data, isComment: true };
    NavigationService.navigate(SCREENS.POST_DETAIL, param);
  }, []);

  const detailScreen = () => {
    const param = { id: data._id, data: data };
    NavigationService.push(SCREENS.POST_DETAIL, param);
  };

  const handleImageVisibility = (v) => {
    if ((data?.attach_files || [])[0]?.media_url != a) return;
    if (v) {
      console.log("show");
    } else {
      console.log("hidden");
    }
  };

  if ((data?.attach_files || [])[0]?.media_url == a)
    return (
      <View>
        <View style={styles.container}>
          <AvatarPost
            data={data?.user_id}
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
            </PressableBtn>
          </View>
        </View>
        <PressableBtn onPress={detailScreen} style={{ paddingHorizontal: 16 }}>
          {HasTag}
          {ContentStatus}
          <ListFile
            listFile={data?.attach_files || []}
            styleContainer={styles.viewImage1}
          />
          <ListFilePostItem listFile={data?.attach_files || []} />
          <LikeSharePostItem data={data} pressComment={pressComment} />
        </PressableBtn>
      </View>
    );
  return (
    <VisibilitySensor onChange={handleImageVisibility}>
      <View>
        <View style={styles.container}>
          <AvatarPost
            data={data?.user_id}
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
            </PressableBtn>
          </View>
        </View>
        <PressableBtn onPress={detailScreen} style={{ paddingHorizontal: 16 }}>
          {HasTag}
          {ContentStatus}
          <ListFile
            listFile={data?.attach_files || []}
            styleContainer={styles.viewImage1}
          />
          <ListFilePostItem listFile={data?.attach_files || []} />
          <LikeSharePostItem data={data} pressComment={pressComment} />
        </PressableBtn>
      </View>
    </VisibilitySensor>
  );
};

export default React.memo(ItemPost);
