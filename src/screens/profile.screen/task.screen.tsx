import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, ScrollView, Text } from "react-native";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import { getListRedeemMissionTask, getListTask } from "@services/api/task.api";
import { translations } from "@localization";
import TashListItem from "@shared-components/task-item/task.list.item";
import EmptyResultView from "@shared-components/empty.data.component";
import { View } from "react-native-animatable";
import { palette } from "@theme/themes";
import LoadingItem from "@shared-components/loading.item";
import useStore from "@services/zustand/store";

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
  const initialLayout = { width: Dimensions.get("window").width };
  const userData = useStore((state) => state.userData);

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState<any[]>([]);
  const [scenes, setScenes] = useState({});

  const TabScreen = ({ item }) => {
    const [listData, setListData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const _getListRedeemMissionTask = () => {
      getListRedeemMissionTask({ redeem_id: item._id }).then((res) => {
        setIsLoading(false);
        if (!res.isError) {
          setListData((res.data || []).reverse());
        }
      });
    };
    useEffect(() => {
      _getListRedeemMissionTask();
    }, []);
    return (
      <View
        style={{
          backgroundColor: palette.backgroundColorGrey,
          borderRadius: 8,
          flex: 1,
        }}
      >
        <ScrollView style={{ flex: 1 }}>
          {listData.length > 0 ? (
            listData.map((item, index) => {
              return <TashListItem key={index} item={item} />;
            })
          ) : isLoading ? (
            <LoadingItem />
          ) : (
            <EmptyResultView title={translations.task.emptyTask} />
          )}
        </ScrollView>
      </View>
    );
  };

  // Fetch tabs from API
  useEffect(() => {
    getListTask({})
      .then((res) => {
        const data = res.data.filter(
          (item) => item.role === (userData?.user_role || "user"),
        );
        const formattedRoutes = data.map((item, idx) => ({
          key: `tab-${idx}`,
          title: item.title || "",
        }));

        const sceneMap = data.reduce((acc, item, idx) => {
          acc[`tab-${idx}`] = () => <TabScreen key={index} item={item} />;
          return acc;
        }, {});

        setScenes(sceneMap);
        setRoutes(formattedRoutes);
      })
      .catch((err) => console.error("Error fetching tabs:", err));
  }, []);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled
      tabStyle={{ width: "auto", paddingHorizontal: 16 }}
      indicatorStyle={{ backgroundColor: palette.primary, height: 3 }}
      style={{ backgroundColor: palette.background, height: 40 }} // 🔥 Giới hạn chiều cao TabBar
      labelStyle={{ color: palette.text, fontSize: 14 }}
      renderLabel={({ route, focused }) => (
        <Text
          style={{
            color: focused ? palette.primary : palette.text, // 🔥 Màu chữ đổi khi active
            fontWeight: focused ? "600" : "500",
            fontSize: 14,
          }}
        >
          {route.title}
        </Text>
      )}
    />
  );

  return routes.length > 0 ? (
    <TabView
      navigationState={{ index, routes }}
      renderScene={SceneMap(scenes)}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={renderTabBar}
    />
  ) : (
    <LoadingItem />
  );
};

export default TaskScreen;
