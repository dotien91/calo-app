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
import AudioProgress from "@screens/audio/hook/AudioProgress";

LogBox.ignoreAllLogs();

const App = () => {
  React.useEffect(() => {
    NetworkManager.getInstance().configure();
    return () => {
      NetworkManager.getInstance().cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <StatusBar backgroundColor={palette.white} />
      <Navigation />
      <Toast config={toastConfig} />
      <SuperModal />
      <InitView />
      <SocketConnect ref={SocketHelperRef} />
      <AudioProgress />
    </>
  );
};

export default withIAPContext(
  CodePush({
    checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
    installMode: CodePush.InstallMode.ON_NEXT_RESTART,
  })(App),
);
