import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { View } from "react-native";
import { io } from "socket.io-client";

import { USER_TOKEN, _getJson } from "@services/local-storage";

const URL_CHAT_SOCKET = "https://socket.api-v2.ieltshunter.io/socket";

export interface TypedSocket {
  disconnect: () => void;
  on: (topic: string, callback: () => void) => void;
  emit: (topic: string, callback: string) => void;
  off: (topic: string, callback?: () => void) => void;
}

const SocketConnect = (_, ref: React.Ref<TypedSocket>) => {
  const refSocket = useRef<any>();
  // const { isAuthenticated, account } = useStore(state => state.user)

  useEffect(() => {
    connectSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    disconnect: () => {
      refSocket.current?.disconnect?.();
    },
    on(topic, callback) {
      refSocket.current?.on(topic, callback);
    },
    off: (topic, callback) => {
      if (callback) {
        refSocket.current?.off(topic, callback);
      } else {
        refSocket.current?.off(topic);
      }
    },
    emit(topic, callback) {
      console.log("topic", topic, callback);
      refSocket.current?.emit(topic, callback);
    },
  }));

  const connectSocket = async () => {
    const token = _getJson(USER_TOKEN);
    if (token) {
      refSocket.current = io(URL_CHAT_SOCKET, {
        extraHeaders: {
          "X-Authorization": token || "",
        },
        transports: ["websocket"],
        rejectUnauthorized: false,
      })
        .on("connect", onConnected)
        .on("disconnect", onDisconnect);
    }
  };

  const onDisconnect = () => {
    console.log("disconnected");
  };

  const onConnected = () => {
    console.log("onConnected");
  };

  return <View />;
};

export default forwardRef(SocketConnect);
