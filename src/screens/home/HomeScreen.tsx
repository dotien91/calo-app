import React, { useEffect } from "react";
import { View, useWindowDimensions, Text, Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import * as NavigationService from "react-navigation-helpers";
import lodash from "lodash";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import HeaderHome from "./components/header-home/HeaderHome";
import { getCurrentUser } from "@services/api/userApi";
import useStore from "@services/zustand/store";
import { SCREENS } from "constants";
import ListPost from "./ListPost";

import CommonStyle from "@theme/styles";

interface HomeScreenProps {}

const renderScene = SceneMap({
  first: () => <ListPost isFollowingPost={true} />,
  second: ListPost,
});

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const setUserData = useStore((state) => state.setUserData);
  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    getCurrentUser().then((res) => {
      console.log("res...", res);
      if (!res.isError && !lodash.isEmpty(res)) {
        setUserData(res);
      }
    });
  }, [setUserData]);

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Following" },
    { key: "second", title: "For you " },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.primary,
        width: 50,
        left: "18%",
      }}
      renderLabel={({ route, focused }) => (
        <Text
          style={{
            ...CommonStyle.hnBold,
            fontSize: 16,
            color: focused ? colors.primary : colors.text,
            margin: 8,
          }}
        >
          {route.title}
        </Text>
      )}
      style={{ backgroundColor: colors.background, height: 50 }}
    />
  );

  return (
    <View style={CommonStyle.safeAreaView}>
      <HeaderHome />
      <TabView
        style={CommonStyle.flex1}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
      <Pressable
        style={{
          position: "absolute",
          width: 50,
          height: 50,
          backgroundColor: colors.primary,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 25,
          bottom: 10,
          right: 10,
          zIndex: 1,
        }}
        onPress={() => NavigationService.push(SCREENS.POST_SCREEN)}
      >
        <Icon
          name={"add-outline"}
          type={IconType.Ionicons}
          size={30}
          color={colors.white}
        />
      </Pressable>
    </View>
  );
};

export default HomeScreen;
