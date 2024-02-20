import { RTCView } from "react-native-webrtc";
import React from "react";
import { StyleSheet, View, Image } from "react-native";

import CS from "@theme/styles";
import { Device } from "@utils/device.ui.utils";

import defaultAvatar from "@assets/images/default_avatar.jpg";

const CallVideo = ({ data, style, isTeacher, ...res }) => {
  const hasVideo = !!data.stream._tracks.find((_item) => _item?.kind == "video")
    ?._enabled;
  console.log("datadatadata", data);

  if (isTeacher && !hasVideo)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(28, 37, 48, 1)",
          ...CS.flexCenter,
        }}
      >
        <Image
          source={defaultAvatar}
          style={{
            width: 160,
            height: 160,
            left: "50%",
            top: "50%",
            marginLeft: -80,
            marginTop: -80,
            position: "absolute",
            zIndex: 1,
          }}
          resizeMode={"cover"}
        />
      </View>
    );
  console.log("data.stream.getVideoTracks()", data.stream.getVideoTracks());
  if (!hasVideo)
    return (
      <Image
        source={defaultAvatar}
        style={{
          width: style.width,
          height: style.height,
          left: 0,
          top: 0,
          position: "absolute",
        }}
        resizeMode={"cover"}
      />
    );

  return (
    <RTCView
      style={[
        style || { ...StyleSheet.absoluteFillObject, height: Device.height },
      ]}
      objectFit={"cover"}
      streamURL={data.stream.toURL() || ""}
      {...res}
    />
  );
};

export default React.memo(CallVideo);
