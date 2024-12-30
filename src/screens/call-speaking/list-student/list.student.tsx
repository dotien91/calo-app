import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ItemStudent from "./item.student";
import { useListData } from "@helpers/hooks/useListData";
import useStore from "@services/zustand/store";

const ListStudent = () => {
  // Lấy danh sách học sinh đăng kí thi trong ngày
  const userData = useStore((state) => state.userData);

  const renderItem = ({ item }) => {
    return <ItemStudent item={item} />;
  };
  const { listData, isLoading, onEndReach, renderFooterComponent } =
    useListData(
      {
        auth_id: userData?._id,
        order_by: "DESC",
        sort_by: "createdAt",
        limit: "10",
      },
      GetListStudent,
    );

  return (
    <View>
      <FlatList
        data={listData}
        renderItem={renderItem}
        onEndReached={onEndReach}
        renderFooterComponent={renderFooterComponent()}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default ListStudent;
