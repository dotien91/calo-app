import React, { useMemo, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  useWindowDimensions,
  SafeAreaView,
  Text,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import * as NavigationService from "react-navigation-helpers";
import RNBounceable from "@freakycoder/react-native-bounceable";
import lodash from "lodash";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import HeaderHome from "./components/header-home/HeaderHome";

/**
 * ? Local Imports
 */
import createStyles from "./HomeScreen.style";
import MockData from "./mock/MockData";
import CardItem from "./components/card-item/CardItem";
/**
 * ? Shared Imports
 */
import { getCurrentUser } from "@services/api/userApi";
import useStore from "@services/zustand/store";
import {
  SCREENS,
  IOS_CLIENT_ID_GOOGLE,
  WEB_CLIENT_ID_GOOGLE,
} from "@shared-constants";
import ListPost from "./ListPost";
import CommonStyle from "@theme/styles";

const profileURI =
  // eslint-disable-next-line max-len
  "https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80";

interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const setUserData = useStore((state) => state.setUserData);

  const handleItemPress = () => {
    NavigationService.push(SCREENS.DETAIL);
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    getCurrentUser().then((res) => {
      if (!res.isError && !lodash.isEmpty(res)) {
        setUserData(res);
      }
    });
  }, [setUserData]);

  const MenuButton = () => (
    <RNBounceable>
      <Icon
        name="menu"
        type={IconType.Ionicons}
        color={colors.iconBlack}
        size={30}
      />
    </RNBounceable>
  );

  const Header = () => (
    <View style={styles.header}>
      <MenuButton />
      <Image
        resizeMode="cover"
        source={{ uri: profileURI }}
        style={styles.profilePicImageStyle}
      />
    </View>
  );

  const List = () => (
    <View style={styles.listContainer}>
      <FlatList
        data={MockData}
        renderItem={({ item }) => (
          <CardItem data={item} onPress={handleItemPress} />
        )}
      />
    </View>
  );

  const loginGoogle = async () => {
    try {
      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID_GOOGLE,
        iosClientId: IOS_CLIENT_ID_GOOGLE,
        offlineAccess: true,
      });
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      console.log("=========token", idToken);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        //doToastError(trans("login_loginCanceled"));
      }
    }
  };

  const handleNewPost = () => {
    NavigationService.push(SCREENS.POST_SCREEN);
  };

  const Welcome = () => (
    <>
      <Text onPress={loginGoogle} h1 bold color={colors.text}>
        Hello Kuray
      </Text>
      <Text color={colors.placeholder}>Welcome Back</Text>
      <Text onPress={handleNewPost} color={colors.placeholder}>
        New post
      </Text>
    </>
  );

  const Content = () => (
    <View style={styles.contentContainer}>
      <Welcome />
      <List />
    </View>
  );

  const HomeOld = () => {
    return (
      <View style={styles.container}>
        <Header />
        <Content />
      </View>
    );
  };

  const renderScene = SceneMap({
    first: HomeOld,
    second: ListPost,
  });
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
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderHome />
      <TabView
        style={{ flex: 1 }}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
