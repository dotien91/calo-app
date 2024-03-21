import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";

// import InCallManager from 'react-native-incall-manager';

// import Spinner from "react-native-loading-spinner-overlay";
import CS from "@theme/styles";
import { Device } from "@utils/device.ui.utils";
import ClassRoomRtcView from "./class.room.rtc.view";

const CallVideoOneOneView = React.memo(
  ({
    isVideoOneOne,
    video,
    publishers,
    myStream,
  }: {
    isVideoOneOne: boolean;
    video: any;
    publishers: any;
    myStream: any;
  }) => {
    const data = React.useMemo(() => publishers?.[0], [publishers]);
    if (!isVideoOneOne || !data?.stream) return null;
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <View style={CS.flex1}>
          {/* <MicView showName={true} {...data} /> */}
          <ClassRoomRtcView
            isVideoOneOne={true}
            isMe={true}
            key={myStream?.name}
            streamURL={myStream?.stream}
            objectFit="cover"
            name={data?.name}
            video={video}
            style={{
              width: Device.width,
              height: Dimensions.get("screen").height / 2,
              overflow: "hidden",
              // ...CS.borderStyle,
            }}
          />
        </View>
        <View style={CS.flex1}>
          {/* <MicView showName={true} {...data} /> */}
          <ClassRoomRtcView
            isVideoOneOne={true}
            isMe={false}
            key={data?.name}
            streamURL={data?.stream}
            objectFit="cover"
            name={data?.name}
            style={{
              width: Device.width,
              height: Dimensions.get("screen").height / 2,
              flex: 1,
              overflow: "hidden",
              height: Dimensions.get("screen").height / 2,

              // ...CS.borderStyle,
            }}
          />
        </View>
      </View>
    );
  },
);

export default CallVideoOneOneView;
