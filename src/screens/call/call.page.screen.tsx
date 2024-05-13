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
} from "./assets/svgIcons";

import useStore from "@services/zustand/store";
import LinearGradient from "react-native-linear-gradient";
import ImageLoad from "./components/ImageLoad";
import { emitSocket, offSocket, onSocket } from "@helpers/socket.helper";

import { SCREENS } from "constants";
import { Device } from "./ui/device.ui";
// import { useCall, useLocalStream, _requestAudioPermission, _requestCameraPermission } from "./utils";

import { endCall, makeCall } from "@services/api/call.api";

import RNCallKeep from "react-native-callkeep";
import KeepAwake from "react-native-keep-awake";
interface HomeScreenProps {}
import createStyles from "./call.page.screen.style";
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
import { MHS } from "./ui/sizes.ui";

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
import { HIT_SLOP_EXPAND_20 } from "./constants/system.constant";
import SoundComponent from "./components/sound.component";
import TextBase from "./components/TextBase";
import { palette } from "@theme/themes";
import { translations } from "@localization";

const CallPageScreen: React.FC<HomeScreenProps> = () => {
  const route = useRoute<any>();
  const intervalTimer = useRef<ReturnType<typeof setInterval> | null>();
  const ringingRef = useRef<any>();
  const callTime = useRef<any>();
  const timeoutEndCall = useRef<ReturnType<typeof setInterval> | null>();
  const [timer, setTimer] = useState(0);
  const startTimer = useRef(false);

  const item = route.params?.item || {};
  const optionFilter = useSharedValue(0);

  const [data, setDataCall] = useState<any>(route.params?.data || {});
  const [callType] = useState(route.params?.type || "video_call");

  const peerConnection = useRef<RTCPeerConnection>();
  const [remoteStreams, setRemoteStreams] = useState<any>({});
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

  const userData = useStore((state) => state.userData);
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
    return !data.chat_room_id;
  }, []);

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
      ringingRef.current?.playSound();
    } else {
      onSocket("msgToUser", msgToUser);
    }
    const backAction = () => {
      onPressEndCall();
      return true;
    };

    onSocket("endCall", () => {
      ringingRef.current?.stopSound();
      releaseCamera();
      RNCallKeep.endAllCalls();
      setTimeout(() => {
        NavigationService.navigate(SCREENS.CHAT);
      }, 500);
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
      ringingRef.current?.stopSound();
      setDataCall({});
    };
  }, []);

  const createRoom = async () => {
    if (Platform.OS === "android") {
      await _requestAudioPermission();
      await _requestCameraPermission();
    }
    try {
      if (!isMakeCall) {
        callTime.current = data.call_time;
        const res = await makeCall(
          data?.to_user?._id,
          callType,
          data.call_time,
          data.chat_room_id,
        );
        if (res?.data) {
          if (res.data?.is_has_call) {
            return;
          }
          joinCall({
            stream: streams,
            roomId: data.room_id,
          });
        } else {
          RNCallKeep.endAllCalls();
        }
        return;
      } else {
        timeoutEndCall.current = setTimeout(() => {
          onPressEndCall();
        }, 40000);
        callTime.current = `${Math.round(Date.now() / 1000)}`;
        const res = await makeCall(
          item?.partner_id?._id,
          callType,
          callTime.current,
          item?.chat_room_id?._id,
        )
          .then(async (res: any) => {
            return res;
          })
          .catch(async () => {
            return null;
          });

        if (res && res.data) {
          await startCall({
            stream: streams,
            roomId: res.data.room_id,
          });
        } else {
          RNCallKeep.endAllCalls();
          Alert.alert(translations.somethingWentWrong);
          NavigationService.goBack();
        }
      }
    } catch (error: any) {
      RNCallKeep.endAllCalls();
      Alert.alert(
        error?.response?.data?.message || translations.somethingWentWrong,
      );
      NavigationService.goBack();
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
    NavigationService.navigate(SCREENS.CHAT);

    try {
      if (!isMakeCall) {
        await endCall(
          data?.to_user?._id,
          callType,
          callTime.current,
          data?.chat_room_id,
        );
      } else {
        await endCall(
          item?.partner_id?._id,
          callType,
          callTime.current,
          item?.chat_room_id?._id,
        );
      }
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
      // console.log("emitOfferCandidates", dataToSend);

      emitSocket("emitOfferCandidates", {
        room_id: roomId,
        payload: JSON.stringify(dataToSend),
      });

      // Send the event.candidate onto the person you're calling.
      // Keeping to Trickle ICE Standards, you should send the candidates immediately.
    });
    peerConnection.current.addEventListener("track", (event) => {
      const newRemoteStream =
        Object.keys(remoteStreams).length === 0
          ? new MediaStream()
          : remoteStreams;
      if (newRemoteStream) {
        newRemoteStream.addTrack(event.track, newRemoteStream);
        setRemoteStreams(newRemoteStream);
      }
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
      height: splitView.value ? "50%" : "100%",
      marginTop: 0,
    };
  });

  const localVideoStyle = useAnimatedStyle(() => {
    return {
      position: splitView.value == 0 ? "absolute" : "relative",
      width: splitView.value ? Device.width : 80,
      height: splitView.value ? "50%" : 120,
      top: splitView.value ? 0 : 76,
      right: splitView.value ? 0 : 20,
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
        onPress={onPressEndCall}
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
      <View style={styles.topHeaderTimer}>
        <TextBase
          title={formatTime(timer)}
          fontSize={18}
          fontWeight="700"
          color={palette.background}
        />
      </View>
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

      <Animated.View style={[viewVideo]}>
        {remoteStreams?.id ? (
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
        source={require("./assets/sound/ringback.wav")}
      />
    </View>
  );
};

export default CallPageScreen;
