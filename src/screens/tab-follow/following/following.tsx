import React from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { useListData } from "@helpers/hooks/useListData";
import useStore from "@services/zustand/store";
import Avatar from "@shared-components/user/Avatar";
import { TypedUser } from "models";
import { getListFollowing, postunFollow } from "@services/api/user.api";
import { useTheme } from "@react-navigation/native";
import { SCREENS } from "constants";

const Following = () => {
  const theme = useTheme();
  const { colors } = theme;
  const userData = useStore((state) => state.userData);
  const { listData, _requestData, onEndReach } = useListData<TypedUser>(
    { limit: "10", user_id: userData?._id },
    getListFollowing,
  );

  const followAction = (partner_id: string) => {
    const data = {
      partner_id: partner_id,
    };
    postunFollow(data).then(() => {
      _requestData();
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
        <TouchableOpacity
          onPress={() => {
            NavigationService.push(SCREENS.PROFILE_CURRENT_USER, {
              _id: item?.partner_id?._id,
            });
          }}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Avatar
            style={{ height: 56, width: 56, borderRadius: 28 }}
            sourceUri={{ uri: item?.partner_id?.user_avatar }}
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
              {item?.partner_id?.display_name}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                color: colors.textOpacity8,
              }}
            >
              {item?.partner_id?.description}
            </Text>
            {/* <Text>dasdas</Text> */}
          </View>
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            style={{ backgroundColor: colors.grey2, borderRadius: 8 }}
            onPress={() => {
              followAction(item.partner_id?._id);
            }}
          >
            <Text
              style={{
                marginHorizontal: 8,
                marginVertical: 4,
                color: colors.text,
                fontSize: 14,
                fontWeight: "400",
              }}
            >
              Following
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ marginTop: 8 }}
        data={listData}
        renderItem={renderItemSelected}
        onEndReachedThreshold={0.1}
        // showsHorizontalScrollIndicator={false}
        // showsVerticalScrollIndicator={false}
        onEndReached={onEndReach}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
      />
    </View>
  );
};
export default React.memo(Following);
