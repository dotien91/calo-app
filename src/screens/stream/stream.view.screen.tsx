import React, { useCallback, useMemo } from "react";

import {
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
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

function App() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute();
  const liveStreamId = route.params?.["liveStreamId"];

  const { liveData } = useLiveStream({
    isPublisher: false,
    liveStreamId,
  });
  const setEmojiNumber = useStore((state) => state.setEmojiNumber);

  console.log("liveDataliveData", liveData);
  React.useEffect(() => {
    return () => {
      setEmojiNumber(0);
    };
  }, []);
  React.useEffect(() => {
    requestViewStream({ livestream_id: liveStreamId });
    KeepAwake.activate();
    return () => {
      KeepAwake.deactivate();
    };
  }, []);

  const isStreaming = useCallback(() => {
    return !!liveData?._id;
  }, [liveData?._id]);

  const renderVideoLive = () => {
    return (
      <View style={{ flex: 1, padding: 30, ...CommonStyle.flexCenter }}>
        <VideoPlayer
          mediaUrl={liveData.livestream_data?.m3u8_url}
          // mediaUrl={
          //   "https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8"
          // }
          resizeMode="cover"
          width={Device.width}
          height={Device.height}
          autoPlay={true}
          onPress={() => {
            Keyboard.dismiss();
          }}
        />
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

export default React.forwardRef(App);
