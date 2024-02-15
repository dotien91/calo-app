import React, { useMemo } from "react";
import { View, SafeAreaView, Text } from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local Imports
 */
import createStyles from "./chat.profile.style";
import { leaveRoom } from "@services/api/chat.api";
import { translations } from "@localization";
import Avatar from "@shared-components/user/Avatar";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SCREENS } from "constants";
import CommonStyle from "@theme/styles";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import useStore from "@services/zustand/store";
import IconBtn from "@shared-components/button/IconBtn";
import { blockUser } from "@services/api/post";
import MessageMediaView from "../room-chat/components/message/message.media.view";
import { Device } from "@utils/device.ui.utils";
import eventEmitter from "@services/event-emitter";
import Header from "@shared-components/header/Header";

const widthMedia = (Device.width - 3 * 8 - 24) / 4;

const profileChatMenu = [
  {
    type: "GROUP_ACTION",
    title: "Group action",
    data: [
      {
        icon: "users",
        txt: (text) => "Create group with " + text,
        type: "ACC-PLUS",
      },
      {
        icon: "user-plus",
        txt: (text) => "Add " + text + " to groups",
        type: "ACC-GR",
      },
    ],
  },
  {
    type: "MEDIA",
    title: "Send photo, files, links",
  },
  {
    type: "PRIVACY",
    title: "Privacy & support",
    data: [
      {
        icon: "lock",
        txt: () => "Block user",
        type: "BLOCK",
      },
      {
        icon: "flag",
        txt: () => "Report",
        type: "REPORT",
      },
    ],
  },
];

const profileGroupChatMenu = [
  {
    type: "GROUP_ACTION",
    title: "Group action",
    data: [
      {
        icon: "user-plus",
        txt: () => "Thêm thành viên",
        type: "ACC-PLUS",
      },
      {
        icon: "user-minus",
        txt: () => "Rời nhóm",
        type: "LEAVE-GR",
      },
    ],
  },
  {
    type: "MEDIA",
    title: "Send photo, files, links",
  },
  {
    type: "MEMBERS",
    title: "Members",
  },
];

const numberItemsMediaShow = 4;

interface ProfileChatScreenProps {}

