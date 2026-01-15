import { palette } from "@theme/themes";
import { VS } from "@utils/size.utils";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
// import { RTCView } from "react-native-webrtc"; // Removed RTC
import { useLiveStreamUser } from "./utils";
import { View } from "react-native"; // Fallback
import TextBase from "@shared-components/TextBase";

const DetailWebrtcLivestream = ({
  livestream,
  isSpeaker,
  isMuted,
}: {
  livestream: any;
  isSpeaker: boolean;
  isMuted: boolean;
}) => {
  const { startWatch, remoteStream, connectionState, disconnect, toggleMic } =
    useLiveStreamUser();
  const isConnected = connectionState === "connected";
  const alreadyStartWatch = useRef(false);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    if (livestream && !alreadyStartWatch.current) {
      alreadyStartWatch.current = true;
      startWatch({ urlLiveStream: livestream });
    }
  }, [livestream]);

  useEffect(() => {
    toggleMic(isSpeaker);
  }, [isSpeaker]);

  useEffect(() => {
    toggleMic(!isMuted);
  }, [isMuted]);

  const _isConnected = isConnected && remoteStream?._id;

  if (!_isConnected) {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={"large"} color={palette.textLight} />
        <TextBase
          title={"connecting"}
          color={palette.textLight}
          fontSize={16}
          style={{ marginTop: VS._20 }}
          fontWeight="600"
        />
      </View>
    );
  }
  // RTC functionality removed - return placeholder
  return (
    <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" }}>
      <TextBase
        title={"RTC functionality removed"}
        color={palette.textLight}
        fontSize={16}
        fontWeight="600"
      />
    </View>
  );
  // if (hasCamera) {
  // return (
  //   <RTCView
  //     streamURL={remoteStream?.toURL()}
  //     style={{ ...StyleSheet.absoluteFillObject }}
  //     objectFit="contain"
  //     mirror={false}
  //   />
  // );
  // }
  // return (
  //   <ImageLoad
  //     source={{ uri: livestream?.avatar?.media_url }}
  //     style={{ ...StyleSheet.absoluteFillObject }}
  //     resizeMode="contain"
  //   />
  // );
};

// const createStyles = () => {
//   return StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: palette.background,
//     },
//     viewAction: {
//       flexDirection: "row",
//       alignItems: "center",
//       gap: HS._10,
//       position: "absolute",
//       right: HS._40,
//       bottom: VS._10,
//     },
//   });
// };

export default DetailWebrtcLivestream;
