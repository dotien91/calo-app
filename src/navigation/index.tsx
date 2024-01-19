import React from "react";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
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
import HomeScreen from "@screens/home/home.screen";
import DetailScreen from "@screens/detail/DetailScreen";
import ProfileScreen from "@screens/profile/ProfileScreen";
import NotificationScreen from "@screens/notification/NotificationScreen";
import useStore from "@services/zustand/store";
import IntroScreen from "@screens/welcome/intro/intro.screen";
import ChooseLanguageScreen from "@screens/welcome/choose-language/choose.language.screen";
import WelcomeScreen from "@screens/welcome/welcome.screen";
import LoginScreen from "@screens/auth/login/login.screen";
import LoginWithEmailScreen from "@screens/auth/login/login.with.email.screen";
import SignUpScreen from "@screens/auth/sign-up/signup.screen";
import ForgotPasswordScreen from "@screens/auth/forgot-password/forgot.password.screen";
import NewPasswordScreen from "@screens/auth/forgot-password/create.new.password";
import VerifyCodeScreen from "@screens/auth/forgot-password/VerifyCodeScreen";
import ListChatScreen from "@screens/chat/list-chat/chat.list.screen";
import SearchRoomChatScreen from "@screens/chat/search-room/search.room.view";
import ChatRoomScreen from "@screens/chat/room-chat/chat.room.screen";
import LiveStreamScreen from "@screens/stream/stream.screen";
import ViewStreamScreen from "@screens/stream/stream.view.screen";
import SettingScreen from "@screens/setting/SettingScreen";
import PostScreen from "@screens/post/create.post.screen";
import PostDetailScreen from "@screens/post/post.detail.screen";
import EditCommentScreen from "@screens/home/edit-comment/edit.comment.screen";
import SearchPostScreen from "@screens/search/search.post.screen";
import ProfileChatScreen from "@screens/chat/profile-chat/chat.profile.screen";
import CreateGroupChatScreen from "@screens/chat/create-group-chat/create.group.chat.screen";
import MediaChatScreen from "@screens/chat/profile-chat/chat.media.screen";
import AddUserGroupChatScreen from "@screens/chat/add-user-to-group-chat/add.user.group.chat.screen";
import ProfileUserScreen from "@screens/profile-user/profile.screen";
import EditProfileScreen from "@screens/profile-user/edit-profile/edit.profile.screen";

// ? If you want to use stack or tab or both
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Navigation = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const isFirstOpenApp = useStore((state) => state.isFirstOpenApp);

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
        iconName = focused ? "home" : "home";
        break;
      case SCREENS.CHAT:
        iconName = focused ? "message-square" : "message-square";
        break;
      case SCREENS.NOTIFICATION:
        iconName = focused ? "bell" : "bell";
        break;
      case SCREENS.PROFILE:
        iconName = focused ? "user" : "user";
        break;
      case SCREENS.SETTING:
        iconName = focused ? "settings" : "settings";
        break;
      default:
        iconName = focused ? "home" : "home";
        break;
    }
    return (
      <Icon name={iconName} type={IconType.Feather} size={size} color={color} />
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
        <Tab.Screen name={SCREENS.CHAT} component={ListChatScreen} />
        <Tab.Screen
          name={SCREENS.NOTIFICATION}
          component={NotificationScreen}
        />
        <Tab.Screen name={SCREENS.PROFILE} component={ProfileScreen} />
        <Tab.Screen name={SCREENS.SETTING} component={SettingScreen} />
      </Tab.Navigator>
    );
  };

  const renderStackIntro = () => {
    if (!isFirstOpenApp) return null;
    return (
      <>
        <Stack.Screen name={SCREENS.INTRO} component={IntroScreen} />

        <Stack.Screen
          name={SCREENS.CHOOSE_LANGUAGE}
          component={ChooseLanguageScreen}
        />
        <Stack.Screen name={SCREENS.WELCOME} component={WelcomeScreen} />
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
        <Stack.Screen name={SCREENS.HOME} component={renderTabNavigation} />
        <Stack.Screen
          name={SCREENS.PROFILE_CHAT}
          component={ProfileChatScreen}
        />
        <Stack.Screen
          name={SCREENS.ADD_USER_TO_GROUP}
          component={AddUserGroupChatScreen}
        />
        <Stack.Screen
          name={SCREENS.MEDIA_CHAT_SCREEN}
          component={MediaChatScreen}
        />
        <Stack.Screen
          name={SCREENS.CREATE_GROUP_CHAT}
          component={CreateGroupChatScreen}
        />
        <Stack.Screen
          name={SCREENS.VIEW_LIVE_STREAM}
          component={ViewStreamScreen}
        />
        <Stack.Screen name={SCREENS.LIVE_STREAM} component={LiveStreamScreen} />
        <Stack.Screen name={SCREENS.DETAIL}>
          {(props) => <DetailScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name={SCREENS.LOGIN_PAGE} component={LoginScreen} />
        <Stack.Screen name={SCREENS.POST_SCREEN} component={PostScreen} />
        <Stack.Screen name={SCREENS.POST_DETAIL} component={PostDetailScreen} />
        <Stack.Screen
          name={SCREENS.EDIT_COMMENT}
          component={EditCommentScreen}
        />
        <Stack.Screen
          name={SCREENS.PROFILE_CURRENT_USER}
          component={ProfileUserScreen}
        />
        <Stack.Screen
          name={SCREENS.SEARCH_CHAT}
          component={SearchRoomChatScreen}
        />
        <Stack.Screen
          name={SCREENS.EDIT_PROFILE}
          component={EditProfileScreen}
        />
        <Stack.Screen name={SCREENS.SEARCH} component={SearchPostScreen} />
        <Stack.Screen name={SCREENS.CHAT_ROOM} component={ChatRoomScreen} />
        <Stack.Screen
          name={SCREENS.LOGIN_WITH_EMAIL}
          component={LoginWithEmailScreen}
        />
        <Stack.Screen name={SCREENS.SIGN_UP} component={SignUpScreen} />
        <Stack.Screen
          name={SCREENS.FORGOT_PASSWORD}
          component={ForgotPasswordScreen}
        />
        <Stack.Screen name={SCREENS.VERIFY_CODE} component={VerifyCodeScreen} />
        <Stack.Screen
          name={SCREENS.NEW_PASSWORD}
          component={NewPasswordScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
