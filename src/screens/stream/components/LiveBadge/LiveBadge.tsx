import React, { useCallback } from "react";
import { View, Text, Image } from "react-native";

import styles from "./LiveBadge.styles";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { palette } from "@theme/themes";
import useStore from "@services/zustand/store";
import { translations } from "@localization";

const LiveBadge = () => {
  const viewNumber = useStore((state) => state.viewNumber);
  const emojiNumber = useStore((state) => state.emojiNumber);
  const userLive = useStore((state) => state.userLive);

  const ViewAvatar = useCallback(() => {
    const sizeAvatar = 40;
    const BORDER_AVATAR = sizeAvatar / 2;
    return (
      <Image
        source={{
          uri: userLive?.user_avatar || userLive?.user_avatar_thumbnail,
        }}
        style={{
          width: sizeAvatar,
          height: sizeAvatar,
          borderRadius: BORDER_AVATAR,
        }}
      />
    );
  }, [userLive]);

  return (
    <>
      <View style={styles.viewName}>
        <View style={styles.avatar}>
          <ViewAvatar />
        </View>
        <View>
          <Text style={styles.txtName}>{userLive?.display_name}</Text>
          <Text
            style={styles.txtLike}
          >{`${emojiNumber} ${translations.liveStream.likes}`}</Text>
        </View>
      </View>
      <View style={styles.viewCountBox}>
        <Icon
          type={IconType.Ionicons}
          color={palette.white}
          name={"eye"}
          size={18}
        />
        <Text style={styles.viewCountTxt}>
          {viewNumber > 0 ? viewNumber : 0}
        </Text>
      </View>
    </>
  );
};

export default React.memo(LiveBadge);
