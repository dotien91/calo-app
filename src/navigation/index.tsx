import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { isReadyRef, navigationRef } from "react-navigation-helpers";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
/**
 * ? Local & Shared Imports
 */
import { SCREENS } from "constants";
import { DarkTheme, LightTheme, palette } from "@theme/themes";
// ? Screens
import useStore from "@services/zustand/store";
import CourseListScreen from "@screens/course-tab/course-list/course.list.screen";
import HomeScreen from "@screens/home/home.screen";
import { _getJson } from "@services/local-storage";
import SettingProfileScreen from "@screens/profile.screen/profile.screen";
import TextBase from "@shared-components/TextBase";
import { translations } from "@localization";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import IconSvg from "assets/svg";
import { FloatingPlayer } from "@screens/audio/components/FloatingPlayer";
import {
  BankStackData,
  ClubStackData,
  CommonStackData,
  DiscoveryStackData,
  PracticeTestData,
  StackIntroData,
} from "./navigation.constant";
// import AudioPlayScreen from "@screens/audio/audio-play/audio.play.screen";
// ? If you want to use stack or tab or both
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Navigation = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  // const isFirstOpenApp = useStore((state) => state.isFirstOpenApp);
  const isFirstOpenApp = _getJson("is_first_open_app") == null ? true : false;
  React.useEffect((): any => {
    return () => (isReadyRef.current = false);
  }, []);

  const renderTabIcon = (
    route: any,
    focused: boolean,
    color: string,
    size: number,
  ) => {
    let iconName = "home";
    switch (route.name) {
      case SCREENS.COURSE_TAB:
        iconName = focused ? "icCourse" : "icCourse";
        break;
      // case SCREENS.CHAT:
      //   iconName = focused ? "icCoach" : "icCoachBlur";
      //   break;
      case SCREENS.NOTIFICATION:
        iconName = focused ? "bell" : "bell";
        break;
      case SCREENS.SETTINGPROFILESCREEN_TAB:
        iconName = focused ? "icProfile" : "icProfile";
        break;
      case SCREENS.SETTING:
        iconName = focused ? "settings" : "settings";
        break;
      case SCREENS.DISCOVERSCREEN_TAB:
        iconName = focused ? "icDiscovery" : "icDiscovery";
        break;
      case SCREENS.CLUB_TAB:
        iconName = focused ? "icCoach" : "icCoachBlur";
        break;
      default:
        iconName = focused ? "icHome" : "icHome";
        break;
    }
    return iconName != "earth" ? (
      <IconSvg name={iconName} size={size} color={color} />
    ) : (
      <IconSvg name={iconName} size={size} color={color} />
    );
  };
  const renderLable = (route: any, color: any) => {
    let label = translations.homes;
    switch (route.name) {
      case SCREENS.COURSE_TAB:
        label = translations.courses;
        break;
      case SCREENS.CHAT:
        label = translations.chats;
        break;
      case SCREENS.NOTIFICATION:
        label = translations.notifications.notifications;
        break;
      case SCREENS.SETTINGPROFILESCREEN_TAB:
        label = translations.profile.profile;
        break;
      case SCREENS.DISCOVERSCREEN_TAB:
        label = translations.discovers;
        break;
      case SCREENS.SETTING:
        label = translations.setting;
        break;
      case SCREENS.CLUB_TAB:
        label = translations.club.club;
        break;
      default:
        label = translations.homes;
        break;
    }
    return (
      <TextBase fontSize={12} style={{ color: color }}>
        {label}
      </TextBase>
    );
  };

  const DiscoverStack = createStackNavigator();
  const ClubStack = createStackNavigator();
  const HomeStack = createStackNavigator();
  const CourseStack = createStackNavigator();

  const TabNavigation = () => {
    return (
      <>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarLabel: ({ color }) => renderLable(route, color),
            tabBarIcon: ({ focused, color }) =>
              renderTabIcon(route, focused, color, 24),
            tabBarActiveTintColor: palette.primary,
            tabBarInactiveTintColor: "gray",
            tabBarStyle: {
              borderTopColor: palette.borderColor,
              backgroundColor: isDarkMode ? palette.black : palette.white,
              height: getBottomSpace() + 48,
              marginTop: 4,
            },
          })}
        >
          <Tab.Screen name={SCREENS.HOME_TAB} component={HomeStackScreen} />
          <Tab.Screen name={SCREENS.COURSE_TAB} component={CourseStackScreen} />
          <Tab.Screen name={SCREENS.CLUB_TAB} component={ClubStackScreen} />
          <Tab.Screen
            name={SCREENS.DISCOVERSCREEN_TAB}
            component={DiscoveryStackScreen}
          />

          <Tab.Screen
            name={SCREENS.SETTINGPROFILESCREEN_TAB}
            component={SettingProfileScreen}
          />
        </Tab.Navigator>
      </>
    );
  };

  const renderStackIntro = () => {
    if (!isFirstOpenApp) return null;
    return (
      <>
        {StackIntroData.map((item) => (
          <Stack.Screen key={item.name} name={item.name} component={item.screen} />
        ))}
      </>
    );
  };

  const renderBanksStack = () => {
    return (
      <>
        {BankStackData.map((item) => (
          <Stack.Screen name={item.name} component={item.screen} />
        ))}
      </>
    );
  };

  const renderPracticeTestStack = () => {
    return (
      <>
        {PracticeTestData.map((item) => (
          <Stack.Screen
            name={item.name}
            component={item.screen}
            key={item.name}
          />
        ))}
      </>
    );
  };

  const DiscoveryStackScreen = () => {
    return (
      <DiscoverStack.Navigator screenOptions={{ headerShown: false }}>
        {DiscoveryStackData.map((item) => (
          <Stack.Screen
            key={item.name}
            name={item.name}
            component={item.screen}
          />
        ))}
        {renderCommonStack()}
      </DiscoverStack.Navigator>
    );
  };

  const ClubStackScreen = () => {
    return (
      <ClubStack.Navigator screenOptions={{ headerShown: false }}>
        {ClubStackData.map((item) => (
          <Stack.Screen
            key={item.name}
            name={item.name}
            component={item.screen}
          />
        ))}
        {renderCommonStack()}
      </ClubStack.Navigator>
    );
  };

  const CourseStackScreen = () => {
    return (
      <CourseStack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREENS.COURSE_LIST} component={CourseListScreen} />
        {renderCommonStack()}
      </CourseStack.Navigator>
    );
  };

  const HomeStackScreen = () => {
    return (
      <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREENS.HOME} component={HomeScreen} />
        {renderCommonStack()}
      </HomeStack.Navigator>
    );
  };

  const renderCommonStack = () => {
    return (
      <>
        {CommonStackData.map((item) => (
          <Stack.Screen name={item.name} component={item.screen} />
        ))}
        {renderPracticeTestStack()}
        {renderBanksStack()}
      </>
    );
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      theme={isDarkMode ? DarkTheme : LightTheme}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {renderStackIntro()}
        <Stack.Screen name={SCREENS.TABS} component={TabNavigation} />
        {renderCommonStack()}
      </Stack.Navigator>
      <FloatingPlayer />
    </NavigationContainer>
  );
};

export default Navigation;
