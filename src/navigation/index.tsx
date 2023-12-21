import React from "react";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { isReadyRef, navigationRef } from "react-navigation-helpers";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
/**
 * ? Local & Shared Imports
 */
import { SCREENS } from "@shared-constants";
import { DarkTheme, LightTheme, palette } from "@theme/themes";
// ? Screens
import HomeScreen from "@screens/home/HomeScreen";
import SearchScreen from "@screens/search/SearchScreen";
import DetailScreen from "@screens/detail/DetailScreen";
import ProfileScreen from "@screens/profile/ProfileScreen";
import NotificationScreen from "@screens/notification/NotificationScreen";
import SettingScreenStyle from "@screens/setting/SettingScreen";
import useStore from "@services/zustand/store";
import IntroScreen from "@screens/login/intro/IntroScreen";
import ChooseLanguageScreen from "@screens/login/chooselanguage/ChooseLanguageScreen";
import WelcomeScreen from "@screens/login/welcome/WelcomeScreen";
import LoginScreen from "@screens/login/loginscreen/LoginScreen";
import LoginWithEmailScreen from "@screens/login/loginwithemail/LoginWithEmailScreen";
import SignUpScreen from "@screens/login/signup/SignUpScreen";
import ForgotPasswordScreen from "@screens/login/forgotpassword/ForgotPasswordScreen";
import NewPasswordScreen from "@screens/login/createnewpassword/CreateNewPassword";

// ? If you want to use stack or tab or both
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Navigation = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);

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
      case SCREENS.HOME:
        iconName = focused ? "home" : "home-outline";
        break;
      case SCREENS.SEARCH:
        iconName = focused ? "search" : "search-outline";
        break;
      case SCREENS.NOTIFICATION:
        iconName = focused ? "notifications" : "notifications-outline";
        break;
      case SCREENS.PROFILE:
        iconName = focused ? "person" : "person-outline";
        break;
      default:
        iconName = focused ? "home" : "home-outline";
        break;
    }
    return (
      <Icon
        name={iconName}
        type={IconType.Ionicons}
        size={size}
        color={color}
      />
    );
  };

  const renderTabNavigation = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) =>
            renderTabIcon(route, focused, color, size),
          tabBarActiveTintColor: palette.primary,
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: isDarkMode ? palette.black : palette.white,
          },
        })}
      >
        <Tab.Screen name={SCREENS.HOME} component={HomeScreen} />
        <Tab.Screen name={SCREENS.SEARCH} component={SearchScreen} />
        <Tab.Screen
          name={SCREENS.NOTIFICATION}
          component={NotificationScreen}
        />
        <Tab.Screen name={SCREENS.PROFILE} component={ProfileScreen} />
        <Tab.Screen name={SCREENS.SETTING} component={SettingScreenStyle} />
      </Tab.Navigator>
    );
  };

  const renderStackLogin = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREENS.LOGININTRO} component={IntroScreen} />
        <Stack.Screen
          name={SCREENS.FORGOTPASSWORD}
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name={SCREENS.NEWPASSWORD}
          component={NewPasswordScreen}
        />
        <Stack.Screen
          name={SCREENS.LOGINCHOOSELANGUAGE}
          component={ChooseLanguageScreen}
        />
        <Stack.Screen name={SCREENS.LOGINWELCOME} component={WelcomeScreen} />
        <Stack.Screen name={SCREENS.LOGINPAGE} component={LoginScreen} />
        <Stack.Screen
          name={SCREENS.LOGINWITHEMAIL}
          component={LoginWithEmailScreen}
        />
        <Stack.Screen name={SCREENS.SIGNUP} component={SignUpScreen} />
      </Stack.Navigator>
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
        <Stack.Screen name={SCREENS.LOGIN} component={renderStackLogin} />
        <Stack.Screen name={SCREENS.HOME} component={renderTabNavigation} />
        <Stack.Screen name={SCREENS.DETAIL}>
          {(props) => <DetailScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
