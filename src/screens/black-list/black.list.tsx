import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Header from "@shared-components/header/Header";
import { getListBlock, postUnBlockUser } from "@services/api/user.api";
import { useListData } from "@helpers/hooks/useListData";
import { TypedUser } from "models";
import CS from "@theme/styles";
import Avatar from "@shared-components/user/Avatar";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import LoadingList from "@shared-components/loading.list.component";
import moment from "moment";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import EmptyResultView from "@shared-components/empty.data.component";

const BlackList = () => {
  const { listData, _requestData, isLoading, isFirstLoading } =
    useListData<TypedUser>({ limit: "5" }, getListBlock);

  const renderItemSelected = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    return (
      <View key={index} style={styles.viewItem}>
        <View key={index} style={styles.viewAvatar}>
          <Avatar
            style={styles.avatar}
            sourceUri={{ uri: item?.partner_id?.user_avatar }}
          />
        </View>
        <View style={styles.viewContent}>
          <View style={{ flexDirection: "column" }}>
            <Text numberOfLines={2} style={styles.txtDisplay}>
              {item?.partner_id?.display_name}
            </Text>
            <Text>{moment(item.createdAt).format("HH:mm")}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              showModalMoti(item?.partner_id?._id);
            }}
          >
            <Text style={styles.txtUnBlock}>UnBlock</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const showModalMoti = (partner_id: string) => {
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        title: "Bạn có muốn unblock",
        cb: () => unBlockUser(partner_id),
      },
    });
  };

  const unBlockUser = (partner_id: string) => {
    const data = {
      partner_id: partner_id,
    };
    postUnBlockUser(data).then((res) => {
      if (!res.isError) {
        _requestData(false);
        showToast({
          type: "success",
          message: "UnBlock thành công",
        });
      } else {
        showToast({
          type: "error",
          message: res.message,
        });
      }
    });
  };

  const renderEmpty = () => {
    return (
      <EmptyResultView title={translations.notFound} style={styles.viewEmpty} />
    );
  };

  return (
    <SafeAreaView style={{ ...CS.safeAreaView }}>
      <Header text={translations.settingUser.blackList}></Header>
      {isLoading && <LoadingList />}
      {!listData?.length && !isFirstLoading && !isLoading && renderEmpty()}
      <FlatList
        data={listData}
        renderItem={renderItemSelected}
        scrollEventThrottle={16}
        onEndReachedThreshold={0}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        // ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
};

export default BlackList;

const styles = StyleSheet.create({
  viewItem: {
    marginHorizontal: 16,
    ...CS.row,
  },
  viewAvatar: {
    ...CS.row,
    marginBottom: 8,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  txtDisplay: {
    ...CS.hnSemiBold,
    color: palette.text,
    maxWidth: 250,
  },
  viewContent: {
    ...CS.row,
    justifyContent: "space-between",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: palette.grey2,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  txtUnBlock: {
    fontWeight: "400",
    fontSize: 12,
    color: palette.textOpacity6,
    textDecorationLine: "underline",
  },
  viewEmpty: {
    height: 200,
    ...CS.center,
  },
});
