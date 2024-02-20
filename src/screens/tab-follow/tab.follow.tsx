import React from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";

import Header from "@shared-components/header/Header";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import CS from "@theme/styles";
import Friend from "./friend/friend";
import Follower from "./follower/follower";
import Following from "./following/following";

const TabFollow = () => {
  const theme = useTheme();
  const { colors } = theme;
  const route = useRoute();
  // const styles = useMemo(() => createStyles(theme), [theme]);
  const [index, setIndex] = React.useState(route?.params?.relationship);
  const layout = useWindowDimensions();
  const [routes] = React.useState([
    { key: "first", title: "Follower" },
    { key: "second", title: "Following" },
    { key: "third", title: "Friend" },
  ]);

  const renderScene = SceneMap({
    first: Follower,
    second: Following,
    third: Friend,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.primary,
        width: layout.width / 3,
        left: 0,
      }}
      renderLabel={({ route, focused }) => (
        <Text
          style={{
            ...CS.hnBold,
            fontSize: 16,
            color: focused ? colors.primary : colors.text,
            margin: 8,
          }}
        >
          {route.title}
        </Text>
      )}
      style={{ backgroundColor: colors.background }}
    />
  );

  return (
    <View style={{ ...CS.safeAreaView }}>
      <Header text="ielts" />
      <TabView
        style={{ flex: 1 }}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
};
export default TabFollow;
