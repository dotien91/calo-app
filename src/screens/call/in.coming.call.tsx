import { AcceptCall, DenyCall, IconCall } from "./assets/svgIcons";
import Header from "./components/Header";
import ImageLoad from "./components/ImageLoad";
import SoundComponent from "./components/sound.component";
import * as NavigationService from "react-navigation-helpers";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Alert,
  PermissionsAndroid,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { endCall } from "@services/api/call.api";

import { MHS } from "./ui/sizes.ui";
import createStyle from "./in.coming.call.style";
import { useTheme, useRoute } from "@react-navigation/native";
import { SCREENS } from "constants";
import { offSocket, onSocket } from "@helpers/socket.helper";
import { palette } from "@theme/themes";
import { translations } from "@localization";

const InComingCall = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyle(theme), [theme]);
  const route = useRoute<any>();
  const ringing = useSharedValue(0);
  const data = route.params.data || {};
  const partner = data.to_user || {};
  console.log(data, "data call receive");
  const ringingRef = useRef<any>(null);
  const callAnswerCall = useRef(false);

  useEffect(() => {
    ringingRef.current?.playSound();
    ringing.value = withRepeat(withTiming(1, { duration: 1200 }), 1000, true);
    onSocket("endCall", () => {
      setTimeout(() => {
        NavigationService.goBack();
      }, 500);
      ringingRef.current?.stopSound();
    });

    return () => {
      offSocket("endCall");
    };
  }, []);

  const onPressEndCall = async () => {
    NavigationService.goBack();
    ringingRef.current?.stopSound();
    try {
      await endCall(
        partner?._id,
        data.call_type,
        data.call_time,
        data.chat_room_id,
      );
    } catch (error: any) {
      Alert.alert(
        error?.response?.data?.message || translations.somethingWentWrong,
      );
    }
  };

  const _requestAudioPermission = () => {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: translations.call.titleMic,
        message: translations.call.messageMic,
        buttonNegative: translations.cancel,
        buttonPositive: "OK",
      },
    );
  };

  const _requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: translations.call.titleCamera,
      message: translations.call.messageCamera,
      buttonNegative: translations.cancel,
      buttonPositive: "OK",
    });
  };

  const onPressAcceptCall = async () => {
    ringingRef.current?.stopSound();
    if (callAnswerCall.current) {
      return;
    }
    callAnswerCall.current = true;
    if (Platform.OS === "android") {
      await _requestAudioPermission();
      await _requestCameraPermission();
    }
    const d = data;
    NavigationService.navigate(SCREENS.CALL_PAGE, {
      data: data,
      type: d.call_type,
    });
    return;
  };

  const styleRinging1 = useAnimatedStyle(() => {
    return {
      width: interpolate(ringing.value, [0, 1], [230, 300], Extrapolate.CLAMP),
      height: interpolate(ringing.value, [0, 1], [230, 300], Extrapolate.CLAMP),
      opacity: interpolate(
        ringing.value,
        [0, 1],
        [0.8, 0.4],
        Extrapolate.CLAMP,
      ),
    };
  });

  const styleRinging3 = useAnimatedStyle(() => {
    return {
      width: interpolate(ringing.value, [0, 1], [280, 350], Extrapolate.CLAMP),
      height: interpolate(ringing.value, [0, 1], [280, 350], Extrapolate.CLAMP),
      opacity: interpolate(ringing.value, [0, 1], [0.4, 0], Extrapolate.CLAMP),
    };
  });

  return (
    <View style={styles.container}>
      <Header
        title={translations.call.inComingCall}
        onPressLeft={onPressEndCall}
      />
      <View style={styles.content}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Animated.View style={[styles.ringing, styleRinging1]} />
          <Animated.View style={[styles.ringing, styleRinging3]} />
          <View style={styles.viewOtherAvatar}>
            <IconCall
              width={MHS._20}
              height={MHS._20}
              color={palette.background}
            />
          </View>

          <ImageLoad
            source={{
              uri:
                data?.to_user?.user_avatar_thumbnail ||
                data?.to_user?.user_avatar ||
                "",
            }}
            width={MHS._190}
            height={MHS._190}
            style={{ borderRadius: MHS._190 }}
          />
        </View>
        <View>
          <Text style={{ textAlign: "center" }}>
            {partner?.display_name || ""}
          </Text>
        </View>
        <View style={styles.viewActions}>
          <Pressable style={styles.iconCall} onPress={onPressEndCall}>
            <DenyCall
              width={MHS._36}
              height={MHS._36}
              color={palette.background}
            />
          </Pressable>
          <Pressable
            style={[styles.iconCall, { backgroundColor: palette.green }]}
            onPress={onPressAcceptCall}
          >
            <AcceptCall
              width={MHS._36}
              height={MHS._36}
              color={palette.background}
            />
          </Pressable>
        </View>
      </View>
      <SoundComponent
        ref={ringingRef}
        source={require("./assets/sound/waiting_ringtone.wav")}
      />
    </View>
  );
};

export default InComingCall;
