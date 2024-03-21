import { RTCView } from "react-native-webrtc";
import React from "react";
import { StyleSheet, Image } from "react-native";

import { Device } from "@utils/device.ui.utils";

import defaultAvatar from "@assets/images/default_avatar.jpg";
import useStore from "@services/zustand/store";
import { isAndroid } from "@helpers/device.info.helper";

const heightDevice = isAndroid() ? Device.height + 44 : Device.height;

interface IClassRoomRtcView {
  streamURL: string;
  isMe: boolean;
  video: boolean;
  name?: string;
  style?: any;
  resizeMode?: string;
  zOrder?: number;
  objectFit?: string;
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
  ...res
}: IClassRoomRtcView) => {
  const hasVideo = () => (isMe ? video : !!streamURL?.getVideoTracks()?.length);
  const currentMemberVideoRoom = useStore(
    (state) => state.currentMemberVideoRoom,
  );
  const userData = useStore((state) => state.userData);
  const avatarUrl = React.useMemo(() => {
    const findData = currentMemberVideoRoom.find(
      (member) =>
        member?.display_name == name || member?.display_name + "tutor" == name,
    );
    if (isMe) return userData?.user_avatar || userData?.user_avatar_thumbnail;
    return findData?.user_avatar || findData?.user_avatar_thumbnail;
  }, [currentMemberVideoRoom]);
  console.log("avatarUrlavatarUrl", hasVideo(), streamURL, name);

  if (!hasVideo()) {
    if (isTeacher)
      return (
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
      );
    if (isVideoOneOne)
      return (
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
      );
    return (
      <Image
        source={avatarUrl ? { uri: avatarUrl } : defaultAvatar}
        style={{
          width: style?.width,
          height: style?.height,
          left: 0,
          top: 0,
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
