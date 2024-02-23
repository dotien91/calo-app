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
import DetailScreen from "@screens/detail/DetailScreen";
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
import SettingScreen from "@screens/setting/setting.screen";
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
import CourseListScreen from "@screens/course-tab/course-list/course.list.screen";
import CourseSearchScreen from "@screens/course-tab/course-search/course.search.screen";
import CourseFilterResultScreen from "@screens/course-tab/course-filter-result/course.filter.result.screen";
import BookLessonScreen from "@screens/purchase-course/book-lesson/book.lesson.screen";
import ChooseClassScreen from "@screens/purchase-course/choose-class/choose.class.screen";
import PaymentCoures from "@screens/checkout/checkout.screen";
import CoursePreviewScreen from "@screens/course/course-preview/course.preview.screen";
import DetailTeacherScreen from "@screens/course/detail-teacher/detail.teacher.screen";
import CourseRate from "@screens/course/course-rate/course.rate.screen";
import ReviewScreen from "@screens/course/course-preview/review.screen";
import HomeScreen from "@screens/home/home.screen";
// import CourseCategoryDetailScreen from "@screens/course-list/course-filter-result/course.filter.result.screen";
import AboutMe from "@screens/about-me/about.me";
import SettingUser from "@screens/setting-user/setting.user";
import ChangeLanguage from "@screens/change-language/change.language";
import SmartBanking from "@screens/smart-banking/smart.banking";
import PaymentSuccess from "@screens/payment-success/payment.success";
import CourseLearnScreen from "@screens/course/course-learn-video/course.learn.video.screen";
import InComingCall from "@screens/call/in.coming.call";
import CallPageScreen from "@screens/call/call.page.screen";
// import CourseCategoryDetailScreen from "@screens/course-list/course-filter-result/course.filter.result.screen";
// import PaymentCoures from "@screens/payment-coures/payment.coures";
// import CourseCategoryDetailScreen from "@screens/course-list/course-filter-result/course.filter.result.screen";
// import PaymentCoures from "@screens/payment-coures/payment.coures";
import MyCourse from "@screens/my-course/my.course";
import CourseCreateScreen from "@screens/course/course-create/course.create.screen";
import CourseCreateClassScreen from "@screens/course/course-create/course.create.class.screen";
import CourseListClassScreen from "@screens/course/course-create/course.list.class.screen";
import CreateClassCallOneScreen from "@screens/course/course-create/course.create.class.call.one.screen";
import CourseListVideoScreen from "@screens/course/course-create/course.list.video.screen";
import CourseAddModuleScreen from "@screens/course/course-create/course.add.module.screen";
import CallClassScreen from "@screens/call-class/call.class.screen";
import TabFollow from "@screens/tab-follow/tab.follow";
import BlackList from "@screens/black-list/black.list";
import PrivateSetting from "@screens/private.setting/private.setting";
import { _getJson } from "@services/local-storage";

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
      case SCREENS.COURSE_LIST:
        iconName = focused ? "book" : "book";
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
            borderTopColor: palette.borderColor,
            backgroundColor: isDarkMode ? palette.black : palette.white,
          },
        })}
      >
        <Tab.Screen name={SCREENS.HOME} component={HomeScreen} />
        <Tab.Screen name={SCREENS.COURSE_LIST} component={CourseListScreen} />

        <Tab.Screen name={SCREENS.CHAT} component={ListChatScreen} />
        {/* <Tab.Screen
          name={SCREENS.NOTIFICATION}
          component={NotificationScreen}
        /> */}
        <Tab.Screen name={SCREENS.PROFILE} component={SettingScreen} />
        {/* <Tab.Screen name={SCREENS.SETTING} component={SettingScreen} /> */}
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

        <Stack.Screen
          name={SCREENS.COURSE_LIST}
          component={renderTabNavigation}
        />
        <Stack.Screen name={SCREENS.CALL_CLASS} component={CallClassScreen} />

        <Stack.Screen name={SCREENS.MY_COURES} component={MyCourse} />

        <Stack.Screen
          name={SCREENS.COURSE_CREATE}
          component={CourseCreateScreen}
        />
        <Stack.Screen
          name={SCREENS.COURSE_LIST_MODULE}
          component={CourseListVideoScreen}
        />
        <Stack.Screen
          name={SCREENS.COURSE_ADD_MODULE}
          component={CourseAddModuleScreen}
        />
        <Stack.Screen
          name={SCREENS.COURSE_CREATE_CALENDAR_CALL}
          component={CreateClassCallOneScreen}
        />
        <Stack.Screen
          name={SCREENS.COURSE_LIST_CLASS}
          component={CourseListClassScreen}
        />
        <Stack.Screen
          name={SCREENS.COURSE_CREATE_CLASS}
          component={CourseCreateClassScreen}
        />
        <Stack.Screen
          name={SCREENS.CHOOSE_CLASS}
          component={ChooseClassScreen}
        />
        <Stack.Screen name={SCREENS.BOOK_LESSON} component={BookLessonScreen} />
        <Stack.Screen
          name={SCREENS.COURSE_CATEGORY}
          component={CourseFilterResultScreen}
        />
        <Stack.Screen
          name={SCREENS.COURSE_DETAIL}
          component={CoursePreviewScreen}
        />
        <Stack.Screen name={SCREENS.HOME} component={renderTabNavigation} />
        <Stack.Screen name={SCREENS.COURSE_RATE} component={CourseRate} />

        <Stack.Screen
          name={SCREENS.COURSE_SEARCH}
          component={CourseSearchScreen}
        />
        <Stack.Screen
          name={SCREENS.TEACHER_DETAIL}
          component={DetailTeacherScreen}
        />
        <Stack.Screen
          name={SCREENS.COURSE_LEARN_VIDEO_SCREEN}
          component={CourseLearnScreen}
        />
        <Stack.Screen
          name={SCREENS.COURSE_LIST_RATE}
          component={ReviewScreen}
        />

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
        <Stack.Screen name={SCREENS.PAYMENT_COURES} component={PaymentCoures} />
        <Stack.Screen name={SCREENS.ABOUT_ME} component={AboutMe} />
        <Stack.Screen name={SCREENS.SETTING_USER} component={SettingUser} />
        <Stack.Screen
          name={SCREENS.CHANGELANGUAGE}
          component={ChangeLanguage}
        />
        <Stack.Screen name={SCREENS.SMARTBANKING} component={SmartBanking} />
        <Stack.Screen name={SCREENS.CALL_PAGE} component={CallPageScreen} />
        <Stack.Screen name={SCREENS.IN_COMING_CALL} component={InComingCall} />
        <Stack.Screen
          name={SCREENS.PAYMENT_SUCCESS}
          component={PaymentSuccess}
        />
        <Stack.Screen name={SCREENS.TAB_FOLLOW} component={TabFollow} />
        <Stack.Screen name={SCREENS.BLACK_LIST} component={BlackList} />
        <Stack.Screen
          name={SCREENS.PRIVATESETTING}
          component={PrivateSetting}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
