import React from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import moment from "moment";
import * as NavigationService from "react-navigation-helpers";
import { useTheme } from "@react-navigation/native";

import { useListData } from "@helpers/hooks/useListData";
// import useStore from "@services/zustand/store";
import Avatar from "@shared-components/user/Avatar";
import { getListFriend } from "@services/api/chat.api";
import { TypedUser } from "models";
import { SCREENS } from "constants";

const Friend = () => {
  const theme = useTheme();
  const { colors } = theme;
  // const userData = useStore((state) => state.userData);
  const { listData, onEndReach } = useListData<TypedUser>(
    { limit: "5" },
    getListFriend,
  );

  const navigateMess = (item: TypedUser) => {
    NavigationService.navigate(SCREENS.CHAT_ROOM, {
      partner_id: item?.partner_id._id,
      partner_name: item?.partner_id.display_name,
    });
  };

  const renderItemSelected = ({
    item,
    index,
  }: {
    item: TypedUser;
    index: number;
  }) => {
    return (
      <View
        key={index}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 16,
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            style={{ height: 56, width: 56, borderRadius: 28 }}
            sourceUri={{ uri: item.partner_id?.user_avatar_thumbnail }}
          ></Avatar>
          <View style={{ marginLeft: 8 }}>
            <Text
              numberOfLines={2}
              style={{
                maxWidth: 220,
                fontSize: 16,
                fontWeight: "600",
                color: colors.text,
              }}
            >
              {item.partner_id?.display_name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.textOpacity8,
                fontWeight: "400",
              }}
            >
              {moment(item.partner_id?.last_active).format("HH:mm DD/MM/YY")}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{ backgroundColor: colors.grey2, borderRadius: 8 }}
          onPress={() => {
            navigateMess(item);
          }}
        >
          <Text
            style={{
              marginHorizontal: 8,
              marginVertical: 4,
              fontSize: 16,
              fontWeight: "400",
              color: colors.text,
            }}
          >
            Message
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ marginTop: 8 }}
        data={listData}
        renderItem={renderItemSelected}
        onEndReachedThreshold={0}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReached={onEndReach}
      />
    </View>
  );
};
export default React.memo(Friend);
