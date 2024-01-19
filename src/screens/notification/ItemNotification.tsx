import * as React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import CommonStyle from "@theme/styles";
import { useTheme } from "@react-navigation/native";
import { getFormatDayNotification } from "@utils/date.utils";
import { TypedNotification } from "models/notification.model";
import { readNotification } from "@services/api/notification.api";
import { SCREENS } from "constants";

interface ItemNotificationProps {
  item: TypedNotification;
}

const ItemNotification = ({ item }: ItemNotificationProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const [isReaded, setIsReaded] = React.useState<boolean>(
    item.read_status !== 0,
  );

  const _pressNotification = () => {
    const params = {
      _id: item._id,
      read_status: "1",
    };
    switch (item.router) {
      case "NAVIGATION_CHAT_ROOM":
        NavigationService.navigate(SCREENS.CHAT_ROOM, {
          id: JSON.parse(item.param).chat_room_id,
          partner_name: item.title,
        });
        break;
      case "NAVIGATION_LIST_NOTIFICATIONS_SCREEN": {
        const param = { id: JSON.parse(item.param).community_id };
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
          _id: JSON.parse(item.param).data_id,
        });
        break;

      default:
        break;
    }
    readNotification(params).then((res) => {
      if (!res.isError) {
        setIsReaded(true);
      }
    });
  };

  return (
    <TouchableOpacity
      onPress={_pressNotification}
      style={{
        width: "100%",
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 8,
      }}
    >
      <View
        style={{
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: isReaded ? colors.background : colors.placeholder,
        }}
      />
      <View>
        <Image
          style={{ width: 50, height: 50, borderRadius: 25 }}
          source={{ uri: item?.createdBy?.user_avatar_thumbnail }}
        />
      </View>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text
            style={{
              ...CommonStyle.hnBold,
              color: colors.text,
              flex: 1,
            }}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text
            style={{
              ...CommonStyle.hnSemiBold,
              fontSize: 12,
              color: colors.text,
            }}
            numberOfLines={1}
          >
            {getFormatDayNotification(item?.createdAt || "")}
          </Text>
        </View>
        <Text
          style={{
            ...CommonStyle.hnMedium,
            fontSize: 14,
            color: colors.text,
          }}
          numberOfLines={1}
        >
          {item.content}
        </Text>
      </View>
      <View>
        {item.image && item.image !== "" && (
          <Image
            style={{ width: 50, height: 50, borderRadius: 8, marginRight: 8 }}
            source={{ uri: item.image }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ItemNotification;
