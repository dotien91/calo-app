import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
} from "react-native-webrtc";
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
} from "react-native";
// import { Janus, JanusVideoRoomPlugin } from "react-native-janus";
import { Janus, JanusVideoRoomPlugin } from "./react-native-janus";

import lodash from "lodash";
import { useRoute } from "@react-navigation/native";

import CS from "@theme/styles";
import { getStatusBarHeight } from "react-native-safearea-height";
import { isTeacher } from "./call.class.helper";
import { Device } from "@utils/device.ui.utils";
import { isIOS } from "@freakycoder/react-native-helpers";
import {
  closeSuperModal,
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import MicView from "./components/mic.view";
import CallVideo from "./components/call.video";
import useStore from "@services/zustand/store";
import { SERVER } from "constants/class.room.constant";
import { EnumRole } from "constants/system.constant";
import { ScrollView } from "react-native-gesture-handler";
// import Video from "./service/video";
import { useClassRoom } from "./useClassRoom";
import ClassRoomTopView from "./components/call.class.top.view";
import ClassRoomBottomView from "./components/call.class.bottom.view";
import { EnumClassType } from "models/course.model";

Janus.setDependencies({
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream,
});

const CallClassScreen = () => {
  const userData = useStore((state) => state.userData);
  const [publishers, setPulishers] = useState([]);
  const videoRoom = React.useRef(null);
  const janus = React.useRef(null);
  const stream = React.useRef(null);
  const route = useRoute();
  const roomId = route.params?.["courseRoom"]?.roomId;
  const chatRoomId = route.params?.["courseRoom"]?.chatRoomId;
  const courseData = route.params?.["courseData"];
  const isVideoOneOne = courseData.type == EnumClassType.Call11;

  const [config, setConfig] = useState({
    mute: false,
    video: true,
    front: true,
  });
  const isTeacherRole = userData?.user_role == EnumRole.Teacher;
  console.log("userData", roomId);

  //create room
  useClassRoom({ roomId });

  const hasTeacher = () => {
    return !!publishers.find((item) => !!item?.isTeacher);
  };

  const toggleMute = () => {
    stream.current.getAudioTracks().forEach((track: any) => {
      track.enabled = !config.mute;
      setConfig((old) => ({ ...old, mute: !old.mute }));
    });
  };

  const switchCamera = () => {
    setConfig((old) => ({ ...old, front: !old.front }));
    stream.current
      .getVideoTracks()
      .forEach((track: any) => track._switchCamera());
  };

  useEffect(() => {
    StatusBar.setBarStyle("dark-content");
    StatusBar.setBackgroundColor("rgba(0,0,0,0)");
    StatusBar.setTranslucent(true);
    getMediaStream();
    return () => {
      janus.current.destroy();
    };
  }, []);

  const receivePublisher = async (publisher, event) => {
    console.log("object===", {
      publisher,
      event,
    });
    const _videoRoom = videoRoom.current;
    try {
      const videoRoom = new JanusVideoRoomPlugin(janus.current);
      videoRoom.setRoomID(roomId);
      videoRoom.setOnStreamListener((stream) => {
        setPulishers((state) => {
          const newPublsher = [
            ...state,
            {
              publisher,
              stream: stream,
            },
          ].map((item) => ({
            ...item,
            isTeacher: item.publisher
              ? isTeacher(item.publisher?.displayName || "")
              : isTeacher(
                  userData?.display_name + (isTeacherRole ? "_teacher_ih" : ""),
                ),
          }));
          return lodash.uniqBy(newPublsher, "stream._reactTag");
        });
      });

      await videoRoom.createPeer();
      await videoRoom.connect();
      await videoRoom.receive(_videoRoom.getUserPrivateID(), publisher);
    } catch (e) {
      console.error("receivePublisher error", e);
    }
  };

  const removePublisher = async (publisherID) => {
    try {
      setPulishers((state) =>
        state.filter(
          (pub) => pub.publisher == null || pub.publisher.id !== publisherID,
        ),
      );
    } catch (e) {
      // console.error(e);
    }
  };

  const initJanus = async (stream) => {
    showSuperModal({
      styleModalType: EnumStyleModalType.Middle,
      contentModalType: EnumModalContentType.Loading,
    });
    try {
      setPulishers([
        {
          isMe: true,
          publisher: null,
          stream: stream,
        },
      ]);
      janus.current = new Janus(SERVER);
      await janus.current.init();
      videoRoom.current = new JanusVideoRoomPlugin(janus.current);
      videoRoom.current.setRoomID(roomId);
      videoRoom.current.setDisplayName(
        userData?.display_name + (isTeacherRole ? "_teacherih" : ""),
      );
      videoRoom.current.setOnPublishersListener((publishers) => {
        for (let i = 0; i < publishers.length; i++) {
          receivePublisher(publishers[i]);
        }
      });
      videoRoom.current.setOnPublisherJoinedListener((publisher) => {
        receivePublisher(publisher);
      });
      videoRoom.current.setOnPublisherLeftListener((publisherID) => {
        removePublisher(publisherID);
      });
      videoRoom.current.setOnWebRTCUpListener(async () => {
        console.log("setOnWebRTCUpListener");
      });
      await videoRoom.current.createPeer();
      await videoRoom.current.connect();
      await videoRoom.current.join();
      await videoRoom.current.publish(stream);
      closeSuperModal();
    } catch (e) {
      console.error("main init janus", e);
    }
  };

  const getMediaStream = async () => {
    const isFront = true;
    const sourceInfos = await mediaDevices.enumerateDevices();
    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      console.log(sourceInfo);
      if (
        sourceInfo.kind == "videoinput" &&
        sourceInfo.facing == (isFront ? "front" : "environment")
      ) {
        videoSourceId = sourceInfo.deviceId;
      }
    }

    stream.current = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        facingMode: isFront ? "user" : "environment",
      },
    });
    await initJanus(stream.current);
  };

  const toggleVideo = () => {
    stream.current.getVideoTracks().forEach((track) => {
      track.enabled = !config.video;
      setConfig((old) => ({ ...old, video: !old.video }));
    });
  };
  console.log("publisherspublishers", publishers);
  const renderStudentVideo = () => {
    if (isVideoOneOne || !(publishers.length > 1)) return null;
    const data = publishers.filter((item) => !item?.isTeacher);
    if (!data.length) return null;
    let width = (Device.width - 80) / 4;
    let style = {};
    if (!hasTeacher()) {
      width = Device.width / 2;
      style = {
        width: Device.width / 2,
        height: width / 0.8,
        ...CS.borderStyle,
      };
    }
    console.log("data student", data);
    if (!hasTeacher())
      return (
        <ScrollView>
          <View style={{ ...CS.flexStart, flexWrap: "wrap" }}>
            {data.map((item, index) => {
              return (
                <View
                  key={item?.stream?._id || index}
                  style={{
                    width: Device.width / 2,
                    height: width / 0.8,
                    // ...CS.borderStyle,
                  }}
                >
                  <CallVideo
                    style={{
                      flex: 1,
                      width,
                      height: width / 0.8,
                      // borderRadius: 8,
                      // marginHorizontal: 8,
                      overflow: "hidden",
                    }}
                    objectFit={"cover"}
                    streamURL={item.stream.toURL() || ""}
                    zOrder={3}
                    data={item}
                  />
                  <MicView showName={!hasTeacher()} {...item} />
                </View>
              );
            })}
          </View>
        </ScrollView>
      );
    return (
      <>
        {data.slice(0, 4).map((item, index) => {
          return (
            <View
              key={item?.stream?._id || index}
              style={[
                hasTeacher()
                  ? {
                      position: "absolute",
                      bottom: 80,
                      borderRadius: 8,
                      overflow: "hidden",
                      right: width * index + 16 * index + 16,
                    }
                  : {
                      // backgroundColor: 'red',
                      ...style,
                      marginTop: index < 2 ? getStatusBarHeight() - 16 : 0,
                    },
              ]}
            >
              <CallVideo
                style={{
                  flex: 1,
                  width,
                  height: width / 0.8,
                  // borderRadius: 8,
                  // marginHorizontal: 8,
                  overflow: "hidden",
                }}
                objectFit={"cover"}
                streamURL={item.stream.toURL() || ""}
                zOrder={3}
                data={item}
              />
              <MicView showName={!hasTeacher()} {...item} />
            </View>
          );
        })}
      </>
    );
  };

  console.log("publisherspublishers", publishers);

  const getDataTeacher = () => {
    return publishers.find((item) => item?.isTeacher);
  };

  const renderTeacherVideo = () => {
    const data = getDataTeacher();
    console.log("data teacher1", data);
    if (!data) return null;
    return (
      <>
        <CallVideo
          style={{ ...StyleSheet.absoluteFillObject, height: Device.height }}
          objectFit={"contain"}
          streamURL={data.stream.toURL() || ""}
          data={data}
          isTeacher
        />
      </>
    );
  };

  const renderMyVideo = () => {
    const data = publishers.find((item) => item?.isMe);
    const dataTeacher = getDataTeacher();
    if (!isVideoOneOne && publishers.length > 1) return null;
    let style = {
      height: Device.height + (isIOS ? 0 : 30),
      ...StyleSheet.absoluteFillObject,
    };

    console.log("stylestyle", style);
    if (isVideoOneOne && dataTeacher) {
      style = {
        height: Dimensions.get("window").height,
        position: "absolute",
        right: 12,
        top: (isIOS ? getStatusBarHeight() : 0) + 44 + 12,
        width: Device.width / 3,
        height: Device.width / 3 / 0.8,
        borderRadius: 8,
        zIndex: 33,
      };
    }

    if (!data) return null;
    return (
      <RTCView
        streamURL={data.stream.toURL()}
        style={style}
        objectFit="cover"
        mirror={true}
        zOrder={4}
      />
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "rgba(28, 37, 48, 1)",
        justifyContent: "flex-end",
        ...CS.flexStart,
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}
    >
      {/* <Video /> */}
      <ClassRoomTopView switchCamera={switchCamera} />
      <ClassRoomBottomView
        config={config}
        publishers={publishers}
        toggleMute={toggleMute}
        toggleVideo={toggleVideo}
        switchCamera={switchCamera}
        courseData={courseData}
        chatRoomId={chatRoomId}
      />
      {renderMyVideo()}

      <View style={{ flex: 1 }}>{renderTeacherVideo()}</View>
      {renderStudentVideo()}
    </SafeAreaView>
  );
};

export default CallClassScreen;
