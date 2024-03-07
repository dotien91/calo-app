import PressableBtn from "@shared-components/button/PressableBtn";
import * as React from "react";
import { Image } from "react-native";

import { TypedPost } from "shared/models";

interface AvatarPostProps {
  data: TypedPost;
  pressAvatar: () => void;
  sizeAvatar: number;
}

const AvatarPost = ({ data, pressAvatar, sizeAvatar }: AvatarPostProps) => {
  const BORDER_AVATAR = (sizeAvatar * 4) / 10;
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
    </PressableBtn>
  );
};

export default React.memo(AvatarPost);
