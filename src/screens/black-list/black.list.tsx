import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

import Header from "@shared-components/header/Header";
import { getListBlock, postUnBlockUser } from "@services/api/user.api";
import { useListData } from "@helpers/hooks/useListData";
import { TypedUser } from "models";
import { useTheme } from "@react-navigation/native";
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

const BlackList = () => {
  const theme = useTheme();
  const { colors } = theme;
  const { listData, _requestData, isLoading, isFirstLoading } =
    useListData<TypedUser>({ limit: "5" }, getListBlock);
  const renderItemSelected = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    console.log(JSON.stringify(item, null, 2));
    return (
      <View
        key={index}
        style={{
          flexDirection: "row",
          // justifyContent: "space-between",
          marginHorizontal: 16,
          alignItems: "center",
        }}
      >
        <View
          key={index}
          style={{
            flexDirection: "row",
            marginBottom: 8,
            alignItems: "center",
          }}
        >
          <Avatar
            style={{ height: 40, width: 40, borderRadius: 20 }}
            sourceUri={{ uri: item?.partner_id?.user_avatar }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 1,
            borderBottomWidth: 1,
            borderBottomColor: colors.grey2,
            alignItems: "center",
            paddingVertical: 8,
            marginHorizontal: 8,
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.text,
                maxWidth: 250,
              }}
            >
              {item?.partner_id?.display_name}
            </Text>
            <Text>{moment(item.createdAt).format("HH:mm")}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              showModalMoti(item?.partner_id?._id);
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.textOpacity6,
                fontWeight: "400",
                textDecorationLine: "underline",
              }}
            >
              UnBlock
            </Text>
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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          style={{ height: 152, width: 192, marginBottom: 50 }}
          source={require("assets/images/emptyIcon.png")}
        ></Image>
      </View>
    );
  };

  return (
    <View style={{ ...CS.safeAreaView }}>
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
    </View>
  );
};
export default BlackList;
