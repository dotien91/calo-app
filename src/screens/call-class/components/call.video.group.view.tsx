import React from "react";
import { View, ScrollView, Dimensions } from "react-native";

import CS from "@theme/styles";
import { Device } from "@utils/device.ui.utils";
import { getStatusBarHeight } from "react-native-safearea-height";
import { isIOS } from "@freakycoder/react-native-helpers";
import ClassRoomRtcView from "./class.room.rtc.view";
import MicView from "./mic.view";

const widthImg = Device.width / 2;

const CallVideoGroupView = React.memo(
  ({
    video,
    publishers,
    teacherStream,
    isTeacher,
  }: {
    isVideoOneOne: boolean;
    video: any;
    publishers: any;
    myStream: any;
  }) => {
    // const data = React.useMemo(() => publishers?.[0], [publishers]);

    // if ((data?.length || 0) < 2 && !teacherStream?.stream) return null;
    const renderStudentVideo = (item) => {
      return (
        <View
          style={{
            width: 74,
            height: 98,
            borderRadius: 8,
            overflow: "hidden",
            marginRight: 4,
            backgroundColor: "red",
          }}
        >
          <ClassRoomRtcView
            key={item?.name}
            streamURL={item?.stream}
            objectFit="cover"
            name={item?.name}
            video={video}
            style={{
              width: 74,
              height: 98,
              backgroundColor: "red",
              // ...CS.borderStyle,
            }}
            {...item}
          />
          <MicView showName={false} {...item} />
        </View>
      );
    };

    const renderStudentVideoWithoutTeacher = (item) => {
      return (
        <View
          key={item.name}
          style={{
            width: widthImg,
            height: widthImg * 1.5,
            overflow: "hidden",
            backgroundColor: "red",
          }}
        >
          <ClassRoomRtcView
            key={item?.name}
            streamURL={item?.stream}
            objectFit="cover"
            name={item?.name}
            video={video}
            style={{
              width: widthImg,
              height: widthImg * 1.5,
              // ...CS.borderStyle,
            }}
            {...item}
          />
          <MicView showName={true} {...item} />
        </View>
      );
    };

    if (!teacherStream?.stream && publishers.length > 1) {
      return (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            flex: 1,
            zIndex: 0,
            height: Dimensions.get("screen").height,
          }}
        >
          <ScrollView>
            <View style={{ ...CS.flexStart, flexWrap: "wrap" }}>
              {publishers.map((publisher) =>
                renderStudentVideoWithoutTeacher(publisher),
              )}
            </View>
          </ScrollView>
        </View>
      );
    }
    if (!!teacherStream?.stream && !!publishers.length) {
      return (
        <>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              flex: 1,
              zIndex: 0,
              height:
                Dimensions.get("screen").height -
                44 -
                getStatusBarHeight() -
                36 -
                64 +
                (isIOS ? 22 : 0),
            }}
          >
            {/* <MicView showName={true} {...data} /> */}
            <ClassRoomRtcView
              key={teacherStream?.name}
              streamURL={teacherStream?.stream}
              objectFit="cover"
              name={teacherStream?.name}
              isTeacher={true}
              video={video}
              style={{
                width: Device.width,
                height:
                  Dimensions.get("screen").height -
                  44 -
                  getStatusBarHeight() -
                  36 -
                  64 +
                  (isIOS ? 22 : 0),
                overflow: "hidden",
                // ...CS.borderStyle,
              }}
              {...teacherStream}
              isMe={isTeacher}
            />
            <ScrollView
              horizontal={true}
              style={{
                position: "absolute",
                left: 4,
                top:
                  Dimensions.get("screen").height -
                  44 -
                  getStatusBarHeight() -
                  36 -
                  64 +
                  4 +
                  (isIOS ? 22 : 0),
              }}
            >
              {publishers.map((publisher) => renderStudentVideo(publisher))}
            </ScrollView>
          </View>
        </>
      );
    }
  },
);

export default CallVideoGroupView;
