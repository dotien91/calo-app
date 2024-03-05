import React from "react";
import { FlatList, SafeAreaView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Header from "@shared-components/header/Header";
import TaskItemCommon from "@shared-components/task-item/task.item";
import { getListTaskByUser } from "@services/api/task.api";

const TaskScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header text="Missions" />
      <Tasks />
    </SafeAreaView>
  );
};

const Tasks = () => {
  const [listData, setListData] = React.useState([]);
  useFocusEffect(
    React.useCallback(() => {
      getTask();
    }, []),
  );

  const getTask = () => {
    getListTaskByUser({ order_by: "DESC" }).then((res) => {
      if (!res.isError) {
        setListData((res.data?.[0]?.missions || []).reverse());
      }
    });
  };
  const renderItem = (item, index) => {
    return <TaskItemCommon key={index} item={item.item}></TaskItemCommon>;
  };

  return (
    <>
      <FlatList
        data={listData}
        renderItem={renderItem}
        scrollEventThrottle={16}
        onEndReachedThreshold={0}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
      />
    </>
  );
};

export default TaskScreen;
