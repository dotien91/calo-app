import React from "react";
import { StatusBar, LogBox } from "react-native";
import Toast from "react-native-toast-message";
import { withIAPContext } from "react-native-iap";

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
      <Toast />
      <SuperModal />
      <InitView />
      <SocketConnect ref={SocketHelperRef} />
    </>
  );
};

export default withIAPContext(App);