const ProfileChatScreen: React.FC<ProfileChatScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute();
  const { colors } = theme;
  const partner = route.params?.["partner"];
  const roomDetail = route.params?.["roomDetail"];
  const isGroup = route.params?.["isGroup"];
  const { partner_id, chat_room_id } = roomDetail;
  const { group_partners } = chat_room_id;
  const currentMediaIds = useStore((state) => state.currentMediaIds);
  const mediaIds =
    currentMediaIds.find((item) => item.id == chat_room_id._id)?.data || [];

  console.log("mediaIdsmediaIds", mediaIds);
  const mediaIdsShow = mediaIds.slice(0, numberItemsMediaShow);
  const userData = useStore((state) => state.userData);
  const setSearchModeChat = useStore((state) => state.setSearchModeChat);

  const onSearchMessage = () => {
    setSearchModeChat(true);
    NavigationService.goBack();
  };

  const openReport = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.Report,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        report_type: "chat",
        partner_id: partner_id?._id,
      },
    });
  };

  const openUserProfile = () => {};

  const _blockUser = () => {
    const params = { partner_id: partner._id };
    blockUser(params).then((res) => {
      if (!res.isError) {
        showToast({
          type: "success",
          message: translations.blockedUser.replace(
            ":username",
            partner.display_name || "",
          ),
        });
      } else {
        showToast({
          type: "error",
          ...res,
        });
      }
    });
  };

  const openCreateGroupChatScreen = () => {
    if (isGroup) {
      NavigationService.navigate(SCREENS.CREATE_GROUP_CHAT, {
        roomDetail,
      });
      return;
    }
    NavigationService.navigate(SCREENS.CREATE_GROUP_CHAT, {
      initData: [{ ...partner, partner_id: partner }],
      roomDetail,
    });
  };

  const addToGroup = () => {
    NavigationService.navigate(SCREENS.ADD_USER_TO_GROUP, {
      roomDetail,
    });
  };

  const openMediaChatScreen = () => {
    NavigationService.navigate(SCREENS.MEDIA_CHAT_SCREEN);
  };

  const leaveGroup = () => {
    const data = {
      user_id: userData?._id,
      chat_room_id: chat_room_id._id,
    };
    showSuperModal({
      contentModalType: "loading",
      styleModalType: "middle",
    });
    leaveRoom(data).then((res) => {
      closeSuperModal();
      if (!res.isError) {
        showToast({
          type: "success",
          message: "Rời nhóm thành công",
        });
        eventEmitter.emit("refresh_list_chat");
        NavigationService.pop(2);
      } else {
        showToast({
          type: "error",
          message: "Có lỗi không xác định xảy ra",
        });
      }
    });
  };

  const onPressItem = (item) => {
    switch (item.type) {
      case "ACC-PLUS":
        openCreateGroupChatScreen();
        break;
      case "ACC-GR":
        addToGroup();
        break;
      case "MEDIA":
        openMediaChatScreen();
        break;
      case "BLOCK":
        _blockUser();
        break;
      case "DELETE-CHAT":
        break;
      case "LEAVE-GR":
        leaveGroup();
        break;
      case "REPORT":
        openReport();
        break;
      default:
        break;
    }
  };

  const openProfile = () => {
    if (isGroup) return;
    NavigationService.navigate(SCREENS.PROFILE_CURRENT_USER, {
      _id: partner_id._id,
    });
  };

  const renderTop = () => {
    return (
      <View style={styles.topAction}>
        <Avatar
          onPress={openProfile}
          sourceUri={{
            uri: partner?.user_avatar || partner?.user_avatar_thumbnail,
          }}
          resizeMode="cover"
          style={styles.avatar}
        />
        <Text style={styles.txtName}>
          {chat_room_id?.room_name || roomDetail.room_title}
        </Text>
        <View style={styles.wrapTopBtn}>
          <IconBtn
            name="search"
            color={colors.mainColor2}
            customStyle={styles.topActionBtn}
            onPress={onSearchMessage}
            size={20}
          />
          {!isGroup && (
            <IconBtn
              name="user"
              color={colors.mainColor2}
              customStyle={styles.topActionBtn}
              onPress={openUserProfile}
              size={20}
            />
          )}
        </View>
      </View>
    );
  };

  const renderMenu = (item) => {
    return (
      <TouchableOpacity style={styles.menu} onPress={() => onPressItem(item)}>
        <IconBtn
          name={item.icon}
          color={colors.mainColor2}
          customStyle={styles.menuIcon}
          size={20}
        />
        <Text style={CommonStyle.hnRegular}>
          {item.txt(chat_room_id?.room_name || roomDetail.room_title)}
        </Text>
        <IconBtn
          name={"chevron-right"}
          color={colors.mainColor2}
          customStyle={styles.iconArrow}
          size={20}
        />
      </TouchableOpacity>
    );
  };

  const renderMediaSection = (item) => {
    return (
      <TouchableOpacity onPress={openMediaChatScreen} style={styles.section}>
        <Text style={styles.titleSection}>{item.title}</Text>
        <View style={styles.wrapMedia}>
          <MessageMediaView
            width={widthMedia}
            height={widthMedia}
            fromProfileChat
            data={mediaIdsShow}
            customStyleBox={{
              flex: 1,
              ...CommonStyle.flexStart,
            }}
          />
          {mediaIds.length > numberItemsMediaShow && (
            <View
              style={[
                styles.viewMoreMedia,
                { width: widthMedia, height: widthMedia },
              ]}
            >
              <Text style={styles.txtViewMoreMedia}>
                + {mediaIds.length - numberItemsMediaShow}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderMembers = (item) => {
    return (
      <View style={styles.section}>
        <Text style={styles.titleSection}>{item.title}</Text>
        <View>
          {group_partners.map((item, index) => (
            <View
              key={index}
              style={{ ...CommonStyle.flexStart, marginVertical: 6 }}
            >
              <Avatar
                sourceUri={{
                  uri: item.user_avatar || item.user_avatar_thumbnail,
                }}
                resizeMode="cover"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  marginRight: 6,
                }}
              />
              <Text style={CommonStyle.hnRegular}>{item.display_name}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderSection = (item) => {
    if (item.type == "MEDIA") return renderMediaSection(item);
    if (item.type == "MEMBERS") return renderMembers(item);
    return (
      <View style={styles.section}>
        <Text style={styles.titleSection}>{item.title}</Text>
        <View>{item.data.map((_item) => renderMenu(_item))}</View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={{ paddingTop: 16 }}>
        {renderTop()}
        {(isGroup ? profileGroupChatMenu : profileChatMenu).map((item) =>
          renderSection(item),
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileChatScreen;
