import React from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";

import { useListData } from "@helpers/hooks/useListData";
import useStore from "@services/zustand/store";
import Avatar from "@shared-components/user/Avatar";
import { TypedUser } from "models";
import { getListFollower, postFollow } from "@services/api/user.api";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";

const Follower = () => {
  const theme = useTheme();
  const { colors } = theme;
  const userData = useStore((state) => state.userData);
  const { listData, _requestData, onEndReach } = useListData<TypedUser>(
    { limit: "10", user_id: userData?._id },
    getListFollower,
  );

  const followAction = (partner_id: string) => {
    const data = {
      partner_id: partner_id,
    };
    postFollow(data).then(() => {
      _requestData();
    });
  };

  const showModalHozi = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        title: "Remove this follower",
        nameAction: "Remove",
        cb: removeFollower,
      },
    });
  };

  const removeFollower = () => {
    console.log("dasdsdas");
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
                maxWidth: 220,
                fontSize: 16,
                fontWeight: "400",
                color: colors.textOpacity8,
              }}
            >
              {item?.partner_id?.description}
            </Text>
            {/* <Text>dasdas</Text> */}
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{ backgroundColor: colors.btnRedPrimary, borderRadius: 8 }}
            onPress={() => {
              if (item.match_status != 1) {
                followAction(item.partner_id?._id);
              }
            }}
          >
            <Text
              style={{
                marginHorizontal: 16,
                marginVertical: 9,
                color: colors.white,
                fontSize: 14,
                fontWeight: "400",
              }}
            >
              {item.match_status === 1 ? "Friend" : "Follow Back"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showModalHozi}
            style={{ paddingRight: 5, marginLeft: 2 }}
          >
            <Icon
              style={{ height: 16, width: 19 }}
              name="ellipsis-horizontal-outline"
              type={IconType.Ionicons}
            ></Icon>
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
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReach}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
      />
    </View>
  );
};
export default React.memo(Follower);
