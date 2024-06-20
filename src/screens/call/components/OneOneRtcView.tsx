import React, { useMemo, useRef, useState, useEffect } from "react";
import { useTheme, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationService from "react-navigation-helpers";
import {
  AcceptCall,
  BackIcon,
  IconCameraCall,
  IconSpeakerCall,
  RotateIcon,
  SplitView,
} from "../assets/svgIcons";

import useStore from "@services/zustand/store";
import LinearGradient from "react-native-linear-gradient";
import ImageLoad from "@shared-components/image-load/ImageLoad";
import { emitSocket, offSocket, onSocket } from "@helpers/socket.helper";

import { SCREENS } from "constants";
import { Device } from "../ui/device.ui";
// import { useCall, useLocalStream, _requestAudioPermission, _requestCameraPermission } from "./utils";

import { endCall, makeCall } from "@services/api/call.api";

import RNCallKeep from "react-native-callkeep";
import KeepAwake from "react-native-keep-awake";
interface OneOneRtcViewProps {}
import createStyles from "../call.page.screen.style";
import {
  Pressable,
  View,
  BackHandler,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  PermissionsAndroid,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { MHS } from "../ui/sizes.ui";

const HEIGHT_BOTTOM = Device.isX ? Device.safeAreaInsetX.bottom + 90 : 110;

import InCallManager from "react-native-incall-manager";
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
} from "react-native-webrtc";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { HIT_SLOP_EXPAND_20 } from "../constants/system.constant";
import SoundComponent from "../components/sound.component";
import TextBase from "../components/TextBase";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import { goBack, replace } from "@helpers/navigation.helper";

const OneOneRtcView: React.FC<OneOneRtcViewProps> = () => {
  const route = useRoute<any>();
  const intervalTimer = useRef<ReturnType<typeof setInterval> | null>();
  const ringingRef = useRef<any>();
  const a = useRef<any>();

  const callTime = useRef<any>();
  const timeoutEndCall = useRef<ReturnType<typeof setInterval> | null>();
  const [timer, setTimer] = useState(0);
  const startTimer = useRef(false);

  const item = route.params?.item || {};
  const optionFilter = useSharedValue(0);

  const [data, setDataCall] = useState<any>({
    room_id: "667002fd570c57a537c7ad2e"
  });
  const [callType] = useState(route.params?.type || "video_call");
  const userData = useStore((state) => state.userData);

  const peerConnection = useRef<RTCPeerConnection>();
  const [remoteStreams, setRemoteStreams] = useState<any>({});
  const [showRemoteStream, setShowRemoteStream] = useState<any>(true);


  const leaveOneoneClient = () => {
    setRemoteStreams({})
  }
  useEffect(() => {
    if (!userData) return
    const id = userData?.user_role == "teacher" ? "666ffe3f715cee894e6f0a71" : "666c162294f133507f9c87da" 
    onSocket("leaveOneoneClient", leaveOneoneClient);

    return () => {
      offSocket("leaveOneoneClient", leaveOneoneClient);
      onPressEndCall()
    }
  }, [userData])
  

  const [configActions, setConfigActions] = useState({
    localMic: true,
    localCamera: callType === "video_call",
    remoteCamera: callType === "video_call",
    remoteMic: true,
  });
  const answerCandidates = useRef<any[]>([]);
  const offerCandidates = useRef<any[]>([]);

  const [streams, setVideoStream] = useState<any>({
    streams: {},
    remoteStreams: {},
  });

  const [account] = useState<any>(userData);
  const servers = {
    iceServers: [
      {
        urls: ["stun:stun.oncenter.vn:3478", "turn:stun.oncenter.vn:3478"],
        username: "ikigroup",
        credential: "ikigroup",
      },
    ],
  };

  const isMakeCall = useMemo(() => {
    //Chat room ID
    alert(userData?.user_role)
    return userData?.user_role !== "teacher"
  }, [userData]);

  useEffect(() => {
    if (streams?.id) {
      createRoom();
    }
    return () => {
      if (streams?.id) {
        releaseCamera();
        closePeer();
      }
    };
  }, [streams?.id]);

  //Listen Incall
  useEffect(() => {
    InCallManager.start({ media: "video" });
    return () => {
      InCallManager.stop();
    };
  }, []);

  useEffect(() => {
    KeepAwake.activate();
    createLocalStream();
    if (isMakeCall) {
    } else {
      onSocket("msgToUser", msgToUser);
    }
    const backAction = () => {
      onPressEndCall();
      return true;
    };

    onSocket("endCall", () => {
      releaseCamera();
      RNCallKeep.endAllCalls();
        NavigationService.popToTop()
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => {
      KeepAwake.deactivate();
      offSocket("endCall");
      backHandler.remove();
      if (intervalTimer.current) {
        clearInterval(intervalTimer.current);
      }
      if (timeoutEndCall.current) {
        clearTimeout(timeoutEndCall.current);
      }
      setDataCall({});
    };
  }, []);
  // {"chatRoomId": "66700320570c57a537c7ad80", "roomId": "667002fd570c57a537c7ad2e"}


  const createRoom = async () => {
    if (Platform.OS === "android") {
      await _requestAudioPermission();
      await _requestCameraPermission();
    }
    try {
      if (!isMakeCall) {
  
          joinCall({
            stream: streams,
            roomId: "667002fd570c57a537c7ad2e",
          });
        return;
      } else {
        // await makeCall(
        //   "666ffe3f715cee894e6f0a71",
        //   callType,
        //   undefined,
        //   "667002fd570c57a537c7ad2e",
        // );
        alert(4)
        startCall({
          stream: streams,
          roomId: "667002fd570c57a537c7ad2e",
        });
      }
    } catch (error: any) {
   
    }
  };

  const getLocalStream = (type: any, callback: any, facingMode = "user") => {
    const options = {
      audio: true,
      video: {
        facingMode: {
          exact: facingMode,
        },
        width: { exact: 960 },
        height: { exact: 480 },
      },
    };
    mediaDevices
      .getUserMedia(options)
      .then(async (stream) => {
        if (type != "video_call") {
          const videoTrack = await stream.getVideoTracks()[0];
          videoTrack.enabled = false;
        }

        callback?.(stream);
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  const releaseCamera = () => {
    streams?.release?.();
    setVideoStream(null);
  };

  const createLocalStream = () => {
    if (!streams?.id) {
      getLocalStream(callType, (s: any) => {
        setVideoStream(s);
      });
    }
  };

  const onPressEndCall = async () => {
    offSocket("endCall");
    if (timeoutEndCall.current) {
      clearTimeout(timeoutEndCall.current);
    }
    closePeer();
    RNCallKeep.endAllCalls();
    ringingRef.current?.stopSound();
    // NavigationService.popToTop()

    try {
      // if (!isMakeCall) {
      //   await endCall(
      //     data?.to_user?._id,
      //     callType,
      //     callTime.current,
      //     data?.chat_room_id,
      //   );
      // } else {
      //   await endCall(
      //     item?.partner_id?._id,
      //     callType,
      //     callTime.current,
      //     item?.chat_room_id?._id,
      //   );
      // }
    } catch (error: any) {
      Alert.alert(
        error?.response?.data?.message || translations.somethingWentWrong,
      );
    }
  };

  const msgToUser = async (d: any) => {
    const dataMsg = JSON.parse(d);
    if (
      (dataMsg?.media_ids?.[0]?.media_meta || []).find(
        (i: any) => i.key == "end_time",
      )?.value
    ) {
      try {
        RNCallKeep.endAllCalls();
        closePeer();
        await endCall(
          data?.to_user?._id,
          callType,
          callTime.current,
          data?.chat_room_id,
        );
        setTimeout(() => {
          //   const route = navigationHelper.getRouteName()
          //   if (route == NAVIGATION_VIDEO_CALL) {
          //     navigationHelper.goBack()
          //   }
        }, 500);
      } catch (error) {
        Alert.alert(translations.somethingWentWrong);
      }
    }
  };

  useEffect(() => {
    if (remoteStreams?.id) {
      ringingRef.current?.stopSound();
      startTimer.current = true;
      intervalTimer.current = setInterval(() => {
        setTimer((current) => current + 1);
      }, 1000);
      if (timeoutEndCall.current) {
        clearTimeout(timeoutEndCall.current);
      }
    }
  }, [remoteStreams?.id]);

  const startCall = async ({
    stream,
    roomId,
  }: {
    stream: any;
    roomId: string;
  }) => {
    peerConnection.current = new RTCPeerConnection(servers);
    emitSocket("joinCall", roomId);
    peerConnection.current.addEventListener("icecandidate", (event) => {
      // When you find a null candidate then there are no more candidates.
      // Gathering of candidates has finished.
      if (!event.candidate) {
        return;
      }
      if (!event.candidate) {
        return;
      }
      const dataToSend = { id: uuidv4(), candidate: event.candidate.toJSON() };

      emitSocket("emitOfferCandidates", {
        room_id: roomId,
        payload: JSON.stringify(dataToSend),
      });

      // Send the event.candidate onto the person you're calling.
      // Keeping to Trickle ICE Standards, you should send the candidates immediately.
    });
    peerConnection.current.addEventListener("track", (event) => {
      alert(Object.keys(remoteStreams).length)
      const newRemoteStream =
        Object.keys(remoteStreams).length === 0
          ? new MediaStream()
          : remoteStreams;
      // if (newRemoteStream) {
        newRemoteStream.addTrack(event.track, newRemoteStream);
        setRemoteStreams(newRemoteStream);
      // }
    });

    // Add our stream to the peer connection.
    stream.getTracks().forEach((track: any) => {
      peerConnection.current?.addTrack(track, stream);
    });

    //create offer
    const offerDescription = (await peerConnection.current?.createOffer(
      {},
    )) as RTCSessionDescription;
    await peerConnection.current?.setLocalDescription(offerDescription);
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    // console.log("emitOffer", offer)

    const dataToEmitSocket = {
      room_id: roomId,
      payload: JSON.stringify(offer),
    };

    emitSocket("emitOffer", dataToEmitSocket);
    alert("offer sent");

    onSocket("answerClient", (d: any) => {
      // console.log("START 02", typeof d)
      if (!d) {
        return;
      }
      const answer = JSON.parse(d);
      // console.log("answerClient", answer);
      if (answer?.sdp && !peerConnection.current?.remoteDescription) {
        // console.log(answer?.sdp, "GIA TRI NAY CAN KIEM TRA START 02")
        const answerDescription = new RTCSessionDescription(answer);
        // console.log("DA SET REMOTE DESCRIPTION 01")
        peerConnection.current?.setRemoteDescription(answerDescription);
      }
    });

    onSocket("answerCandidatesClient", (answer_candidates: any) => {
      // console.log("START 01", typeof answer_candidates);
      answer_candidates.forEach(async (element: any) => {
        const candidate = JSON.parse(element);
        // console.log(candidate, 'GIA TRI NAY CAN KIEM TRA 01')
        const existing = answerCandidates.current.find(
          (i) => i == candidate.id,
        );
        if (!existing) {
          answerCandidates.current = [
            ...answerCandidates.current,
            candidate.id,
          ];
          // console.log("answerCandidatesClient to add here!")
          peerConnection.current?.addIceCandidate(
            new RTCIceCandidate(candidate.candidate),
          );
        }
      });
    });
  };

  const joinCall = async ({
    stream,
    roomId,
  }: {
    stream: any;
    roomId: string;
  }) => {
    peerConnection.current = new RTCPeerConnection(servers);

    emitSocket("joinCall", roomId);
    // Add our stream to the peer connection.
    stream.getTracks().forEach((track: any) => {
      peerConnection.current?.addTrack(track, stream);
    });

    peerConnection.current.addEventListener("connectionstatechange", () => {
      switch (peerConnection.current?.connectionState) {
        case "closed":
          // You can handle the call being disconnected here.
          break;
      }
    });

    peerConnection.current?.addEventListener(
      "icecandidate",
      async (event: any) => {
        if (!event.candidate) {
          return;
        }
        const dataToSend = {
          id: uuidv4(),
          candidate: event.candidate.toJSON(),
        };
        // console.log("emitAnswerCandidates", dataToSend);
        emitSocket("emitAnswerCandidates", {
          room_id: roomId,
          payload: JSON.stringify(dataToSend),
        });
      },
    );

    peerConnection.current.addEventListener("track", (event) => {
      alert(Object.keys(remoteStreams).length)

      const newRemoteStream =
        Object.keys(remoteStreams).length === 0
          ? new MediaStream()
          : remoteStreams;
      if (newRemoteStream) {
        newRemoteStream.addTrack(event.track, newRemoteStream);
        setRemoteStreams(newRemoteStream);
      }
    });

    onSocket("offerCandidatesClient", (r: any) => {
      // console.log(r, 'rrrrr ne')
      if (!r) {
        return;
      }
      const offer_candidates = r;
      // console.log("JOIN 02", typeof offer_candidates)
      try {
        // console.log("offerCandidatesClient", offer_candidates);
        offer_candidates.forEach(async (element: any) => {
          const candidate = JSON.parse(element);
          // console.log(candidate, 'GIA TRI NAY CAN KIEM TRA 02')
          // console.log(typeof candidate, 'GIA TRI NAY CAN KIEM TRA 02TYPEOF')

          const existing = offerCandidates.current.find(
            (i) => i == candidate.id,
          );
          if (!existing) {
            offerCandidates.current = [
              ...offerCandidates.current,
              candidate.id,
            ];
            peerConnection.current?.addIceCandidate(
              new RTCIceCandidate(candidate.candidate),
            );
          }
        });
      } catch (error) {
        // console.log("error parse offerCandidatesClient", error);
      }
    });

    onSocket("offerClient", async (d: any) => {
      // console.log(d, 'JOIN 01')
      if (!d) {
        return;
      }
      try {
        const offer = JSON.parse(d);
        // console.log("offerClient", offer);
        if (offer?.sdp) {
          // console.log(offer?.sdp, 'GIA TRI NAY CAN KIEM TRA JOIN 01')
          await peerConnection.current?.setRemoteDescription(
            new RTCSessionDescription(offer),
          );
          const answerDescription =
            (await peerConnection.current?.createAnswer()) as RTCSessionDescription;
          await peerConnection.current?.setLocalDescription(answerDescription);

          const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
          };
          // console.log(answer, 'answer GUI DI')
          alert("answer")
          emitSocket("emitAnswer", {
            room_id: roomId,
            payload: JSON.stringify(answer),
          });
        }
      } catch (error) {
        // console.log("error parse offerClient", error);
      }
    });
  };

  const switchCamera = () => {
    streams.getVideoTracks().forEach((track: any) => track._switchCamera());
  };

  const toggleCamera = () => {
    const currentLocalCamera = configActions.localCamera;
    if (streams && streams.id) {
      setConfigActions((prev) => ({
        ...prev,
        localCamera: !currentLocalCamera,
      }));
      streams.getVideoTracks().forEach((track: any) => {
        track.enabled = !currentLocalCamera;
      });
    }
  };

  const setMute = () => {
    const currentLocalMic = configActions.localMic;
    if (streams && streams.id) {
      setConfigActions((prev) => ({
        ...prev,
        localMic: !currentLocalMic,
      }));
      streams.getAudioTracks().forEach((track: any) => {
        track.enabled = !currentLocalMic;
      });
    }
  };

  const closePeer = () => {
    offSocket("answerClient");
    offSocket("offerClient");
    offSocket("answerCandidatesClient");
    offSocket("offerCandidatesClient");
    if (peerConnection.current?.close) {
      peerConnection.current?.close();
    }
    offerCandidates.current = [];
    answerCandidates.current = [];
    peerConnection.current = undefined;
  };

  const _requestAudioPermission = () => {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: translations.permissions.titleAudio,
        message: translations.permissions.messageAudio,
        buttonNegative: translations.permissions.negative,
        buttonPositive: translations.permissions.positive,
      },
    );
  };

  const _requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: translations.permissions.titleCamera,
      message: translations.permissions.messageCamera,
      buttonNegative: translations.permissions.negative,
      buttonPositive: translations.permissions.positive,
    });
  };

  const splitView = useSharedValue(0);
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const viewVideo = useAnimatedStyle(() => {
    return {
      backgroundColor: "red",
      height: "100%",
      marginTop: 0,
    };
  });

  const localVideoStyle = useAnimatedStyle(() => {
    return {
      position:  "absolute",
      width: Device.width,
      height: Device.height/2,
      top: 0,
      right: splitView.value ? 0 : 0,
    };
  });

  const optionStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        optionFilter.value,
        [0, 1],
        [HEIGHT_BOTTOM, HEIGHT_BOTTOM + 50],
        Extrapolate.CLAMP,
      ),
      marginTop: interpolate(
        optionFilter.value,
        [0, 1],
        [-20, -70],
        Extrapolate.CLAMP,
      ),
    };
  });

  const onPressSplitView = () => {
    splitView.value = withTiming(splitView.value > 0 ? 0 : 1, {
      duration: 500,
    });
    optionFilter.value = withTiming(0, { duration: 300 });
  };
  const formatTime = (seconds: number) => {
    if (seconds <= 0) {
      return "";
    }
    const mins = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return (
      (mins < 10 ? "0" + mins : mins) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.headerIcon}
        hitSlop={HIT_SLOP_EXPAND_20}
        onPress={() => {onPressEndCall(); goBack()}}
      >
        <BackIcon width={MHS._24} height={MHS._24} color={palette.background} />
      </Pressable>

      <LinearGradient
        colors={[
          "rgba(0,0,0, 1)",
          "rgba(0,0,0, 0.6)",
          "rgba(0,0,0, 0.4)",
          "rgba(0,0,0, 0.2)",
          "rgba(0,0,0, 0.1)",
          "rgba(0,0,0, 0)",
        ]}
        style={styles.topHeaderCall}
      />
      {showRemoteStream && <View style={styles.topHeaderTimer}>
        <TextBase
          title={remoteStreams?.id}
          fontSize={18}
          fontWeight="700"
          color={palette.background}
        />
      </View>}
      <Animated.View style={[styles.viewLocalVideo, localVideoStyle]}>
        {streams?.id && configActions.localCamera ? (
          <RTCView
            streamURL={streams?.toURL()}
            style={{ ...StyleSheet.absoluteFillObject }}
            objectFit="cover"
            mirror={true}
            zOrder={2}
          />
        ) : (
          <ImageLoad
            source={{
              uri: account.user_avatar_thumbnail || account.user_avatar || "",
            }}
            width={"100%"}
            height={"100%"}
          />
        )}
      </Animated.View>

      <Animated.View style={[viewVideo, {
        bottom: 0,
        top: "auto",
      }]}>
        {showRemoteStream && remoteStreams?.id ? (
          <RTCView
            streamURL={remoteStreams?.toURL()}
            style={{ ...StyleSheet.absoluteFillObject }}
            objectFit="cover"
            mirror={true}
            zOrder={1}
          />
        ) : (
          <ImageLoad
            source={{
              uri:
                data?.partner_id?.user_avatar_thumbnail ||
                item.partner_id?.user_avatar ||
                "",
            }}
            width={Device.width}
            height={"100%"}
          />
        )}
      </Animated.View>
      <LinearGradient
        colors={[
          "rgba(0,0,0, 0)",
          "rgba(0,0,0, 0.1)",
          "rgba(0,0,0, 0.2)",
          "rgba(0,0,0, 0.4)",
          "rgba(0,0,0, 0.6)",
          "rgba(0,0,0, 1)",
        ]}
        style={styles.topFooterCall}
      />
      <SafeAreaView style={styles.safeAreaView}>
        <Animated.View style={[styles.options, optionStyle]}>
          <Animated.View style={[styles.viewActions]}>
            <Pressable style={styles.viewIcon} onPress={switchCamera}>
              <RotateIcon
                width={MHS._20}
                height={MHS._20}
                color={palette.background}
              />
            </Pressable>
            <Pressable style={styles.viewIcon} onPress={toggleCamera}>
              <IconCameraCall
                width={MHS._20}
                height={MHS._20}
                color={palette.background}
              />
              {!configActions.localCamera ? <View style={styles.line} /> : null}
            </Pressable>
            <Pressable style={styles.iconCall} onPress={onPressEndCall}>
              <AcceptCall color="red" width={MHS._24} height={MHS._24} />
            </Pressable>
            <Pressable style={styles.viewIcon} onPress={setMute}>
              <IconSpeakerCall
                width={MHS._20}
                height={MHS._20}
                color={palette.background}
              />
              {!configActions.localMic ? <View style={styles.line} /> : null}
            </Pressable>
            <TouchableWithoutFeedback onPress={onPressSplitView}>
              <View style={styles.viewIcon}>
                <SplitView
                  width={MHS._20}
                  height={MHS._20}
                  color={palette.background}
                />
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
      <SoundComponent
        ref={ringingRef}
        source={require("../assets/sound/ringback.wav")}
      />
    </View>
  );
};

export default OneOneRtcView;
