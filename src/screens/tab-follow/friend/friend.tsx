import React, { useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import moment from "moment";
import * as NavigationService from "react-navigation-helpers";

import { useListData } from "@helpers/hooks/useListData";
// import useStore from "@services/zustand/store";
import Avatar from "@shared-components/user/Avatar";
import { getListFriend } from "@services/api/chat.api";
import { TypedUser } from "models";
import { SCREENS } from "constants";
import LoadingList from "@shared-components/loading.list.component";
import eventEmitter from "@services/event-emitter";
import EmptyResultView from "@shared-components/empty.data.component";
import { translations } from "@localization";
import CS from "@theme/styles";
import { palette } from "@theme/themes";

const Friend = ({ id }: { id: string }) => {
  // const userData = useStore((state) => state.userData);
  const { listData, onEndReach, isLoading, _requestData } =
    useListData<TypedUser>({ limit: 10, user_id: id }, getListFriend);

  const navigateMess = (item: TypedUser) => {
    NavigationService.navigate(SCREENS.CHAT_ROOM, {
      partner_id: item?.partner_id._id,
      partner_name: item?.partner_id.display_name,
    });
  };

  const onRefresh = () => {
    _requestData(false);
  };

  useEffect(() => {
    eventEmitter.on("reloadTabFriendAndFollowing", onRefresh);
    eventEmitter.on("reloadTabFriendAndFollower", onRefresh);
    return () => {
      eventEmitter.off("reloadTabFriendAndFollowing", onRefresh);
      eventEmitter.off("reloadTabFriendAndFollower", onRefresh);
    };
  });

  const renderItemSelected = ({
    item,
    index,
  }: {
    item: TypedUser;
    index: number;
  }) => {
    return (
      <View key={index} style={styles.viewContainer}>
        <View style={styles.viewInfo}>
          <Avatar
            style={styles.avatar}
            sourceUri={{ uri: item.partner_id?.user_avatar_thumbnail }}
          />
          <View style={styles.viewTxt}>
            <Text style={styles.txtFullname}>
              {item.partner_id?.display_name}
            </Text>
            <Text style={styles.txtDes}>
              {moment(item.partner_id?.last_active).format("HH:mm DD/MM/YY")}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.btnFollow}
          onPress={() => {
            navigateMess(item);
          }}
        >
          <Text style={styles.txtFollow}>{translations.message}</Text>
        </TouchableOpacity>
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
        style={{ marginTop: 8 }}
        data={listData}
        renderItem={renderItemSelected}
        onEndReachedThreshold={0}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReached={onEndReach}
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
export default Friend;
