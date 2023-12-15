import { addEventListener } from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";

class NetworkManager {
  static connected = false;
  static unsubscribe = null;

  constructor() {
    NetworkManager.connected = true;
    NetworkManager.unsubscribe = null;
  }

  static getInstance() {
    if (!("singleton" in NetworkManager)) {
      Object.defineProperty(NetworkManager, "singleton", {
        value: new NetworkManager(),
        enumerable: false,
        writable: false,
        configurable: false,
      });
    }
    return NetworkManager.singleton;
  }

  configure() {
    NetworkManager.unsubscribe = addEventListener((state) => {
      if (!!NetworkManager.connected && !state.isConnected) {
        Toast.show({
          type: "error",
          text1: "Bạn đang offline",
        });
      }
      if (!NetworkManager.connected && !!state.isConnected) {
        Toast.show({
          type: "success",
          text1: "Đã khôi phục kết nối internet",
        });
      }
      NetworkManager.connected = state.isConnected;
    });
  }

  cleanup() {
    if (typeof NetworkManager.unsubscribe == "function") {
      NetworkManager.unsubscribe();
      NetworkManager.unsubscribe = null;
    }
  }
}

export default NetworkManager;
