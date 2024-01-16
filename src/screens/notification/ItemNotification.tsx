import * as React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";

import CommonStyle from "@theme/styles";
import { useTheme } from "@react-navigation/native";
import { getFormatDayNotification } from "@utils/date.utils";

interface ItemNotificationProps {
  item: any;
  onPress: () => void;
}

const ItemNotification = ({ onPress, item }: ItemNotificationProps) => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <TouchableOpacity
      onPress={onPress}
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
          backgroundColor:
            item.read_status !== 0 ? colors.background : colors.placeholder,
        }}
      />
      <View>
        <Image
          style={{ width: 50, height: 50, borderRadius: 25 }}
          source={{ uri: item.createdBy.user_avatar_thumbnail }}
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
            {getFormatDayNotification(item.createdAt)}
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
