import React from "react";
import { View, Text } from "react-native";

import styles from "./LiveBadge.styles";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { palette } from "@theme/themes";
import useStore from "@services/zustand/store";
import AvatarPost from "@screens/home/components/post-item/avatar.post";
import { translations } from "@localization";

const LiveBadge = () => {
  const viewNumber = useStore((state) => state.viewNumber);
  const emojiNumber = useStore((state) => state.emojiNumber);
  const userLive = useStore((state) => state.userLive);

  return (
    <>
      <View style={styles.viewName}>
        <View style={styles.avatar}>
          <AvatarPost
            data={userLive}
            style={styles.avatar}
            sizeAvatar={40}
            showLevel
          />
        </View>
        <View>
          <Text style={styles.txtName}>{userLive?.display_name}</Text>
          <Text
            style={styles.txtLike}
          >{`${emojiNumber} ${translations.liveStream.likes}`}</Text>
        </View>
      </View>
      {viewNumber > 0 && (
        <View style={styles.viewCountBox}>
          <Icon
            type={IconType.Ionicons}
            color={palette.white}
            name={"eye"}
            size={18}
          />
          <Text style={styles.viewCountTxt}>{viewNumber}</Text>
        </View>
      )}
    </>
  );
};

export default React.memo(LiveBadge);
