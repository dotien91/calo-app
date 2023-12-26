import messaging from "@react-native-firebase/messaging";
import { _setJson, _getJson } from "@services/local-storage";

export async function getFCMToken() {
  const fcmToken = _getJson("fcmToken");
  console.log("fcmToken", fcmToken);
  if (!fcmToken) {
    try {
      const token = await messaging().getToken();
      if (token) {
        _setJson("whitegFcmToken", token);
        return token;
      }
      return "";
    } catch (error) {
      console.log("error fcm token", error);
      return "";
    }
  }
  return fcmToken;
}
