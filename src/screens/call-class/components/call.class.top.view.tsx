import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from "react-native-webrtc";
import React from "react";
import { View, Text } from "react-native";
import { Janus } from "react-native-janus";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import CS from "@theme/styles";
import PressableBtn from "@shared-components/button/PressableBtn";
import IconBtn from "@shared-components/button/IconBtn";
import { getStatusBarHeight } from "react-native-safearea-height";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { translations } from "@localization";

Janus.setDependencies({
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream,
});

const ClassRoomTopView = ({ switchCamera }) => {
  const theme = useTheme();
  const { colors } = theme;

  const showConfirmEndCall = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        title: translations.event.eventConfirm,
        cb: () => NavigationService.goBack(),
      },
    });
  };

  return (
    <View
      style={{
        ...CS.flexRear,
        flex: 1,
        backgroundColor: colors.blackOverlay,
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        paddingHorizontal: 16,
        zIndex: 1,
        height: 44 + getStatusBarHeight() + 16,
        paddingTop: getStatusBarHeight(),
        ...CS.flexCenter,
      }}
    >
      <View style={CS.flexStart}>
        <IconBtn
          customStyle={{ marginRight: 8 }}
          name="chevron-left"
          color={colors.white}
          onPress={() => NavigationService.goBack()}
          size={30}
        />
        <IconBtn
          onPress={switchCamera}
          customStyle={{ marginRight: 8 }}
          name="camera"
          color={colors.white}
        />
      </View>
      <View style={{ ...CS.flexCenter, flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{
            ...CS.hnSemiBold,
            color: colors.white,
            flex: 1,
          }}
        >
          IELTS Speaking Class IELTS Speaking Class IELTS Speaking Class
        </Text>
        <IconBtn
          customStyle={{ marginRight: 8 }}
          name="chevron-down"
          color={colors.white}
        />
      </View>
      <PressableBtn
        onPress={showConfirmEndCall}
        style={{
          paddingVertical: 4,
          paddingHorizontal: 12,
          backgroundColor: colors.primary,
          borderRadius: 4,
        }}
      >
        <Text
          style={{
            ...CS.hnSemiBold,
            color: colors.white,
          }}
        >
          {translations.event.end}
        </Text>
      </PressableBtn>
    </View>
  );
};

export default ClassRoomTopView;
