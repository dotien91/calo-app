import React from "react";
import { View, ScrollView, Dimensions, StyleSheet, FlatList } from "react-native";

import CS from "@theme/styles";
import { Device } from "@utils/device.ui.utils";
import ClassRoomRtcView from "./class.room.rtc.view";
import MicView from "./mic.view";
import { STUDENT_VIDEO_HEIGHT, TEACHER_VIDEO_HEIGHT } from "../call.class.constant";

const widthImg = Device.width / 2;

const CallVideoGroupView = React.memo(
  ({
    video,
    publishers,
    teacherStream,
    isTeacher,
  }: {
    video: any;
    publishers: any;
    myStream: any;
    teacherStream: any;
  }) => {
    // const data = React.useMemo(() => publishers?.[0], [publishers]);
    // if ((data?.length || 0) < 2 && !teacherStream?.stream) return null;
    const renderStudentVideo = ({ item }) => {
      return (
        <View
          style={{
            width: 74,
            height: 98,
            borderRadius: 8,
            overflow: "hidden",
            marginRight: 4,
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
              height: STUDENT_VIDEO_HEIGHT,
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
        <View style={styles.studentBox}>
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
          <View style={styles.container}>
            {/* <MicView showName={true} {...data} /> */}
            <ClassRoomRtcView
              key={teacherStream?.name}
              streamURL={teacherStream?.stream}
              objectFit="cover"
              name={teacherStream?.name}
              isTeacher={true}
              video={video}
              style={styles.teacherBox}
              {...teacherStream}
              isMe={isTeacher}
            />
            <View style={[CS.flex1, { margin: 4 }]}>
              <FlatList data={publishers} key={item => item?.stream?._id} renderItem={renderStudentVideo} horizontal={true} contentContainerStyle={styles.studentWrap} />
            </View>
          </View>
        </>
      );
    }
  },
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flex: 1,
    zIndex: 0,
  },
  studentWrap: {

  },
  teacherBox: {
    width: Device.width,
    height:
      TEACHER_VIDEO_HEIGHT,
    overflow: "hidden",
    // ...CS.borderStyle,
  },
  studentBox: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    flex: 1,
    zIndex: 0,
    height: Dimensions.get("screen").height,
  },
});

export default CallVideoGroupView;
