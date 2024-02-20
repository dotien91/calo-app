import React from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { useListData } from "@helpers/hooks/useListData";
import useStore from "@services/zustand/store";
import Avatar from "@shared-components/user/Avatar";
import { TypedUser } from "models";
import {
  getListFollower,
  ignoreFollower,
  postFollow,
  postunFollow,
} from "@services/api/user.api";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { SCREENS } from "constants";
import LoadingList from "@shared-components/loading.list.component";
import { translations } from "@localization";
import _ from "lodash";
import eventEmitter from "@services/event-emitter";

const Follower = ({ id }) => {
  const theme = useTheme();
  const { colors } = theme;
  const userData = useStore((state) => state.userData);
  const paramsRequest = {
    limit: 10,
  };
  if (id) {
    paramsRequest.user_id = id;
  }

  const {
    listData,
    _requestData,
    onEndReach,
    renderFooterComponent,
    isLoading,
    setListData,
  } = useListData<TypedUser>(paramsRequest, getListFollower);

  const followAction = (partner_id: string) => {
    const data = {
      partner_id: partner_id,
    };
    postFollow(data).then(() => {
      _requestData();
      eventEmitter.emit("reloadTabFriendAndFollowing");
    });
  };

  const followActionOther = (item: any) => {
    const listNewdata = listData.map((item: any) => item);
    const likeNeedToChangeIdx = _.findIndex(listNewdata, { _id: item?._id });
    const dataToChange = {
      ...listNewdata[likeNeedToChangeIdx],
      didFollow: item.didFollow ? false : true,
    };
    listNewdata[likeNeedToChangeIdx] = dataToChange;
    setListData(listNewdata);
    const data = {
      partner_id: item?.partner_id._id,
    };
    if (item?.didFollow) {
      postunFollow(data).then(() => {
        showToast({
          type: "success",
          message: translations.unfollow + " " + item?.partner_id?.display_name,
        });
      });
    } else {
      postFollow(data).then(() => {
        showToast({
          type: "success",
          message: translations.follow + " " + item?.partner_id?.display_name,
        });
      });
    }
  };

  const showModalHozi = (partid: string) => {
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        title: "Remove this follower",
        nameAction: "Remove",
        cb: () => removeFollower(partid),
      },
    });
  };

  const removeFollower = (partnerid: string) => {
    const data = {
      user_ids: [partnerid],
    };
    ignoreFollower(data).then(() => {
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
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{ backgroundColor: colors.btnRedPrimary, borderRadius: 4 }}
            onPress={() => {
              if (userData?._id === id) {
                if (item.match_status != 1) {
                  followAction(item.partner_id?._id);
                } else {
                  NavigationService.navigate(SCREENS.CHAT_ROOM, {
                    partner_id: item?.partner_id._id,
                    partner_name: item?.partner_id.display_name,
                  });
                }
              } else {
                followActionOther(item);
              }
            }}
          >
            <Text
              style={{
                marginHorizontal: 8,
                marginVertical: 4,
                color: colors.white,
                fontSize: 14,
                fontWeight: "400",
              }}
            >
              {userData?._id === id
                ? item.match_status === 1
                  ? "Message"
                  : "Follow Back"
                : item?.didFollow
                ? "UnFollow"
                : "Follow"}
            </Text>
          </TouchableOpacity>
          {userData?._id === id && item?.match_status != 1 ? (
            <TouchableOpacity
              onPress={() => {
                showModalHozi(item?.partner_id?._id);
              }}
              style={{ paddingRight: 5, marginLeft: 2 }}
            >
              <Icon
                style={{ height: 16, width: 19 }}
                name="ellipsis-horizontal-outline"
                type={IconType.Ionicons}
              ></Icon>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, marginTop: 60 }}>
      {/* <FlatList
        style={{ marginTop: 8 }}
        data={listData}
        renderItem={renderItemSelected}
        onEndReachedThreshold={0.1}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReach}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
      /> */}
      {isLoading && <LoadingList />}
      <FlatList
        data={listData}
        renderItem={renderItemSelected}
        scrollEventThrottle={16}
        onEndReachedThreshold={0}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReached={onEndReach}
        keyExtractor={(item) => item?.partner_id?._id + ""}
        ListFooterComponent={renderFooterComponent()}
      />
    </View>
  );
};
export default Follower;
