import React, { useCallback, useMemo } from "react";

import {
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
// import Orientation from 'react-native-orientation';
import { useTheme, useRoute } from "@react-navigation/native";
import KeepAwake from "react-native-keep-awake";
import LiveBadge from "./components/LiveBadge";
// import MicrophoneSelectModal from './components/MicrophoneSelectModal';

import VideoPlayer from "@shared-components/video.player.component";
import CommonStyle from "@theme/styles";
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

function StreamViewScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute();
  const [isReady, setIsReady] = React.useState(false);
  const checkReadyTmp = React.useRef(null);
  const retryTmp = React.useRef(false);

  const liveStreamId = route.params?.["liveStreamId"];

  const { liveData } = useLiveStream({
    isPublisher: false,
    liveStreamId,
  });
  const setEmojiNumber = useStore((state) => state.setEmojiNumber);

  const isStreamReady = (data) => {
    var startDate = new Date(data.createdAt);
    // Do your operations
    var endDate = new Date();
    var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    if (seconds > 60) clearInterval(checkReadyTmp.current);
    return seconds > 13;
  };

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
    if (retryTmp.current) {
      clearInterval(retryTmp.current);
      retryTmp.current = null;
    }
  };

  const onError = () => {
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

  const onPressVideo = React.useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const renderVideoLive = () => {
    return (
      <View style={{ flex: 1, padding: 30, ...CommonStyle.flexCenter }}>
        {isReady ? (
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
        ) : (
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: 16,
              borderRadius: 12,
              ...CommonStyle.center,
            }}
          >
            <View style={CommonStyle.flexCenter}>
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "height" : undefined}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
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
}

export default React.forwardRef(StreamViewScreen);
