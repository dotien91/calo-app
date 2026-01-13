import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from "react-native-webrtc";
import React from "react";
import { View, Text } from "react-native";
import { Janus } from "r";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import CS from "@theme/styles";
import PressableBtn from "@shared-components/button/PressableBtn";
import IconBtn from "@shared-components/button/IconBtn";
import { getStatusBarHeighindext } from "react-native-safearea-height";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { translations } from "@localization";
import { TypedCourse } from "shared/models";
import { TOP_CLASS_HEIGHT } from "../call.class.constant";
import { SCREENS } from "constants";
import eventEmitter from "@services/event-emitter";
import { useClassRoom } from "../useClassRoom";

Janus.setDependencies({
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream,
});

const ClassRoomTopView = ({
  switchCamera,
  data,
}: {
  switchCamera: () => void;
  data: TypedCourse;
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const { isTeacher } = useClassRoom();
  // const showConfirmEndCall = () => {
  //   showSuperModal({
  //     contentModalType: EnumModalContentType.Confirm,
  //     styleModalType: EnumStyleModalType.Middle,
  //     data: {
  //       title: translations.event.eventConfirm,
  //       cb: () => NavigationService.goBack(),
  //     },
  //   });
  // };

  const showConfirmEndCall = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.ConfirmEvaluation,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        title: translations.event.eventConfirm,
        cb: () => {
          NavigationService.goBack();
          eventEmitter.emit("close_super_modal");
          isTeacher
            ? setTimeout(() => {
                showSuperModal({
                  contentModalType: EnumModalContentType.ConfirmEvaluation,
                  styleModalType: EnumStyleModalType.Middle,
                  data: {
                    title: translations.evaluation.evaluation,
                    desc: translations.evaluation.desc,
                    toEvaluation: () => {
                      NavigationService.navigate(SCREENS.LIST_STUDENTS, {
                        classId: data.classes[0]._id,
                        // auth_id: data.user_id._id,
                        // course_id: data._id,
                      }),
                        eventEmitter.emit("close_super_modal");
                    },
                  },
                });
              }, 1000)
            : null;
        },
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
        height: TOP_CLASS_HEIGHT,
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
          {/* todo */}
          {data?.title}
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
