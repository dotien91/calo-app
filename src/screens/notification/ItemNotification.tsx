import * as React from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import CommonStyle from "@theme/styles";
import { useTheme } from "@react-navigation/native";
import { getFormatDayNotification } from "@utils/date.utils";
import { TypedNotification } from "models/notification.model";
import {
  deleteNotification,
  readNotification,
} from "@services/api/notification.api";
import { SCREENS } from "constants";
import useStore from "@services/zustand/store";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import PressableBtn from "@shared-components/button/PressableBtn";

interface ItemNotificationProps {
  item: TypedNotification;
  pressDelete: () => void;
}

const ItemNotification = ({ item, pressDelete }: ItemNotificationProps) => {
  const userData = useStore((state) => state.userData);
  const [isReaded, setIsReaded] = React.useState<boolean>(
    item?.read_status !== 0,
  );
  const addNotificationReaded = useStore(
    (state) => state.addNotificationReaded,
  );

  const _pressNotification = () => {
    console.log("pressItemNotification...", item);
    setIsReaded(true);
    const params = {
      _id: item?._id,
      read_status: "1",
    };
    readNotification(params).then((res) => {
      notificationReaded();
      if (res.isError) {
        setIsReaded(false);
      }
    });
    switch (item?.router) {
      case "NAVIGATION_TEST_RESULT":
        NavigationService.navigate(SCREENS.IELTS_PRACTICE_LIST);
        break;
      case "NAVIGATION_CHAT_ROOM":
        NavigationService.navigate(SCREENS.CHAT_ROOM, {
          id: JSON.parse(item?.param).chat_room_id,
          partner_name: item?.title,
        });
        break;
      case "NAVIGATION_LIST_NOTIFICATIONS_SCREEN": {
        const param = { id: JSON.parse(item?.param).community_id };
        return NavigationService.navigate(SCREENS.POST_DETAIL, param);
      }
      case "NAVIGATION_PURCHASE_SUCCESS_SCREEN":
        break;
      case "NAVIGATION_MESSAGE_SCREEN":
        NavigationService.navigate(SCREENS.CHAT);
        break;
      case "NAVIGATION_PROFILE_SCREEN":
      case "NAVIGATION_LIKED_SCREEN":
        NavigationService.navigate(SCREENS.PROFILE_CURRENT_USER, {
          _id: JSON.parse(item?.param).data_id,
        });
        break;

      default:
        break;
    }
  };

  const notificationReaded = () => {
    addNotificationReaded(item?._id);
  };

  const _deleteNotification = () => {
    // delete the notification
    pressDelete();
    const params = {
      notification_id: item._id,
      user_id: userData?._id,
    };
    deleteNotification(params);
  };

  const viewAvatar = () => {
    return item?.createdBy?.user_avatar_thumbnail ? (
      <Image
        style={styles.viewAvatar}
        source={{ uri: item?.createdBy?.user_avatar_thumbnail }}
      />
    ) : (
      <View style={styles.viewAvatar}>
        <IconSvg name="logoIeltsHunter" size={32} />
      </View>
    );
  };
  if (
    item.router === "NAVIGATION_CHAT_ROOM" ||
    item.type_action === "end_video_call" ||
    item.type_action === "video_call"
  ) {
    return null;
  }

  return (
    <TouchableOpacity onPress={_pressNotification} style={styles.container}>
      <ViewReaded item={item} isReaded={isReaded} />
      <View>{viewAvatar()}</View>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text
            style={isReaded ? styles.txtTitleReaded : styles.txtTitle}
            numberOfLines={1}
          >
            {item?.title}
          </Text>
        </View>
        <Text
          style={isReaded ? styles.txtContentReaded : styles.txtContent}
          numberOfLines={2}
        >
          {item?.content} {getFormatDayNotification(item?.createdAt || "")}
        </Text>
      </View>
      <PressableBtn onPress={_deleteNotification}>
        <IconSvg name="icClose" size={20} color={palette.textOpacity8} />
      </PressableBtn>
    </TouchableOpacity>
  );
};

const ViewReaded = ({
  item,
  isReaded,
}: {
  item: TypedNotification;
  isReaded: boolean;
}) => {
  const theme = useTheme();
  const { colors } = theme;

  const listNotifiReaded = useStore((state) => state.listNotifiReaded);

  const readAllAt = useStore((state) => state.readAllAt);
  const index = listNotifiReaded.findIndex((i) => i === item?._id);
  const isReadAll = readAllAt > item?.createdAt;
  return (
    <View
      style={[
        styles.viewRead,
        {
          backgroundColor:
            isReaded || index >= 0 || isReadAll
              ? colors.background
              : colors.placeholder,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  viewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 25,
    backgroundColor: palette.grey2,
    ...CommonStyle.center,
  },
  viewRead: {
    width: 0,
    height: 0,
    borderRadius: 2,
  },
  txtTitle: {
    ...CommonStyle.hnBold,
    color: palette.text,
    flex: 1,
  },
  txtTitleReaded: {
    ...CommonStyle.hnRegular,
    color: palette.text,
    flex: 1,
  },
  txtContent: {
    ...CommonStyle.hnMedium,
    fontSize: 14,
    color: palette.text,
  },
  txtContentReaded: {
    ...CommonStyle.hnRegular,
    fontSize: 14,
    color: palette.textOpacity8,
  },
});

export default ItemNotification;
