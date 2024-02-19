import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

import Header from "@shared-components/header/Header";
import { getListBlock, postUnBlockUser } from "@services/api/user.api";
import { useListData } from "@helpers/hooks/useListData";
import { TypedUser } from "models";
import { useTheme } from "@react-navigation/native";
import CS from "@theme/styles";
import { _getJson } from "@services/local-storage";
import Avatar from "@shared-components/user/Avatar";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";

const BlackList = () => {
  const theme = useTheme();
  const { colors } = theme;
  const { listData, _requestData } = useListData<TypedUser>(
    { limit: "5" },
    getListBlock,
  );
  const renderItemSelected = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    return (
      <View
        key={index}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
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
            style={{ height: 50, width: 50, borderRadius: 25 }}
            sourceUri={{ uri: item?.partner_id?.user_avatar }}
          />
          <Text
            numberOfLines={2}
            style={{
              marginLeft: 8,
              fontSize: 16,
              fontWeight: "600",
              color: colors.text,
              maxWidth: 250,
            }}
          >
            {item?.partner_id?.display_name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            showModalMoti(item?.partner_id?._id);
          }}
        >
          <Text>UnBlock</Text>
        </TouchableOpacity>
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

  return (
    <View style={{ ...CS.safeAreaView }}>
      <Header text="Danh sách đen"></Header>
      {listData.length > 0 ? (
        <FlatList
          data={listData}
          renderItem={renderItemSelected}
          scrollEventThrottle={16}
          onEndReachedThreshold={0}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
        />
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            style={{ height: 152, width: 192, marginBottom: 50 }}
            source={require("assets/images/emptyIcon.png")}
          ></Image>
        </View>
      )}
    </View>
  );
};
export default BlackList;
