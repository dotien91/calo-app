import React, { useCallback, useMemo } from "react";

import {
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
// import Orientation from 'react-native-orientation';
import { useTheme, useRoute } from "@react-navigation/native";
import KeepAwake from "react-native-keep-awake";
import LiveBadge from "./components/LiveBadge";
// import MicrophoneSelectModal from './components/MicrophoneSelectModal';

import VideoPlayer from "@shared-components/video.player.component";
import createStyles from "./stream.screen.style";
import { useLiveStream } from "./hooks/useLiveStream";
import ChatView from "./stream.chat.list.view";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";
import { Device } from "@utils/device.utils";
import { requestViewStream } from "@services/api/stream.api";
import useStore from "@services/zustand/store";
import PressableBtn from "@shared-components/button/PressableBtn";
import IconSvg from "assets/svg";
import { palette } from "@theme/themes";
import { getStatusBarHeight } from "react-native-iphone-screen-helper";
import { translations } from "@localization";
import TextBase from "@shared-components/TextBase";
import TrackPlayer from "react-native-track-player";
import Avatar from "@shared-components/user/Avatar";
import CS from "@theme/styles";
import { getHoursAndDate } from "@utils/date.utils";

function StreamViewScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute();
  const [isReady, setIsReady] = React.useState(false);
  const checkReadyTmp = React.useRef(null);
  const retryTmp = React.useRef(false);

  const liveStreamId = route.params?.["liveStreamId"];
  const { liveData, isCommingSoon } = useLiveStream({
    isPublisher: false,
    liveStreamId,
  });
  const setEmojiNumber = useStore((state) => state.setEmojiNumber);
  const isStreamReady = (data) => {
    const startDate = new Date(data.createdAt);
    // Do your operations
    const endDate = new Date();
    const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    if (seconds > 60) clearInterval(checkReadyTmp.current);
    return seconds > 13;
  };

  React.useEffect(() => {
    playAudio();
  }, []);

  React.useEffect(() => {
    if (!liveData) return;
    checkReadyTmp.current = setInterval(() => {
      if (isStreamReady(liveData)) {
        setIsReady(true);
        clearInterval(checkReadyTmp.current);
        checkReadyTmp.current = null;
      }
    }, 500);
  }, [liveData]);

  const playAudio = async () => {
    const track = {
      // url: "https://files.exam24h.com/upload/2024/05/10_1715327584971/661768ce52c681916687c57c/sound.m4a",
      url: "https://ia801304.us.archive.org/32/items/SilentRingtone/silence.mp3",
      title: "",
      artist: "",
      artwork: "",
    };
    await TrackPlayer.reset();
    await TrackPlayer.seekBy(1);
    await TrackPlayer.add(track);
    await TrackPlayer.play();
    setTimeout(() => {
      TrackPlayer.stop();
    }, 2000);
  };

  React.useEffect(() => {
    requestViewStream({ livestream_id: liveStreamId });
    KeepAwake.activate();
    return () => {
      KeepAwake.deactivate();
      setEmojiNumber(0);
      if (checkReadyTmp.current) {
        clearInterval(checkReadyTmp.current);
        checkReadyTmp.current = null;
      }
      if (retryTmp.current) {
        clearInterval(retryTmp.current);
        retryTmp.current = null;
      }
    };
  }, []);

  const isStreaming = useCallback(() => {
    return !!liveData?._id;
  }, [liveData?._id]);

  const onLoad = () => {
    console.log("error");
    if (retryTmp.current) {
      clearInterval(retryTmp.current);
      retryTmp.current = null;
    }
  };

  const onError = () => {
    console.log("error");
    if (retryTmp.current) {
      clearInterval(retryTmp.current);
      retryTmp.current = null;
    }
    retryTmp.current = setInterval(() => {
      setIsReady(false);
      setTimeout(() => {
        setIsReady(true);
      }, 800);
    }, 8000);
  };

  const renderVideo = () => {
    if (isCommingSoon)
      return (
        <View
          style={[
            CS.center,
            {
              marginTop: -(Device.height / 4),
            },
          ]}
        >
          <Avatar
            style={{
              marginBottom: 16,
              width: 120,
              height: 120,
              borderRadius: 999,
              ...CS.borderStyle,
              borderWidth: 3,
              borderColor: palette.white,
            }}
            sourceUri={{
              uri: liveData.user_id?.user_avatar,
            }}
          />
          <View
            style={{
              backgroundColor: palette.lightOverlay,
              borderRadius: 8,
              padding: 8,
            }}
          >
            <TextBase
              textAlign="center"
              fontSize={28}
              color="white"
              fontWeight="700"
            >
              {getHoursAndDate(liveData?.start_time).hour}
            </TextBase>
            <TextBase
              textAlign="center"
              fontSize={20}
              color="white"
              fontWeight="600"
            >
              {getHoursAndDate(liveData?.start_time).date}
            </TextBase>
          </View>
        </View>
      );
    return (
      <VideoPlayer
        mediaUrl={liveData.livestream_data?.m3u8_url}
        resizeMode="cover"
        width={Device.width}
        height={Device.height}
        autoPlay={true}
        onLoad={onLoad}
        onError={onError}
        onPress={onPressVideo}
      />
    );
  };

  const onPressVideo = React.useCallback(() => {
    Keyboard.dismiss();
  }, []);
  // console.log("liveData.livestream_data?.m3u8_url", liveData?.livestream_data?.m3u8_url)
  const renderVideoLive = () => {
    return (
      <View style={{ flex: 1, padding: 30, ...CS.flexCenter }}>
        {isReady ? (
          renderVideo()
        ) : (
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: 16,
              borderRadius: 12,
              ...CS.center,
            }}
          >
            <View style={CS.flexCenter}>
              <ActivityIndicator size={"large"} color={palette.white} />
            </View>
            <TextBase color="white" fontSize={20}>
              {translations.liveStream.streamPending}
            </TextBase>
          </View>
        )}
      </View>
    );
  };

  const renderChatView = () => {
    if (!liveData?._id) return null;
    return (
      <View style={styles.chatView}>
        <ChatView
          isTeacher={false}
          isPublisher={false}
          liveStreamId={liveStreamId}
          liveData={liveData}
        />
      </View>
    );
  };

  const closeLiveStream = () => {
    NavigationService.navigate(SCREENS.HOME);
  };

  const renderContent = () => {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: palette.blackOverlay }}
        behavior={Platform.OS === "ios" ? "height" : undefined}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View
            style={[styles.container, { backgroundColor: palette.transparent }]}
          >
            <PressableBtn
              style={{
                position: "absolute",
                top: getStatusBarHeight() + 10,
                right: 20,
                zIndex: 1,
              }}
              onPress={() => {
                closeLiveStream();
              }}
            >
              <IconSvg name="icXShadow" size={20} color={palette.white} />
            </PressableBtn>
            {isStreaming() && renderVideoLive()}
            {isStreaming() && renderChatView()}
            {isStreaming() && <LiveBadge />}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  };

  if (!isCommingSoon) return renderContent();
  return (
    <ImageBackground
      source={{ uri: liveData?.cover_url || liveData?.user_id?.user_avatar }}
      style={{
        width: "100%",
        height: Device.height,
        backgroundColor: palette.blackOverlay,
      }}
    >
      {renderContent()}
    </ImageBackground>
  );
}

export default React.forwardRef(StreamViewScreen);
