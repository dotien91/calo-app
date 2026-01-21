import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { isReadyRef, navigationRef } from "react-navigation-helpers";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

/**
 * ? Local & Shared Imports
 */
import { SCREENS } from "constants";
import { DarkTheme, LightTheme } from "@theme/themes";
// ? Screens
import useStore from "@services/zustand/store";
import SettingProfileScreen from "@screens/profile.screen/profile.screen";
import {
  OnboardingStackData,
  StackIntroData,
  CommonStackData, // <--- 1. Thêm import này
} from "./navigation.constant";
import PlanResultScreen from "@screens/welcome/onboarding/plan.result.screen";
import { navigate } from "@helpers/navigation.helper";
import eventEmitter from "@services/event-emitter";
import HomeScreen from "@screens/home/home.screen";
import StatisticsScreen from "@screens/statistics/StatisticsScreen";
import HealthScreen from "@screens/health/HealthScreen";
import { CustomTabBar } from "@shared-components/bottom-tab/CustomTabBar";

// ? If you want to use stack or tab or both
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
const StatisticsStack = createStackNavigator();
const HealthStack = createStackNavigator();

const Navigation = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  
  // Hardcode to always show onboarding flow or logic here
  const isFirstOpenApp = false; 

  React.useEffect((): any => {
    return () => (isReadyRef.current = false);
  }, []);

  const HomeStackScreen = () => {
    return (
      <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREENS.HOME} component={HomeScreen} />
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

  const TabNavigation = () => {
    return (
      <>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            // Quan trọng: Đặt background tab bar trong suốt để thấy nút nổi
            tabBarStyle: {
              position: "absolute",
              backgroundColor: "transparent",
              elevation: 0,
              borderTopWidth: 0,
            },
          }}
          // Truyền CustomTabBar vào props tabBar
          tabBar={(props: any) => <CustomTabBar {...props} />}
        >
          {/* Thứ tự khai báo Tab rất quan trọng để chia đều 2 bên nút FAB */}
          {/* 2 Tab Bên Trái */}
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

          {/* 2 Tab Bên Phải */}
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

  const renderOnboardingStack = () => {
    return (
      <>
        {OnboardingStackData.map((item) => (
          <Stack.Screen
            key={item.name}
            name={item.name}
            component={item.screen}
          />
        ))}
        <Stack.Screen name={SCREENS.PLAN_RESULT} component={PlanResultScreen} />
      </>
    );
  };

  // <--- 2. Thêm hàm render cho Common Stack (Chat, Setting, Detail...)
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
      }}
    >
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName={isFirstOpenApp ? SCREENS.ONBOARDING : SCREENS.TABS}
      >
        {renderStackIntro()}
        {/* {renderOnboardingStack()} */}
        
        {/* Main Tab */}
        <Stack.Screen name={SCREENS.TABS} component={TabNavigation} />
        
        {/* <--- 3. Gọi hàm render Common Stack ở đây để các màn hình con nằm đè lên TabBar */}
        {renderCommonStack()}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default React.memo(Navigation);