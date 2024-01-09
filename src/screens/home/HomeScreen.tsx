import React, { useMemo, useEffect } from "react";
import { View, FlatList, Image, Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local Imports
 */
import createStyles from "./HomeScreen.style";
import MockData from "./mock/MockData";
import CardItem from "./components/card-item/CardItem";
/**
 * ? Shared Imports
 */
import Text from "@shared-components/text-wrapper/TextWrapper";
import { SCREENS } from "@shared-constants";
import { useUserHook } from "@helpers/hooks/useUserHook";

const profileURI =
  // eslint-disable-next-line max-len
  "https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80";

interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { isLoggedIn } = useUserHook();

  const handleItemPress = () => {
    NavigationService.push(SCREENS.DETAIL);
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    // setTimeout(() => {
    //   NavigationService.navigate(SCREENS.LOGIN_PAGE);
    // }, 100)
  }, []);

  const openLoginPage = () => {
    NavigationService.push(SCREENS.LOGIN_PAGE);
  };

  const MenuButton = () => (
    <Pressable onPress={openLoginPage}>
      <Icon
        name="menu"
        type={IconType.Ionicons}
        color={colors.iconBlack}
        size={30}
      />
    </Pressable>
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

  const viewLive = () => {
    NavigationService.push(SCREENS.VIEW_LIVE_STREAM, {
      liveStreamId: "6597cebd91125b0304b80819",
    });
  };

  const startLive = () => {
    NavigationService.push(SCREENS.LIVE_STREAM);
  };

  const Welcome = () => (
    <>
      <Text h1 bold color={colors.text}>
        Hello Kuray
      </Text>
      <Text color={colors.placeholder}>Welcome Back</Text>
      <Text onPress={viewLive} color={colors.placeholder}>
        view livestream tony vu
      </Text>
      <Text onPress={startLive} color={colors.placeholder}>
        start livestream
      </Text>
    </>
  );

  const goToLogin = () => {
    NavigationService.navigate(SCREENS.LOGIN_PAGE);
  };

  const Content = () => (
    <View style={styles.contentContainer}>
      {isLoggedIn() ? <Welcome /> : <Text onPress={goToLogin}>login</Text>}
      <List />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Content />
    </SafeAreaView>
  );
};

export default HomeScreen;
