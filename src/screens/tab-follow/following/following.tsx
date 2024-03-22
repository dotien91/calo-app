import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useTheme } from "@react-navigation/native";

import { useListData } from "@helpers/hooks/useListData";
import useStore from "@services/zustand/store";
import Avatar from "@shared-components/user/Avatar";
import { TypedUser } from "models";
import {
  getListFollowing,
  postFollow,
  postunFollow,
} from "@services/api/user.api";
import { SCREENS } from "constants";
import _ from "lodash";
import { showToast, showWarningLogin } from "@helpers/super.modal.helper";
import { translations } from "@localization";
import LoadingList from "@shared-components/loading.list.component";
import eventEmitter from "@services/event-emitter";
const Following = ({ id }) => {
  const theme = useTheme();
  const { colors } = theme;
  const userData = useStore((state) => state.userData);
  const [listFollow, setlistFollow] = useState([]);
  const paramsRequest = {
    limit: 10,
    user_id: id,
  };
  const {
    listData,
    onEndReach,
    setListData,
    isLoading,
    renderFooterComponent,
    _requestData,
  } = useListData<TypedUser>(paramsRequest, getListFollowing);

  const followAction = (item: string) => {
    const listNewdata = listData.map((item: any) => item);
    const likeNeedToChangeIdx = _.findIndex(listNewdata, { _id: item?._id });
    const dataToChange = { ...listNewdata[likeNeedToChangeIdx] };
    dataToChange.is_follow = dataToChange.is_follow === false ? true : false;
    listNewdata[likeNeedToChangeIdx] = dataToChange;
    setListData(listNewdata);
    const data = {
      partner_id: item?.partner_id?._id,
    };
    if (item.is_follow === true && userData?._id === id) {
      postunFollow(data).then(() => {
        showToast({
          type: "success",
          message: translations.unfollow + " " + item?.partner_id?.display_name,
        });
        eventEmitter.emit("reloadTabFriendAndFollower");
      });
    } else {
      postFollow(data).then(() => {
        eventEmitter.emit("reloadTabFriendAndFollower");
        showToast({
          type: "success",
          message: translations.follow + " " + item?.partner_id?.display_name,
        });
      });
    }
  };

  const onRefresh = () => {
    _requestData(false);
  };

  useEffect(() => {
    eventEmitter.on("reloadTabFriendAndFollowing", onRefresh);

    return () => {
      eventEmitter.off("reloadTabFriendAndFollowing", onRefresh);
    };
  });

  const followActionInProfileOrtherPeople = (item: string) => {
    const listNewdata = listFollow.map((item: any) => item);
    if (check_arr(item, listFollow)) {
      // find index list data
      const indexItem = check_arrIndex(item, listNewdata);
      _.pullAt(listNewdata, indexItem);
      setlistFollow(listNewdata);
      //goi unfollow
      const data = {
        partner_id: item?.partner_id?._id,
      };
      postunFollow(data).then(() => {
        showToast({
          type: "success",
          message: translations.unfollow + " " + item?.partner_id?.display_name,
        });
      });
    } else {
      const newDataAfterAppend = _.concat(listFollow, item);
      setlistFollow(newDataAfterAppend);
      // goi follow
      const data = {
        partner_id: item?.partner_id?._id,
      };
      postFollow(data).then(() => {
        showToast({
          type: "success",
          message: translations.follow + " " + item?.partner_id?.display_name,
        });
      });
    }
  };

  function check_arr(element, arr) {
    let count = (i = 0);
    while (i < arr.length) {
      if (arr[i]?.partner_id?._id === element?.partner_id?._id) {
        count++;
        break;
      }
      ++i;
    }
    return count > 0 ? true : false;
  }

  function check_arrIndex(element, arr) {
    let count = (i = 0);
    let index = 0;
    while (i < arr.length) {
      if (arr[i]?.partner_id?._id === element?.partner_id?._id) {
        count++;
        index = i;
        break;
      }
      ++i;
    }
    return count > 0 ? index : -2;
  }

  const getDataFollowingOfUsing = () => {
    const param = {
      limit: 100,
      user_id: userData?._id,
    };
    getListFollowing(param).then((res: any) => {
      setlistFollow(res.data);
      // console.log("setlistFollow(res.data)", JSON.stringify(res, null,2))
    });
  };

  useEffect(() => {
    if (userData?._id != id) {
      getDataFollowingOfUsing();
    }
  }, []);

  const renderItemSelected = ({
    item,
    index,
  }: {
    item: TypedUser;
    index: number;
  }) => {
    const listNewdata = listFollow.map((item: any) => item);
    const newitem =
      check_arr(item, listNewdata) && userData?._id != id
        ? { ...item, theSame: true }
        : { ...item };
    return (
      <View
        key={index}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 16,
          marginBottom: 16,
          // height:400
        }}
      >
        <TouchableOpacity
          onPress={() => {
            NavigationService.push(SCREENS.PROFILE_CURRENT_USER, {
              _id: newitem?.partner_id?._id,
            });
          }}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Avatar
            style={{ height: 56, width: 56, borderRadius: 28 }}
            sourceUri={{
              uri:
                userData?._id != id
                  ? newitem?.partner_id?.user_avatar
                  : newitem?.partner_id?.user_avatar,
            }}
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
              {newitem?.partner_id?.display_name}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                color: colors.textOpacity8,
              }}
            >
              {newitem?.partner_id?.description}
            </Text>
            {/* <Text>dasdas</Text> */}
          </View>
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            style={{ backgroundColor: colors.grey2, borderRadius: 4 }}
            onPress={() => {
              if (!userData?._id) {
                showWarningLogin();
              } else {
                if (userData?._id === id) {
                  followAction(newitem);
                } else {
                  followActionInProfileOrtherPeople(newitem);
                }
              }
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
              {/* {item.is_follow === true && userData?._id === id ? translations.unfollow : translations.follow} */}
              {!userData?._id
                ? translations.follow
                : userData?._id === id
                ? newitem.is_follow === true
                  ? translations.unfollow
                  : translations.follow
                : newitem.theSame === true && newitem.is_follow === true // userid != id
                ? translations.unfollow
                : newitem.theSame === true && newitem.is_follow === false
                ? translations.follow
                : translations.follow}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, marginTop: 60 }}>
      {isLoading && <LoadingList />}
      {/* <FlatList
        style={{ marginTop: 8 }}
        data={listData}
        renderItem={renderItemSelected}
        onEndReachedThreshold={0.1}
        
        // showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReach}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
      /> */}
      <FlatList
        data={listData}
        renderItem={renderItemSelected}
        scrollEventThrottle={16}
        // contentContainerStyle={styles.listChat}
        onEndReachedThreshold={0}
        // showsHorizontalScrollIndicator={true}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReached={onEndReach}
        // keyExtractor={(item) => item?.partner_id?._id + ""}
        ListFooterComponent={renderFooterComponent()}
      />
    </View>
  );
};
export default Following;
