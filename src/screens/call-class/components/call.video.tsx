import { RTCView } from "react-native-webrtc";
import React from "react";
import { StyleSheet, Image } from "react-native";

import { Device } from "@utils/device.ui.utils";

import defaultAvatar from "@assets/images/default_avatar.jpg";
import useStore from "@services/zustand/store";
import { isAndroid } from "@helpers/device.info.helper";

const heightDevice = isAndroid() ? Device.height + 46 : Device.height

const CallVideo = ({ video, isMe, style, streamURL, name, resizeMode = "contain", ...res }) => {
  const hasVideo = React.useMemo(() => isMe ? video : !!streamURL?.getVideoTracks()?.length, [video, streamURL]);
  const currentMemberVideoRoom = useStore(state => state.currentMemberVideoRoom)
  const userData = useStore(state => state.userData)

  const avatarUrl = React.useMemo(() => {
    const findData = currentMemberVideoRoom.find(member => member?.display_name == name)
    if (isMe) return userData?.user_avatar || userData?.user_avatar_thumbnail
    return findData?.user_avatar || findData?.user_avatar_thumbnail
  }, [currentMemberVideoRoom])

  // if (isTeacher && !hasVideo)
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         backgroundColor: "rgba(28, 37, 48, 1)",
  //         ...CS.flexCenter,
  //       }}
  //     >
  //       <Image
  //         source={defaultAvatar}
  //         style={{
  //           width: 160,
  //           height: 160,
  //           left: "50%",
  //           top: "50%",
  //           marginLeft: -80,
  //           marginTop: -80,
  //           position: "absolute",
  //           zIndex: 1,
  //         }}
  //         resizeMode={"cover"}
  //       />
  //     </View>
  console.log("===hasVideohasVideo", isMe, name, avatarUrl, video, hasVideo)
  //   );
  if (!hasVideo && !style?.width) return (
    <Image
      source={avatarUrl ? { uri: avatarUrl } : defaultAvatar}
      style={{
        width: 163,
        height: 163,
        left: "50%",
        top: "50%",
        marginLeft: -81,
        marginTop: -81,
        position: "absolute",
        zIndex: 1,
      }}
      resizeMode={"cover"}
    />
  );
  if (!hasVideo)
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

  return (
    <RTCView
      style={[
        style || { ...StyleSheet.absoluteFillObject, height: heightDevice },
      ]}
      objectFit={resizeMode}
      streamURL={streamURL.toURL()}
      {...res}
    />
  );
};

export default React.memo(CallVideo);
