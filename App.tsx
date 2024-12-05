import React from "react";
import { LogBox } from "react-native";
import Toast from "react-native-toast-message";
import { withIAPContext } from "react-native-iap";
import CodePush from "react-native-code-push";

/**
 * ? Local Imports
 */
import Navigation from "./src/navigation";
import NetworkManager from "@helpers/network.helper";
import SuperModal from "@shared-components/modal/SuperModal";
import SocketConnect from "@services/socket/SocketConnect";
import { SocketHelperRef } from "@helpers/socket.helper";
import InitView from "./InitView";
import toastConfig from "@shared-components/toastConfig/toastconfig";
import TrackPlayer, { Capability, Event } from "react-native-track-player";
import AudioProgress from "@screens/audio/hook/AudioProgress";
import ReadDinamicLink from "@screens/read-dynamic-link/read.dinamic.link";
import RNScreenshotPrevent, { addListener } from 'react-native-screenshot-prevent';

LogBox.ignoreAllLogs();

const App = () => {
  React.useEffect(() => {
    RNScreenshotPrevent.enabled(true);
    RNScreenshotPrevent.enableSecureView()
    NetworkManager.getInstance().configure();
    return () => {
      NetworkManager.getInstance().cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* <StatusBar backgroundColor={palette.white} /> */}
      <Navigation />
      <Toast config={toastConfig} />
      <SuperModal />
      <InitView />
      <SocketConnect ref={SocketHelperRef} />
      <AudioProgress />
      <ReadDinamicLink />
    </>
  );
};

export const PlaybackService = async function () {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
    ],

    // Capabilities that will show up when the notification is in the compact form on Android
    compactCapabilities: [Capability.Play, Capability.Pause],
  });

  TrackPlayer.addEventListener(Event.RemotePlay, TrackPlayer.play);
  TrackPlayer.addEventListener(Event.RemotePause, TrackPlayer.pause);
  TrackPlayer.addEventListener(Event.RemoteNext, TrackPlayer.skipToNext);
  TrackPlayer.addEventListener(
    Event.RemotePrevious,
    TrackPlayer.skipToPrevious,
  );
  TrackPlayer.addEventListener(Event.RemoteSeek, TrackPlayer.seekTo);
};

// TrackPlayer.registerPlaybackService(() => PlaybackService);

export default withIAPContext(
  CodePush({
    checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
    installMode: CodePush.InstallMode.ON_NEXT_RESUME,
  })(App),
);
