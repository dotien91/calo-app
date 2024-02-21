import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";
import { Tabs, MaterialTabBar } from "react-native-collapsible-tab-view";

import Header from "@shared-components/header/Header";
// import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Friend from "./friend/friend";
import Follower from "./follower/follower";
import Following from "./following/following";
// import Icon, { IconType } from "react-native-dynamic-vector-icons";
// import Avatar from "@shared-components/user/Avatar";
import CS from "@theme/styles";
import useStore from "@services/zustand/store";
import { getCountFollow } from "@services/api/user.api";
import LoadingList from "@shared-components/loading.list.component";

const TabFollow = () => {
  const theme = useTheme();
  const { colors } = theme;
  const route = useRoute();
  const userData = useStore((state) => state.userData);

  // const styles = useMemo(() => createStyles(theme), [theme]);
  const index = React.useState(route?.params?.relationship);
  const [countFollow, setCountFollow] = useState<CountFolowType>({});
  const [isLoading, setisLoaing] = useState(true);

  const _getUserInfo = (id: string) => {
    getCountFollow({ user_id: id }).then((res) => {
      setCountFollow(res.data);
      setisLoaing(false);
    });
  };

  useEffect(() => {
    _getUserInfo(route?.params?.id);
  }, [countFollow]);

  const renderTabBar = (props) => {
    return (
      <MaterialTabBar
        index={index}
        {...props}
        indicatorStyle={{
          backgroundColor: colors.primary,
        }}
        activeColor={colors.primary}
        labelStyle={{ ...CS.hnMedium }}
        // inactiveColor={colors.black}
      />
    );
  };

  return (
    <View style={{ ...CS.safeAreaView }}>
      <Header text="ielts" />
      {/* <TabView
        style={{ flex: 1 }}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      /> */}
      {isLoading ? (
        <LoadingList></LoadingList>
      ) : (
        <Tabs.Container initialTabName="Follow" renderTabBar={renderTabBar}>
          {userData?._id === route?.params?.id ? (
            <Tabs.Tab name={"Friend"} label={`Friend ${countFollow?.friends}`}>
              <Friend id={route?.params?.id}></Friend>
            </Tabs.Tab>
          ) : null}

          <Tabs.Tab
            name={"Follow"}
            label={`Follower ${countFollow?.followers}`}
          >
            <Follower id={route?.params?.id}></Follower>
          </Tabs.Tab>

          <Tabs.Tab
            name={"Following"}
            label={`Following ${countFollow?.following}`}
          >
            <Following id={route?.params?.id}></Following>
          </Tabs.Tab>
        </Tabs.Container>
      )}
    </View>
  );
};
export default TabFollow;
