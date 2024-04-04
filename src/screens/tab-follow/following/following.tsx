import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";

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
import EmptyResultView from "@shared-components/empty.data.component";
import { palette } from "@theme/themes";
import CS from "@theme/styles";
const Following = ({ id }) => {
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
      <View key={index} style={styles.viewContainer}>
        <TouchableOpacity
          onPress={() => {
            NavigationService.push(SCREENS.PROFILE_CURRENT_USER, {
              _id: newitem?.partner_id?._id,
            });
          }}
          style={styles.viewInfo}
        >
          <Avatar
            style={styles.avatar}
            sourceUri={{
              uri:
                userData?._id != id
                  ? newitem?.partner_id?.user_avatar
                  : newitem?.partner_id?.user_avatar,
            }}
          />
          <View style={styles.viewTxt}>
            <Text numberOfLines={2} style={styles.txtFullname}>
              {newitem?.partner_id?.display_name}
            </Text>
            <Text style={styles.txtDes} numberOfLines={3}>
              {newitem?.partner_id?.description}
            </Text>
          </View>
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            style={styles.btnFollow}
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
            <Text style={styles.txtFollow}>
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

  const renderEmpty = () => {
    return <EmptyResultView title={translations.emptyList} />;
  };

  return (
    <View style={styles.container}>
      {isLoading && <LoadingList />}
      {!isLoading && listData.length === 0 && renderEmpty()}

      <FlatList
        data={listData}
        renderItem={renderItemSelected}
        scrollEventThrottle={16}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
  },
  avatar: {
    height: 56,
    width: 56,
    borderRadius: 28,
  },
  viewContainer: {
    ...CS.row,
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
    // height:400
  },
  viewInfo: {
    ...CS.flex1,
    ...CS.row,
  },
  btnFollow: {
    backgroundColor: palette.grey2,
    borderRadius: 4,
  },
  txtFollow: {
    ...CS.hnRegular,
    marginHorizontal: 8,
    marginVertical: 4,
    fontSize: 14,
  },
  txtFullname: {
    ...CS.hnSemiBold,
    color: palette.text,
  },
  txtDes: {
    ...CS.hnRegular,
    color: palette.textOpacity8,
  },
  viewTxt: {
    marginLeft: 8,
    flex: 1,
  },
});

export default Following;
