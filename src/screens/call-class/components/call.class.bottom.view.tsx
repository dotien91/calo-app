import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

import CS from "@theme/styles";
import PressableBtn from "@shared-components/button/PressableBtn";
import IconBtn from "@shared-components/button/IconBtn";
import { Device } from "@utils/device.ui.utils";
import { palette } from "@theme/themes";
import { getListFriend, viewRoom } from "@services/api/chat.api";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";

const ClassRoomBottomView = ({
  publishers,
  toggleMute,
  toggleVideo,
  config,
}) => {
  const chatRoomId = "65a60bc04d12aaf61259976b";
  const theme = useTheme();
  const { colors } = theme;
  const { mute, video } = config;
  const [roomDetail, setRoomDetail] = useState(null);
  const [listMember, setListMember] = useState([]);

  const addUserToRoomChat = () => {
    // const data = {
    //   role: "user",
    //   chat_type: "group",
    //   user_id: userData._id,
    //   chat_room_id: chatRoomId,
    //   user_permission: "write",
    // };
    // addUserToRoom(data).then((res) => {
    //   console.log("ressss add user", res);
    //   if (!res.isError) {
    //     // add group success
    //   }
    // });
  };

  const getListUser = () => {
    getListFriend({}).then((res) => {
      if (!res.isError) {
        setListMember(res.data);
      }
      console.log("ressssss", res);
    });
  };

  useEffect(() => {
    getListUser();
    viewRoom({ id: chatRoomId }).then((res) => {
      if (!res.isError) {
        setRoomDetail(res.data);
      }
    });
    addUserToRoomChat();
  }, []);

  const openListMemberModal = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.ListUser,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        listUser: listMember,
        title: "Members " + `(${listMember.length})`,
      },
    });
  };

  const openChatRoomModal = () => {
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
        height: 64,
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
        {!!publishers.length && (
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
              {publishers.length}
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
          Members
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
            }}
          >
            <Text
              style={{
                ...CS.hnRegular,
                fontSize: 10,
                color: palette.white,
              }}
            ></Text>
            {roomDetail?.read_count}
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
          Chat
        </Text>
      </PressableBtn>
    </View>
  );
};

export default ClassRoomBottomView;
