import React from "react";
import { LogBox } from "react-native";
import Toast from "react-native-toast-message";
// import { withIAPContext } from "react-native-iap";
// import CodePush from "react-native-code-push";

/**
 * ? Local Imports
 */
import Navigation from "./src/navigation";
import NetworkManager from "@helpers/network.helper";
import SuperModal from "@shared-components/modal/SuperModal";
// import SocketConnect from "@services/socket/SocketConnect";
// import { SocketHelperRef } from "@helpers/socket.helper";
import InitView from "./InitView";
import toastConfig from "@shared-components/toastConfig/toastconfig";
// import ReadDinamicLink from "@screens/read-dynamic-link/read.dinamic.link";

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
      <InitView />
      <Navigation />
      <SuperModal />
      <Toast config={toastConfig} />
      {/* <ReadDinamicLink /> */}
    </>
  );
};

// export default withIAPContext(
//   CodePush({
//     checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
//     installMode: CodePush.InstallMode.ON_NEXT_RESUME,
//   })(App)
// );
export default App;
