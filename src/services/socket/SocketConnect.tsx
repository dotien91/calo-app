import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { _getJson, _setJson, USER_TOKEN } from "@services/local-storage";
import useStore from "@services/zustand/store";
import { Alert, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";
import { translations } from "@localization";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { APP_URL } from "constants/config.constant";
import eventEmitter from "@services/event-emitter";

const URL_CHAT_SOCKET = APP_URL.BASEURL_SOCKET;
console.log("URL_CHAT_SOCKET", URL_CHAT_SOCKET);
const pointRequireShowAnimation = 10;

export interface TypedSocket {
  disconnect: () => void;
  on: (topic: string, callback: (data: any) => void) => void;
  emit: (topic: string, callback: string) => void;
  off: (topic: string, callback?: () => void) => void;
}

const SocketConnect = (_, ref: React.Ref<TypedSocket>) => {
  const refSocket = useRef<any>();
  const userData = useStore((state) => state.userData);
  const userInfo = useStore((state) => state.userInfo);
  const setUserInfo = useStore((state) => state.setUserInfo);
  const pointNumber = useRef(userInfo?.point || 0);

  // const { isAuthenticated, account } = useStore(state => state.user)

  useEffect(() => {
    if (!_getJson(USER_TOKEN) || !userData?._id) return;
    connectSocket();
    return () => {
      stopSocket();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?._id]);

  useEffect(() => {
    pointNumber.current = userInfo?.point;
  }, [userInfo?.point]);

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
        .on("makeCall", makeCall)
        // .on("cointToClient", cointToClient)
        .on("pointToClient", pointToClient)
        .on("redeemToClient", redeemToClient)
        .on("giftToClient", giftToClient)
        .on("joinOneoneClient", joinOneoneClient);
    }
  };
  const giftToClient = (data: any) => {
    eventEmitter.emit("show_gift_in_live", data);
  };
  const joinOneoneClient = () => {
    eventEmitter.emit("reload_oneone_screen");
  };

  const onDisconnect = () => {
    console.log("disconnected");
  };

  const onConnected = () => {
    console.log(
      "onConnected socket================================================================",
    );
  };

  // const cointToClient = (receiveData: any) => {
  //   console.log("cointToClient", receiveData);
  // };

  const pointToClient = (receiveData: any) => {
    console.log("receiveData", receiveData);
    const showFirstTimeEarnPoint = _getJson("showFirstTimeEarnPoint");
    const currentPoint = pointNumber.current;
    const data = JSON.parse(receiveData);
    const pointEarn = Number(data.point) - currentPoint;
    if (!showFirstTimeEarnPoint) {
      showSuperModal({
        styleModalType: EnumStyleModalType.Bottom,
        contentModalType: EnumModalContentType.GamificationView,
        data: {
          receiveData: data,
          pointEarn,
        },
      });
      _setJson("showFirstTimeEarnPoint", true);
      return;
    }
    if (showFirstTimeEarnPoint && data?.is_level_up == "false") {
      //show hiệu ứng khi user nhận được số point > pointRequireShowAnimation
      if (pointEarn >= pointRequireShowAnimation) {
        showSuperModal({
          styleModalType: EnumStyleModalType.Middle,
          contentModalType: EnumModalContentType.LottieAnimation,
          data: {
            receiveData: data,
          },
        });
      } else {
        setUserInfo({ ...userInfo, point: data?.point });
      }
    }
  };

  const redeemToClient = (receiveData: any) => {
    console.log("redeemToClient", receiveData);
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
