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
// import HomeScreen from "@screens/home/home.screen";
import { _getJson } from "@services/local-storage";
import SettingProfileScreen from "@screens/profile.screen/profile.screen";
import TextBase from "@shared-components/TextBase";
import { translations } from "@localization";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import IconSvg from "assets/svg";
import {
  ClubStackData,
  CommonStackData,
  DiscoveryStackData,
  PracticeTestData,
  StackIntroData,
} from "./navigation.constant";
import analytics from "@react-native-firebase/analytics";
import { navigate } from "@helpers/navigation.helper";
import eventEmitter from "@services/event-emitter";
import NewHomeScreen from "@screens/home/new.screen.home";
import MentorListScreen from "@screens/tutor-tab/tutor.list.screen";
import StatisticsScreen from "@screens/statistics/StatisticsScreen";
import HealthScreen from "@screens/health/HealthScreen";

// import AudioPlayScreen from "@screens/audio/audio-play/audio.play.screen";
// ? If you want to use stack or tab or both
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const DiscoverStack = createStackNavigator();
// const ClubStack = createStackNavigator();
const HomeStack = createStackNavigator();
const CourseStack = createStackNavigator();
const StatisticsStack = createStackNavigator();
const HealthStack = createStackNavigator();

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
      case SCREENS.HOME_TAB:
        iconName = focused ? "icHome" : "icHome";
        break;
      case SCREENS.STATISTICS_TAB:
        iconName = focused ? "icPoints" : "icPoints";
        break;
      case SCREENS.HEALTH_TAB:
        iconName = focused ? "icHeart" : "icHeart";
        break;
      case SCREENS.SETTINGPROFILESCREEN_TAB:
        iconName = focused ? "icProfile" : "icProfile";
        break;
      case SCREENS.COURSE_TAB:
        iconName = focused ? "icCourse" : "icCourse";
        break;
      case SCREENS.MENTOR_TAB:
        iconName = focused ? "icGraduate" : "icGraduate";
        break;
      case SCREENS.CHAT:
        iconName = focused ? "icChat" : "icChat";
        break;
      case SCREENS.NOTIFICATION:
        iconName = focused ? "bell" : "bell";
        break;
      case SCREENS.SETTING:
        iconName = focused ? "settings" : "settings";
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
      case SCREENS.HOME_TAB:
        label = translations.homes;
        break;
      case SCREENS.STATISTICS_TAB:
        label = translations.statistics.title;
        break;
      case SCREENS.HEALTH_TAB:
        label = translations.health.title;
        break;
      case SCREENS.SETTINGPROFILESCREEN_TAB:
        label = translations.profile.profile;
        break;
      case SCREENS.COURSE_TAB:
        label = translations.courses;
        break;
      case SCREENS.MENTOR_TAB:
        label = translations.course.teacher;
        break;
      case SCREENS.CHAT:
        label = translations.chats;
        break;
      case SCREENS.NOTIFICATION:
        label = translations.notifications.notifications;
        break;
      case SCREENS.SETTING:
        label = translations.setting;
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
              // height: getBottomSpace() + 48,
              marginTop: 4,
            },
            // tabBarButton: (props) => (
            //   <TouchableOpacity
            //     {...props}
            //     onPress={() => {
            //       navigate(route.name);
            //       if (
            //         route.name == "HomeTab" &&
            //         props.accessibilityState.selected
            //       ) {
            //         eventEmitter.emit("reload_home_page");
            //       }
            //     }}
            //   />
            // ),
          })}
        >
          <Tab.Screen
            name={SCREENS.HOME_TAB}
            component={HomeStackScreen}
            listeners={{
              tabPress: () => {
                navigate(SCREENS.HOME_TAB);
                eventEmitter.emit("reload_home_page");
                eventEmitter.emit("scroll_home_to_top");
              },
            }}
          />
          <Tab.Screen
            name={SCREENS.STATISTICS_TAB}
            component={StatisticsStackScreen}
          />
          <Tab.Screen name={SCREENS.HEALTH_TAB} component={HealthStackScreen} />
          <Tab.Screen
            name={SCREENS.SETTINGPROFILESCREEN_TAB}
            component={SettingProfileScreen}
            listeners={{
              tabPress: () => {
                eventEmitter.emit("reload_list_task");
              },
            }}
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
          <Stack.Screen
            key={item.name}
            name={item.name}
            component={item.screen}
          />
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
        {/* {renderCommonStack()} */}
      </DiscoverStack.Navigator>
    );
  };

  // const ClubStackScreen = () => {
  //   return (
  //     <ClubStack.Navigator screenOptions={{ headerShown: false }}>
  //       {ClubStackData.map((item) => (
  //         <Stack.Screen
  //           key={item.name}
  //           name={item.name}
  //           component={item.screen}
  //         />
  //       ))}
  //       {/* {renderCommonStack()} */}
  //     </ClubStack.Navigator>
  //   );
  // };

  const CourseStackScreen = () => {
    return (
      <CourseStack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREENS.COURSE_LIST} component={CourseListScreen} />
        {/* {renderCommonStack()} */}
      </CourseStack.Navigator>
    );
  };
  const MentorStackScreen = () => {
    return (
      <CourseStack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREENS.MENTOR_LIST} component={MentorListScreen} />
        {/* {renderCommonStack()} */}
      </CourseStack.Navigator>
    );
  };

  const HomeStackScreen = () => {
    return (
      <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREENS.HOME} component={NewHomeScreen} />
        {/* {renderCommonStack()} */}
      </HomeStack.Navigator>
    );
  };

  const StatisticsStackScreen = () => {
    return (
      <StatisticsStack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREENS.STATISTICS} component={StatisticsScreen} />
      </StatisticsStack.Navigator>
    );
  };

  const HealthStackScreen = () => {
    return (
      <HealthStack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREENS.HEALTH} component={HealthScreen} />
      </HealthStack.Navigator>
    );
  };

  const renderCommonStack = () => {
    return (
      <>
        {CommonStackData.map((item) => (
          <Stack.Screen
            key={item.name}
            name={item.name}
            component={item.screen}
          />
        ))}
        {renderPracticeTestStack()}
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
      onStateChange={async () => {
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        eventEmitter.emit("screen_active", { screen: currentRouteName });
        await analytics().logScreenView({
          screen_name: currentRouteName,
          screen_class: currentRouteName,
        });
        // Save the current route name for later comparison
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {renderStackIntro()}
        {/* <Stack.Screen name={SCREENS.VIEW_LIVE_STREAM} component={ViewStreamScreen} /> */}
        <Stack.Screen name={SCREENS.TABS} component={TabNavigation} />
        {renderCommonStack()}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default React.memo(Navigation);
