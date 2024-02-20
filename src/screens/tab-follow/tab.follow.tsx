import React from "react";
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
import CommonStyle from "@theme/styles";
import useStore from "@services/zustand/store";

const TabFollow = () => {
  const theme = useTheme();
  const { colors } = theme;
  const route = useRoute();
  const userData = useStore((state) => state.userData);

  // const styles = useMemo(() => createStyles(theme), [theme]);
  const [index, setIndex] = React.useState(route?.params?.relationship);
  // const layout = useWindowDimensions();

  // const [routes] = React.useState([
  //   { key: "first", title: `Follower ${route?.params?.countFollow?.followers}` },
  //   { key: "second", title: `Following ${route?.params?.countFollow?.following}` },
  //   { key: "third", title: `Friend ${route?.params?.countFollow?.friends}` },
  // ]);

  // const FirstRoute = ;
  // const SecondRoute = ;
  // const ThirdRoute = ;

  // const renderScene = SceneMap({
  //   first: () => <Follower id={route?.params?.id} />,
  //   second: () => <Following id={route?.params?.id} />,
  //   third: () => <Friend id={route?.params?.id} />,
  // });

  // const renderTabBar = (props) => (
  //   <TabBar
  //     {...props}
  //     indicatorStyle={{
  //       backgroundColor: colors.primary,
  //       width: layout.width / 3,
  //       left: 0,
  //     }}
  //     renderLabel={({ route, focused }) => (
  //       <Text
  //         style={{
  //           ...CS.hnMedium,
  //           fontSize: 16,
  //           color: focused ? colors.primary : colors.textOpacity6,
  //           margin: 8,
  //         }}
  //       >
  //         {route.title}
  //       </Text>
  //     )}
  //     style={{ backgroundColor: colors.background }}
  //   />
  // );

  // const renderHeader = () => {
  //   return (
  //     <View>

  //     </View>
  //   );
  // };

  const renderTabBar = (props) => {
    return (
      <MaterialTabBar
        index={index}
        {...props}
        indicatorStyle={{
          backgroundColor: colors.primary,
        }}
        activeColor={colors.primary}
        labelStyle={{ ...CommonStyle.hnMedium }}
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
      <Tabs.Container initialTabName="Follow" renderTabBar={renderTabBar}>
        {userData?._id === route?.params?.id ? (
          <Tabs.Tab
            name={"Friend"}
            label={`Friend ${route?.params?.countFollow?.friends}`}
          >
            <Friend id={route?.params?.id}></Friend>
          </Tabs.Tab>
        ) : null}

        <Tabs.Tab
          name={"Follow"}
          label={`Follower ${route?.params?.countFollow?.followers}`}
        >
          <Follower id={route?.params?.id}></Follower>
        </Tabs.Tab>

        <Tabs.Tab
          name={"Following"}
          label={`Following ${route?.params?.countFollow?.following}`}
        >
          <Following id={route?.params?.id}></Following>
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
};
export default TabFollow;
