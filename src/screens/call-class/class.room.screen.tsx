import React, { useState } from "react";
import { SafeAreaView } from "react-native";

import Janus from "./service/janus.mobile";
// import InCallManager from 'react-native-incall-manager';

// import Spinner from "react-native-loading-spinner-overlay";
import { SERVER } from "constants/class.room.constant";
import useStore from "@services/zustand/store";
import { useRoute } from "@react-navigation/native";
import { _isTeacher } from "./call.class.helper";
import ClassRoomBottomView from "./components/call.class.bottom.view";
import ClassRoomTopView from "./components/call.class.top.view";
import { EnumClassType } from "models/course.model";
import { useClassRoom } from "./useClassRoom";
import CallVideoOneOneView from "./components/class.video.oneone.view";
import CallVideoGroupView from "./components/call.video.group.view";
import ClassRoomRtcView from "./components/class.room.rtc.view";

const opaqueId = "videoroomtest-" + Janus.randomString(12);

const server = SERVER;

let janus;
let sfutest = null;
let started = false;

// let roomId = "65c0ab03d7d7ab3a76de4b5b";
const bitrateTimer = [];

Janus.init({
  debug: "all",
  callback: function () {
    if (started) return;
    started = true;
  },
});

const ClassRoomScreen = () => {
  const route = useRoute();
  const [selfViewSrc, setSelfViewSrc] = useState(null);
  const [publish, setPusblish] = useState(false);
  const [remoteList, setRemoteList] = useState({});
  // const [remoteListPluginHandle, setRemoteListPluginHandle] = useState({});
  const remoteListPluginHandleCurrent = React.useRef({});
  const userData = useStore((state) => state.userData);
  // const stream = React.useRef(null);

  const [config, setConfig] = useState({
    mute: false,
    video: true,
    front: true,
  });

  const courseRoom = route.params?.["courseRoom"];
  const { roomId, chatRoomId } = courseRoom;
  const courseData = route.params?.["courseData"];
  console.log("roomId", roomId);

  const isVideoOneOne = courseData?.type == EnumClassType.Call11;
  const { isTeacher } = useClassRoom();

  React.useEffect(() => {
    janusStart();
    return () => {
      endCall();
    };
  }, []);

  const updateListParticipants = useStore(
    (state) => state.updateListParticipants,
  );

  const toggleMute = () => {
    selfViewSrc.getAudioTracks().forEach((track: any) => {
      track.enabled = !config.mute;
      setConfig((old) => ({ ...old, mute: !old.mute }));
    });
  };

  const switchCamera = () => {
    setConfig((old) => ({ ...old, front: !old.front }));
    selfViewSrc.getVideoTracks().forEach((track: any) => track._switchCamera());
  };

  const toggleVideo = () => {
    selfViewSrc.getVideoTracks().forEach((track) => {
      track.enabled = !config.video;
      setConfig((old) => ({ ...old, video: !old.video }));
    });
  };

  const janusStart = () => {
    janus = new Janus({
      server: server,
      success: () => {
        janus.attach({
          plugin: "janus.plugin.videoroom",
          success: (pluginHandle) => {
            sfutest = pluginHandle;
            const create = {
              request: "create",
              room: roomId,
              admin_key: "supersecret",
              publishers: 20,
              audiolevel_ext: true,
              audiolevel_event: true,
              audio_active_packets: 50,
              audio_level_average: 40,
            };
            sfutest.send({
              message: create,
              success: function () {
                const register = {
                  request: "join",
                  room: roomId,
                  ptype: "publisher",
                  display: userData?.display_name + (isTeacher ? "tutor" : ""),
                };
                sfutest.send({ message: register });
              },
            });
          },
          error: (error) => {
            console.log("  -- Error attaching plugin...", error);
          },
          onmessage: (msg, jsep) => {
            const event = msg["videoroom"];
            // console.log("onmessage", event);

            if (event != undefined && event != null) {
              if (event === "joined") {
                myid = msg["id"];
                publishOwnFeed(true);
                // this.setState({ visible: false });
                if (
                  msg["publishers"] !== undefined &&
                  msg["publishers"] !== null
                ) {
                  const list = msg["publishers"];
                  for (const f in list) {
                    const id = list[f]["id"];
                    const display = list[f]["display"];

                    const audio = list[f]["audio_codec"];
                    const video = list[f]["video_codec"];
                    newRemoteFeed(id, display, audio, video);
                  }
                }
              } else if (event === "destroyed") {
                console.log("destroy");
              } else if (event === "event") {
                if (
                  msg["publishers"] !== undefined &&
                  msg["publishers"] !== null
                ) {
                  const list = msg["publishers"];
                  for (const f in list) {
                    const id = list[f]["id"];
                    const display = list[f]["display"];
                    const audio = list[f]["audio_codec"];
                    const video = list[f]["video_codec"];
                    newRemoteFeed(id, display, audio, video);
                  }
                } else if (
                  msg["leaving"] !== undefined &&
                  msg["leaving"] !== null
                ) {
                  // const leaving = msg["leaving"];
                  // const remoteFeed = null;
                  // const numLeaving = parseInt(msg["leaving"]);
                  // let numLeaving = leaving
                  // console.log("leaeving======", leaving, numLeaving, this.state.remoteList.hasOwnProperty(numLeaving))
                  // if (this.state.remoteList.hasOwnProperty(leaving)) {
                  // delete this.state.remoteList.leaving;
                  // this.setState({ remoteList: [] });
                  // this.state.remoteListPluginHandle[leaving].detach();
                  // delete this.state.remoteListPluginHandle.leaving;
                  // }
                } else if (
                  msg["unpublished"] !== undefined &&
                  msg["unpublished"] !== null
                ) {
                  const unpublished = msg["unpublished"];
                  if (unpublished === "ok") {
                    sfutest.hangup();
                    return;
                  }
                  // let numLeaving = parseInt(msg["unpublished"]);
                  const numLeaving = msg["unpublished"];
                  // _onLeaving(numLeaving)
                  setRemoteList((old) => {
                    const newData = { ...old };
                    if (Object.hasOwn(old, numLeaving)) {
                      delete newData[numLeaving];
                      return newData;
                    }
                    return old;
                  });
                  console.log(
                    "remoteListPluginHandle",
                    remoteListPluginHandleCurrent.current,
                  );
                  setTimeout(() => {
                    remoteListPluginHandleCurrent.current[numLeaving]?.detach();
                  }, 500);
                }
              } else if (event == "talking") {
                updateListParticipants(msg.id, "add");
              } else if (event == "stopped-talking") {
                updateListParticipants(msg.id, "delete");
              }
            }
            if (jsep !== undefined && jsep !== null) {
              sfutest.handleRemoteJsep({ jsep: jsep });
            }
          },
          onlocalstream: (stream) => {
            // stream.current = stream;
            setSelfViewSrc(stream);
          },
          // onremotestream: (stream) => {
          //   console.log("streamstream", stream);
          // },
          oncleanup: () => {
            mystream = null;
          },
        });
      },
      error: (error) => {
        console.log("  Janus Error", error);
      },
      destroyed: () => {
        setPusblish(false);
      },
    });
  };

  const endCall = () => {
    janus.destroy();
  };

  const publishOwnFeed = (useAudio) => {
    if (!publish) {
      setPusblish(true);
      // this.setState({ publish: true });
      sfutest.createOffer({
        media: {
          audioRecv: false,
          videoRecv: false,
          audioSend: useAudio,
          videoSend: true,
        },
        success: (jsep) => {
          const publish = {
            request: "configure",
            audio: useAudio,
            video: true,
          };
          sfutest.send({ message: publish, jsep: jsep });
        },
        error: (error) => {
          console.log("WebRTC error:", error);
          // if (useAudio) {
          //   publishOwnFeed(false);
          // } else {
          // }
        },
      });
    } else {
      // this.setState({ publish: false });
      // let unpublish = { "request": "unpublish" };
      // sfutest.send({"message": unpublish});
    }
  };

  const newRemoteFeed = (id, display, audio, video) => {
    console.log("displaydisplay", display);
    let remoteFeed = null;
    const myroom = roomId;

    janus.attach({
      plugin: "janus.plugin.videoroom",
      opaqueId: opaqueId,
      success: function (pluginHandle) {
        remoteFeed = pluginHandle;
        remoteFeed.simulcastStarted = false;
        Janus.log(
          "Plugin attached! (" +
            remoteFeed.getPlugin() +
            ", id=" +
            remoteFeed.getId() +
            ")",
        );
        Janus.log("  -- This is a subscriber", pluginHandle);
        // We wait for the plugin to send us an offer
        const subscribe = {
          request: "join",
          room: myroom.toString(),
          ptype: "subscriber",
          feed: id,
          // private_id: mypvtid
        };
        // In case you don't want to receive audio, video or data, even if the
        // publisher is sending them, set the 'offer_audio', 'offer_video' or
        // 'offer_data' properties to false (they're true by default), e.g.:
        // 		subscribe["offer_video"] = false;
        // For example, if the publisher is VP8 and this is Safari, let's avoid video
        // if(Janus.webRTCAdapter.browserDetails.browser === "safari" &&
        //     ((video === "vp9" && !Janus.safariVp9) || (video === "vp8" && !Janus.safariVp8))) {
        //   if(video)
        //     video = video.toUpperCase()
        //   toastr.warning("Publisher is using " + video + ", but Safari doesn't support it: disabling video");
        //   subscribe["offer_video"] = false;
        // }
        remoteFeed.videoCodec = video;
        remoteFeed.send({ message: subscribe });
      },
      error: (error) => {
        console.log("  -- Error attaching plugin...", error);
      },
      onmessage: (msg, jsep) => {
        const event = msg["videoroom"];
        if (event != undefined && event != null) {
          if (event === "attached") {
            // Subscriber created and attached
          }
        }
        if (jsep !== undefined && jsep !== null) {
          remoteFeed.createAnswer({
            jsep: jsep,
            media: { audioSend: false, videoSend: false },
            success: (jsep) => {
              const body = { request: "start", room: roomId };
              remoteFeed.send({ message: body, jsep: jsep });
            },
            error: (error) => {
              console.log("WebRTC error:", error);
            },
          });
        }
      },
      onremotestream: (stream) => {
        setRemoteList((old) => {
          const newData = { ...old };
          newData[id] = {
            stream: stream,
            name: display,
            id,
            isTeacher: _isTeacher(display),
          };
          return newData;
        });
        // setRemoteListPluginHandle((old) => {
        //   const _newData = { ...old };
        //   _newData[id] = remoteFeed;
        remoteListPluginHandleCurrent.current[id] = remoteFeed;
        // return _newData;
        // });
        //  _onremotestream({stream, id, display, audio, video, remoteFeed})
      },
      oncleanup: () => {
        if (remoteFeed.spinner !== undefined && remoteFeed.spinner !== null)
          remoteFeed.spinner.stop();
        remoteFeed.spinner = null;
        if (
          bitrateTimer[remoteFeed.rfindex] !== null &&
          bitrateTimer[remoteFeed.rfindex] !== null
        )
          clearInterval(bitrateTimer[remoteFeed.rfindex]);
        bitrateTimer[remoteFeed.rfindex] = null;
      },
    });
  };

  const getRemoteListValue = React.useMemo(() => {
    return Object.keys(remoteList).map((key) => remoteList[key]);
  }, [remoteList]);

  const myStream = React.useMemo(() => {
    return {
      stream: selfViewSrc,
      isMe: true,
      name: userData?.display_name,
    };
  }, [selfViewSrc]);

  const getStudentStream = React.useMemo(() => {
    let studentRemoteStream = Object.keys(remoteList)
      .map((key) => remoteList[key])
      .filter((item) => !item?.isTeacher);
    if (!isTeacher)
      studentRemoteStream = [myStream].concat(studentRemoteStream);
    return studentRemoteStream;
  }, [remoteList, selfViewSrc]);

  const _renderMyVideo = () => {
    const publishers = getRemoteListValue;
    if (!selfViewSrc || publishers.length) return null;
    console.log(333333333);

    return (
      <ClassRoomRtcView
        isMe
        key={"selfViewSrcKey"}
        streamURL={selfViewSrc}
        objectFit="cover"
        video={config.video}
      />
    );
  };

  const teacherStream = React.useMemo(() => {
    if (isTeacher) {
      return {
        stream: selfViewSrc,
        name: userData?.display_name,
      };
    } else {
      return getRemoteListValue.find((item) => item?.isTeacher);
    }
  }, [isTeacher, selfViewSrc, getRemoteListValue]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "rgba(28, 37, 48, 1)",
        justifyContent: "flex-end",
      }}
    >
      <ClassRoomTopView switchCamera={switchCamera} />
      {/* {renderTeacher()} */}
      {!!selfViewSrc && !!getRemoteListValue.length && (
        <CallVideoOneOneView
          publishers={getRemoteListValue}
          video={config.video}
          isVideoOneOne={isVideoOneOne}
          myStream={myStream}
        />
      )}
      {!isVideoOneOne && !!selfViewSrc && !!getStudentStream.length && (
        <CallVideoGroupView
          publishers={getStudentStream}
          video={config.video}
          myStream={myStream}
          isTeacher={isTeacher}
          teacherStream={teacherStream}
        />
      )}
      {_renderMyVideo()}
      <ClassRoomBottomView
        config={config}
        publishers={getRemoteListValue}
        toggleMute={toggleMute}
        toggleVideo={toggleVideo}
        switchCamera={switchCamera}
        courseData={courseData}
        chatRoomId={chatRoomId}
      />
    </SafeAreaView>
  );
};

export default ClassRoomScreen;
