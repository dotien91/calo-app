import React from "react";
import messaging from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import { _getJson, _setJson } from "@services/local-storage";

const useFirebase = () => {
  const notificationListener = React.useRef(null);

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
        const apnsToken = await messaging().getAPNSToken();
        alert(apnsToken);
        if (apnsToken) {
          await messaging().setAPNSToken(apnsToken);
        }
        await messaging().registerDeviceForRemoteMessages();
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

  const createChannel = async () => {
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    notificationListener.current = messaging().onMessage((res) => {
      console.log(111111, res);
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
      console.log("firebase onForeground event", type, detail);

      switch (type) {
        case EventType.DISMISSED:
          console.log(" firebase User dismissed notification", detail);
          break;
        case EventType.PRESS:
          // const { router } = detail?.notification?.data || {}

          // handleNotification(router, detail?.notification?.data || {})

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
