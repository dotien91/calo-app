import React from "react";
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
  getListFollower,
  ignoreFollower,
  postFollow,
  postunFollow,
} from "@services/api/user.api";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showToast,
  showWarningLogin,
} from "@helpers/super.modal.helper";
import { SCREENS } from "constants";
import LoadingList from "@shared-components/loading.list.component";
import { translations } from "@localization";
import _ from "lodash";
import eventEmitter from "@services/event-emitter";
import EmptyResultView from "@shared-components/empty.data.component";
import CS from "@theme/styles";
import { palette } from "@theme/themes";

const Follower = ({ id }) => {
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
        title: translations.removeThisFollow,
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
      <View key={index} style={styles.viewContainer}>
        <TouchableOpacity
          onPress={() => {
            NavigationService.push(SCREENS.PROFILE_CURRENT_USER, {
              _id: item?.partner_id?._id,
            });
          }}
          style={styles.viewInfo}
        >
          <Avatar
            style={styles.avatar}
            sourceUri={{ uri: item?.partner_id?.user_avatar }}
          />
          <View style={styles.viewTxt}>
            <Text numberOfLines={2} style={styles.txtFullname}>
              {item?.partner_id?.display_name}
            </Text>
            <Text numberOfLines={3} style={styles.txtDes}>
              {item?.partner_id?.description}
            </Text>
            {/* <Text>dasdas</Text> */}
          </View>
        </TouchableOpacity>
        <View style={CS.row}>
          <TouchableOpacity
            style={styles.btnFollow}
            onPress={() => {
              if (!userData?._id) {
                showWarningLogin();
              } else {
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
              }
            }}
          >
            <Text style={styles.txtFollow}>
              {userData?._id === id
                ? item.match_status === 1
                  ? translations.message
                  : translations.follow
                : item?.didFollow
                ? translations.unfollow
                : translations.follow}
            </Text>
          </TouchableOpacity>
          {userData?._id === id && item?.match_status != 1 ? (
            <TouchableOpacity
              onPress={() => {
                showModalHozi(item?.partner_id?._id);
              }}
              style={styles.viewMore}
            >
              <Icon
                style={styles.iconMore}
                name="ellipsis-horizontal-outline"
                type={IconType.Ionicons}
              ></Icon>
            </TouchableOpacity>
          ) : null}
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
  },
  viewInfo: {
    ...CS.flex1,
    ...CS.row,
  },
  btnFollow: {
    backgroundColor: palette.btnRedPrimary,
    borderRadius: 4,
  },
  txtFollow: {
    ...CS.hnRegular,
    marginHorizontal: 8,
    marginVertical: 4,
    color: palette.white,
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
  viewMore: {
    paddingRight: 5,
    marginLeft: 2,
  },
  iconMore: {
    height: 16,
    width: 19,
  },
});
export default Follower;
