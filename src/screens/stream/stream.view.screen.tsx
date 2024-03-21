import React, { useCallback, useMemo } from "react";

import { View, KeyboardAvoidingView, Platform } from "react-native";
// import Orientation from 'react-native-orientation';
import { useTheme, useRoute } from "@react-navigation/native";
import KeepAwake from "react-native-keep-awake";
import LiveBadge from "./components/LiveBadge";
// import MicrophoneSelectModal from './components/MicrophoneSelectModal';

import VideoPlayer from "@shared-components/video.player.component";
import CommonStyle from "@theme/styles";
import createStyles from "./stream.screen.style";
import IconBtn from "@shared-components/button/IconBtn";
import { useLiveStream } from "./hooks/useLiveStream";
import ChatView from "./stream.chat.list.view";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";
import { Device } from "@utils/device.utils";
import { requestViewStream } from "@services/api/stream.api";

function App() {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute();
  const liveStreamId = route.params?.["liveStreamId"];

  const { liveData } = useLiveStream({
    isPublisher: false,
    liveStreamId,
  });

  console.log("liveDataliveData", liveData);

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
          onPress={() => {}}
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
      <View style={styles.container}>
        <IconBtn
          name="x"
          color={colors.white}
          customStyle={{
            position: "absolute",
            top: 50,
            right: 20,
            zIndex: 1,
            backgroundColor: colors.blackOverlay,
          }}
          onPress={closeLiveStream}
          size={30}
        />
        {isStreaming() && renderVideoLive()}
        {isStreaming() && renderChatView()}
        {isStreaming() && <LiveBadge />}
      </View>
    </KeyboardAvoidingView>
  );
}

export default React.forwardRef(App);
