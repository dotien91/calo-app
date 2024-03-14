import * as React from "react";
import { StyleSheet, View, Image, Text } from "react-native";

import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { palette } from "@theme/themes";

import { TypedPost } from "shared/models";

interface AvatarPostProps {
  data: TypedPost;
  pressAvatar: () => void;
  sizeAvatar: number;
  showLevel?: boolean;
}

const AvatarPost = ({
  data,
  pressAvatar,
  sizeAvatar,
  showLevel,
}: AvatarPostProps) => {
  const BORDER_AVATAR = sizeAvatar / 2;
  return (
    <PressableBtn
      onPress={pressAvatar}
      style={{
        width: sizeAvatar,
        height: sizeAvatar,
        borderRadius: BORDER_AVATAR,
      }}
    >
      <Image
        source={{ uri: data?.user_id?.user_avatar_thumbnail }}
        style={{
          width: sizeAvatar,
          height: sizeAvatar,
          borderRadius: BORDER_AVATAR,
        }}
      />
      {showLevel && (
        <View style={styles.viewLevelAbsolute}>
          <View style={styles.viewLevel}>
            <Text style={styles.txtLevel}>{2}</Text>
          </View>
        </View>
      )}
    </PressableBtn>
  );
};

export default React.memo(AvatarPost);

const styles = StyleSheet.create({
  viewLevelAbsolute: {
    position: "absolute",
    bottom: -5,
    left: 0,
    right: 0,
    height: 10,
    zIndex: 1,
    ...CS.center,
  },
  viewLevel: {
    borderRadius: 5,
    backgroundColor: palette.red,
    paddingHorizontal: 8,
    ...CS.center,
  },
  txtLevel: {
    fontSize: 8,
    color: palette.white,
  },
});
