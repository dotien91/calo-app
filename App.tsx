import React from "react";
import { StatusBar, LogBox } from "react-native";
import Toast from "react-native-toast-message";
import { withIAPContext } from "react-native-iap";
import CodePush from "react-native-code-push";

/**
 * ? Local Imports
 */
import Navigation from "./src/navigation";
import NetworkManager from "@helpers/network.helper";
import { palette } from "@theme/themes";
import SuperModal from "@shared-components/modal/SuperModal";
import SocketConnect from "@services/socket/SocketConnect";
import { SocketHelperRef } from "@helpers/socket.helper";
import InitView from "./InitView";
import toastConfig from "@shared-components/toastConfig/toastconfig";
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { _setJson } from "@services/local-storage";

LogBox.ignoreAllLogs();

const App = () => {
  React.useEffect(() => {
    TrackPlayer.setupPlayer()
      .then(() => {
        console.log("setup track player successfully");
        TrackPlayer.updateOptions({
          android: {
            appKilledPlaybackBehavior:
              AppKilledPlaybackBehavior.ContinuePlayback,
          },
          // This flag is now deprecated. Please use the above to define playback mode.
          stoppingAppPausesPlayback: true,
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
          ],
          progressUpdateEventInterval: 20,
        }).catch(console.log);
      })
      .catch(console.log);
    NetworkManager.getInstance().configure();
    return () => {
      NetworkManager.getInstance().cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useTrackPlayerEvents(
    [Event.PlaybackProgressUpdated, Event.PlaybackState],
    async (event) => {
      switch (event.type) {
        case Event.PlaybackProgressUpdated:
          // not triggered on release build
          updataDaPosition();
          console.log("data111111111", event);
          _setJson("is_first_open_app", JSON.stringify(event));

          break;
        case Event.PlaybackState:
          // triggered
          // updataDaPosition();
          // console.log("data222222");
          break;
      }
    },
  );

  return (
    <>
      <StatusBar backgroundColor={palette.white} />
      <Navigation />
      <Toast config={toastConfig} />
      <SuperModal />
      <InitView />
      <SocketConnect ref={SocketHelperRef} />
    </>
  );
};

export default withIAPContext(
  CodePush({
    checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
    installMode: CodePush.InstallMode.ON_NEXT_RESUME,
  })(App),
);
