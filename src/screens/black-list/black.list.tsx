import React from "react";
import { FlatList, Image, Text, View } from "react-native";

import Header from "@shared-components/header/Header";
import { getListBlock } from "@services/api/user.api";
import { useListData } from "@helpers/hooks/useListData";
import { TypedUser } from "models";
import { useTheme } from "@react-navigation/native";

const BlackList = () => {
  const theme = useTheme();
  const { colors } = theme;

  const { listData } = useListData<TypedUser>({ limit: "5" }, getListBlock);

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
          marginBottom: 8,
          alignItems: "center",
          marginHorizontal: 16,
        }}
      >
        <Image
          style={{ height: 50, width: 50 }}
          source={require("assets/images/admin.png")}
        ></Image>
        <Text
          style={{
            marginLeft: 8,
            fontSize: 16,
            fontWeight: "600",
            color: colors.text,
          }}
        >
          {item.display_name}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header text="Danh sach den"></Header>
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
