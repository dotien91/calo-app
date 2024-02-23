import React from "react";
import {
  View,
  useWindowDimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import * as NavigationService from "react-navigation-helpers";
import { SceneMap, TabBar } from "react-native-tab-view";
import { CollapsibleHeaderTabView } from "react-native-tab-view-collapsible-header";

import HeaderHome from "./components/header-home/HeaderHome";
import { SCREENS } from "constants";
import ListPost from "./list.post";

import CommonStyle from "@theme/styles";
import { useUserHook } from "@helpers/hooks/useUserHook";
import useStore from "@services/zustand/store";

interface HomeScreenProps {}

const renderScene = SceneMap({
  first: ListPost,
  second: () => <ListPost isFollowingPost={true} />,
});

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */

  const { isLoggedIn } = useUserHook();

  const layout = useWindowDimensions();
  const userData = useStore((state) => state.userData);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "For you" },
    { key: "second", title: "Following" },
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
      {/* <HeaderHome />
      <TabView
        style={CommonStyle.flex1}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      /> */}
      <CollapsibleHeaderTabView
        renderScrollHeader={HeaderHome}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
      {isLoggedIn() && userData?._id && (
        <TouchableOpacity
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
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeScreen;
