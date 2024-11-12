import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

import CS from "@theme/styles";
import PressableBtn from "@shared-components/button/PressableBtn";
import IconBtn from "@shared-components/button/IconBtn";
import { Device } from "@utils/device.ui.utils";
import { palette } from "@theme/themes";
import { viewRoom } from "@services/api/chat.api";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { getListMemberCourse } from "@services/api/course.api";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import { BOTTOM_CLASS_HEIGHT } from "../call.class.constant";
import RNSwitchAudioOutput from 'react-native-switch-audio-output';

const ClassRoomBottomView = ({
  toggleMute,
  toggleVideo,
  config,
  courseData,
  chatRoomId,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const { mute, video } = config;
  const [roomDetail, setRoomDetail] = useState(null);
  const [speaker, setSpeaker] = useState(true);

  const [listMember, setListMember] = useState([]);
  const setCurrentMemberVideoRoom = useStore(
    (state) => state.setCurrentMemberVideoRoom,
  );

  const toggleSpeaker = () => {
    RNSwitchAudioOutput.selectAudioOutput(speaker ? RNSwitchAudioOutput.AUDIO_HEADPHONE : RNSwitchAudioOutput.AUDIO_SPEAKER)
    setSpeaker(old => !old);

  };

  const _getListMemberCourse = () => {
    getListMemberCourse({
      auth_id: courseData.user_id._id,
      course_id: courseData._id,
    }).then((res) => {
      if (!res.isError) {
        setListMember(res.data.map((item) => item.user_id));
        setCurrentMemberVideoRoom(
          res.data.map((item) => item.user_id).concat(courseData.user_id),
        );
      }
    });
  };

  useEffect(() => {
    _getListMemberCourse();
    viewRoom({ id: chatRoomId }).then((res) => {
      if (!res.isError) {
        setRoomDetail(res.data);
      }
    });
    return () => {
      setCurrentMemberVideoRoom([]);
    };
  }, []);

  const muteAll = () => {};

  const openListMemberModal = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.ListUser,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        listUser: listMember,
        title: translations.course.member(listMember.length),
        cb: muteAll,
        iconTopRight: "mic",
      },
    });
  };

  const openChatRoomModal = () => {
    setRoomDetail((old) => ({ ...old, read_count: 0 }));
    showSuperModal({
      contentModalType: EnumModalContentType.ChatRoom,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        id: chatRoomId,
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
        bottom: 0,
        right: 0,
        zIndex: 1,
        height: BOTTOM_CLASS_HEIGHT,
      }}
    >
      <PressableBtn
        onPress={toggleMute}
        style={{
          ...CS.center,
          flex: 1,
        }}
      >
        <IconBtn
          name={mute ? "mic-off" : "mic"}
          color={mute ? colors.danger : colors.white}
        />
        <Text
          style={{
            ...CS.hnRegular,
            fontSize: 14,
            color: colors.white,
          }}
        >
          {!mute ? "Mute" : "Unmute"}
        </Text>
      </PressableBtn>
      <PressableBtn
        onPress={toggleMute}
        style={{
          ...CS.center,
          flex: 1,
        }}
      >
        <IconBtn
          name={speaker ? "speaker" : "headphones"}
          color={mute ? colors.danger : colors.white}
          onPress={toggleSpeaker}
        />
        <Text
          style={{
            ...CS.hnRegular,
            fontSize: 14,
            color: colors.white,
          }}
        >
          {!speaker ? "speaker" : "headphone"}
        </Text>
      </PressableBtn>
      <PressableBtn
        onPress={toggleVideo}
        style={{
          ...CS.center,
          flex: 1,
          borderRightWidth: 1,
          borderColor: "rgba(232, 235, 239, 1)",
        }}
      >
        <IconBtn
          name={video ? "video" : "video-off"}
          color={video ? colors.white : colors.danger}
        />
        <Text
          style={{
            ...CS.hnRegular,
            fontSize: 14,
            color: colors.white,
          }}
        >
          {video ? "Stop video" : "Publish video"}
        </Text>
      </PressableBtn>
      <PressableBtn
        onPress={openListMemberModal}
        style={{
          ...CS.center,
          flex: 1,
        }}
      >
        <IconBtn name="user" color={colors.white}></IconBtn>
        {!!listMember.length && (
          <View
            style={{
              height: 16,
              paddingHorizontal: 5,
              backgroundColor: colors.red,
              borderRadius: 99,
              ...CS.flexCenter,
              position: "absolute",
              top: -7,
              right: Device.width / 8 - 18,
              ...CS.borderStyle,
              borderColor: palette.white,
            }}
          >
            <Text
              style={{
                ...CS.hnRegular,
                fontSize: 10,
                color: palette.white,
              }}
            >
              {listMember.length}
            </Text>
          </View>
        )}
        <Text
          style={{
            ...CS.hnRegular,
            fontSize: 14,
            color: colors.white,
          }}
        >
          {translations.course.member("")}
        </Text>
      </PressableBtn>
      <PressableBtn
        onPress={openChatRoomModal}
        style={{
          ...CS.center,
          flex: 1,
        }}
      >
        {!!roomDetail?.read_count && (
          <View
            style={{
              height: 16,
              paddingHorizontal: 5,
              backgroundColor: colors.red,
              borderRadius: 99,
              ...CS.flexCenter,
              position: "absolute",
              top: -7,
              right: Device.width / 8 - 18,
              ...CS.borderStyle,
              borderColor: palette.white,
              zIndex: 1,
            }}
          >
            <Text
              style={{
                ...CS.hnRegular,
                fontSize: 10,
                color: palette.white,
              }}
            >
              {roomDetail?.read_count}
            </Text>
          </View>
        )}
        <IconBtn name="message-square" color={colors.white} />
        <Text
          style={{
            ...CS.hnRegular,
            fontSize: 14,
            color: colors.white,
          }}
        >
          {translations.course.chat}
        </Text>
      </PressableBtn>
    </View>
  );
};

export default ClassRoomBottomView;
