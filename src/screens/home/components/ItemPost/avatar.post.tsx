import * as React from "react";
import { Image, Pressable } from "react-native";

import { TypedRequest } from "shared/models";

interface AvatarPostProps {
  data: TypedRequest;
  pressAvatar: () => void;
  sizeAvatar: number;
}

const AvatarPost = ({ data, pressAvatar, sizeAvatar }: AvatarPostProps) => {
  const BORDER_AVATAR = (sizeAvatar * 4) / 10;
  return (
    <Pressable
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
    </Pressable>
  );
};

export default React.memo(AvatarPost);
