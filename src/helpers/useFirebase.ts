import React from "react";
import messaging from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import { _getJson, _setJson } from "@services/local-storage";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";

const useFirebase = () => {
  const notificationListener = React.useRef(null);
  const currentNotiData = React.useRef(null);

  React.useEffect(() => {
    initFirebase();
    return () => {
      if (notificationListener.current) notificationListener.current();
    };
  }, []);

  async function getFCMToken() {
    const fcmToken = _getJson("fcmToken");
    console.log("fcmToken firebase", fcmToken);
    if (!fcmToken) {
      try {
        // const apnsToken = await messaging().getAPNSToken();
        // console.log("apnsTokenapnsToken", apnsToken)
        // if (apnsToken) {
        //   await messaging().setAPNSToken(apnsToken);
        // }
        // await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        console.log("get token firebase", token);

        if (token) {
          _setJson("fcmToken", token);
          createChannel();
          return token;
        }
        return "";
      } catch (error) {
        console.log("error fcm token", error);
        return "";
      }
    }
    createChannel();
    return fcmToken;
  }

  async function requestPermission() {
    try {
      const data = await messaging().requestPermission();
      console.log("firebase request permission", data);
      // User has authorised
      getFCMToken();
    } catch (error) {
      // User has rejected permissions
    }
  }

  const initFirebase = async () => {
    const enabled = await messaging().hasPermission();
    console.log("firebase check", enabled);
    if (enabled == 1) {
      getFCMToken();
    } else if (enabled == 0) {
      // alert("open setting")
    } else {
      requestPermission();
    }
  };

  const _pressNotification = (item) => {
    // const params = {
    //   _id: item?._id,
    //   read_status: "1",
    // };
    switch (item?.router) {
      case "NAVIGATION_TEST_RESULT":
        NavigationService.push(SCREENS.IELTS_PRACTICE_LIST);
        break;
      case "NAVIGATION_CHAT_ROOM":
        NavigationService.navigate(SCREENS.CHAT_ROOM, {
          id: item?.chat_room_id,
          partner_name: item?.title,
        });
        break;
      case "NAVIGATION_LIST_NOTIFICATIONS_SCREEN": {
        const param = { id: item?.community_id, fromPush: true };
        return NavigationService.push(SCREENS.POST_DETAIL, param);
      }
      case "NAVIGATION_PURCHASE_SUCCESS_SCREEN":
        NavigationService.navigate(SCREENS.MY_COURES);
        break;
      case "NAVIGATION_MESSAGE_SCREEN":
        NavigationService.navigate(SCREENS.CHAT);
        break;
      case "NAVIGATION_PROFILE_SCREEN":
      case "NAVIGATION_LIKED_SCREEN":
        NavigationService.push(SCREENS.PROFILE_CURRENT_USER, {
          _id: item.data_id,
        });
        break;

      default:
        break;
    }
  };

  const createChannel = async () => {
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    notificationListener.current = messaging().onMessage((res) => {
      currentNotiData.current = res.data;
      notifee.displayNotification({
        title: res.notification?.title,
        body: res.notification?.body,
        android: {
          channelId,
          // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: "default",
          },
          sound: "notification.wav",
          smallIcon: "ic_notification",
          color: "#a51c30",
        },
        ios: {
          sound: "notification.wav",
        },
      });
    });

    // messaging()
    //   .subscribeToTopic("all")
    //   .then(() => console.log("firebase Subscribed to topic all!"));

    messaging().onTokenRefresh((newFcmToken: string) => {
      console.log("firebase refreshFCMToken", newFcmToken);

      // let isAuth = store.getState()?.user?.isAuthenticated;
      // if (isAuth) actions.setTokenFirebase(newFcmToken);
    });

    notifee.onForegroundEvent(({ type, detail }) => {
      console.log(
        "firebase onForeground event",
        currentNotiData.current,
        2,
        type,
        detail,
      );

      switch (type) {
        case EventType.DISMISSED:
          console.log(" firebase User dismissed notification", detail);
          break;
        case EventType.PRESS:
          // const { router } = detail?.notification?.data || {}

          // handleNotification(router, detail?.notification?.data || {})
          _pressNotification(currentNotiData.current);
          console.log(" firebase User pressed notification", detail);
          break;
      }
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "firebase Notification caused app to open from quit state:",
            remoteMessage.notification,
          );
          // const { data = {} } = remoteMessage || {};
          // const { router = "" } = data;
          // if (!router) {
          //   return;
          // }
          // handleNotification(router, data)
        }
      });
  };
};

export default useFirebase;
