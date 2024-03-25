import { RTCView } from "react-native-webrtc";
import React from "react";
import { StyleSheet, Image, View } from "react-native";

import { Device } from "@utils/device.ui.utils";

import defaultAvatar from "@assets/images/default_avatar.jpg";
import { isAndroid } from "@helpers/device.info.helper";
import CS from "@theme/styles";
import { TypedUser } from "shared/models";

const heightDevice = isAndroid() ? Device.height + 44 : Device.height;

interface IClassRoomRtcView extends TypedUser {
  streamURL: string;
  isMe: boolean;
  video: boolean;
  name?: string;
  style?: any;
  resizeMode?: string;
  zOrder?: number;
  objectFit?: string;
  isTeacher?: boolean;
  isVideoOneOne?: boolean;
}

const ClassRoomRtcView = ({
  isTeacher,
  isVideoOneOne,
  video,
  isMe,
  style,
  streamURL,
  name,
  objectFit = "contain",
  user_avatar,
  user_avatar_thumbnail,
  ...res
}: IClassRoomRtcView) => {
  const hasVideo = () => (isMe ? video : !!streamURL?.getVideoTracks()?.length);
  const avatarUrl = React.useMemo(
    () => user_avatar || user_avatar_thumbnail,
    [user_avatar, user_avatar_thumbnail],
  );

  console.log("avatarUrlavatarUrl", hasVideo(), streamURL, name);

  if (!hasVideo()) {
    if (isTeacher || isVideoOneOne || !style?.width) {
      return (
        <View style={CS.flex1}>
          <Image
            source={avatarUrl ? { uri: avatarUrl } : defaultAvatar}
            style={{
              width: 160,
              height: 160,
              left: "50%",
              top: "50%",
              marginLeft: -(160 / 2),
              marginTop: -(160 / 2),
              position: "absolute",
              zIndex: 1,
            }}
            resizeMode={"cover"}
          />
        </View>
      );
    }
    return (
      <Image
        source={avatarUrl ? { uri: avatarUrl } : defaultAvatar}
        style={{
          width: style.width,
          height: style.height,
          left: "50%",
          top: "50%",
          marginLeft: -(style.width / 2),
          marginTop: -(style.height / 2),
          position: "absolute",
          zIndex: 1,
        }}
        resizeMode={"cover"}
      />
    );
  }

  return (
    <RTCView
      style={[
        style || { ...StyleSheet.absoluteFillObject, height: heightDevice },
      ]}
      objectFit={objectFit}
      streamURL={streamURL.toURL()}
      {...res}
    />
  );
};

export default React.memo(ClassRoomRtcView);
