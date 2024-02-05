import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { _getJson, USER_TOKEN } from "@services/local-storage";
import useStore from "@services/zustand/store";
import { Alert, View } from "react-native";
const URL_CHAT_SOCKET = "https://socket.api-v2.ieltshunter.io/socket";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";
import { translations } from "@localization";

export interface TypedSocket {
  disconnect: () => void;
  on: (topic: string, callback: (data: any) => void) => void;
  emit: (topic: string, callback: string) => void;
  off: (topic: string, callback?: () => void) => void;
}

const SocketConnect = (_, ref: React.Ref<TypedSocket>) => {
  const refSocket = useRef<any>();
  const userData = useStore((state) => state.userData);
  // const { isAuthenticated, account } = useStore(state => state.user)

  useEffect(() => {
    if (!_getJson(USER_TOKEN) || !userData?._id) return;
    connectSocket();
    return () => {
      stopSocket();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?._id]);

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
        rejectUnauthorized: false,
      })
        .on("connect", onConnected)
        .on("disconnect", onDisconnect)
        .on("makeCall", makeCall);
    }
  };

  const onDisconnect = () => {
    console.log("disconnected");
  };

  const onConnected = () => {
    console.log("onConnected");
  };

  /**
   * @author Tony Vu
   * @param receiveData
   * @returns
   */
  const makeCall = (receiveData: any) => {
    try {
      const data = JSON.parse(receiveData);
      const currentRoute =
        NavigationService?.navigationRef?.current?.getCurrentRoute();
      if (
        data?.to_user?._id === userData?._id &&
        currentRoute?.name === "InComingCall"
      ) {
        NavigationService.goBack();
        return;
      }

      if (userData?._id == data?.from_user?._id) {
        return;
      }

      if (
        currentRoute?.name !== "Call" &&
        currentRoute?.name !== "InComingCall"
      ) {
        NavigationService.navigate(SCREENS.IN_COMING_CALL, { data: data });
      }
    } catch (error) {
      Alert.alert(translations.somethingWentWrong);
    }
  };

  const stopSocket = () => {
    refSocket.current?.removeAllListeners();
    refSocket.current?.disconnect?.();
  };

  return <View />;
};

export default forwardRef(SocketConnect);
