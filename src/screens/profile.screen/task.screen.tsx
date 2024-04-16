import React from "react";
import { FlatList, SafeAreaView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getBottomSpace } from "react-native-iphone-screen-helper";

import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import { getListTaskByUser } from "@services/api/task.api";
import { translations } from "@localization";
import TashListItem from "@shared-components/task-item/task.list.item";
import EmptyResultView from "@shared-components/empty.data.component";

const TaskScreen = () => {
  return (
    <SafeAreaView
      style={{ ...CS.safeAreaView, marginBottom: getBottomSpace() }}
    >
      <Header text={translations.task.missions} />
      <Tasks />
    </SafeAreaView>
  );
};

const Tasks = () => {
  const [listData, setListData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getTask();
    }, []),
  );

  const getTask = () => {
    setLoading(true)
    getListTaskByUser({ order_by: "DESC" }).then((res) => {
      setLoading(false)
      if (!res.isError) {
        setListData((res.data?.[0]?.missions || []).reverse());
      }
    });
  };
  const renderItem = (item, index) => {
    return <TashListItem key={index} item={item.item} />;
  };

  return (
    <>
      {!loading && !listData.length && <EmptyResultView
        desc={translations.emptyList}
        icon="document-text-outline"
        showLottie={false}
      />}
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
