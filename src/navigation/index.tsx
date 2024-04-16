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
import ProfileUserScreen from "@screens/user-profile/user.profile.screen";
import EditProfileScreen from "@screens/user-profile/edit-profile/edit.profile.screen";
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
import ListCouponForMyCourse from "@screens/coupon/coupon.list";
import CouponCreateScreen from "@screens/coupon/coupon.create";
import TabFollow from "@screens/tab-follow/tab.follow";
import { _getJson } from "@services/local-storage";
import SettingProfileScreen from "@screens/profile.screen/profile.screen";
import ClassHomeWorkScreen from "@screens/class-home-work/class.home.work.screen";
import CreateWorkScreen from "@screens/class-home-work/create.work.screen";
import DetailTaskScreen from "@screens/class-home-work/detail.task.screen";
import AddWorkStudentScreen from "@screens/class-home-work/add.work.student.screen";
import ChatListScreen from "@screens/chat/list-chat/chat.list.screen";
import NotificationScreen from "@screens/notification/NotificationScreen";
import TaskScreen from "@screens/profile.screen/task.screen";
import TeacherCourse from "@screens/teacher-courses/teacher.course";
import LeaderBoard from "@screens/leader-board/leader.board";

import AffiliatePage from "@screens/affiliate/affiliate.screen";
import WithdrawScreen from "@screens/withdraw/withdraw.screen";
import BankListScreen from "@screens/withdraw/bank.list.screen";
import AddBankScreen from "@screens/withdraw/add.bank.screen";
// import TabFollow from "@screens/tab-follow/tab.follow";
import BlackList from "@screens/black-list/black.list";
// import PrivateSetting from "@screens/private.setting/private.setting";
// import { _getJson } from "@services/local-storage";
// import SettingProfileScreen from "@screens/profile.screen/profile.screen";
import CodeActivationsScreen from "@screens/code-activations/code.activations.screen";
import HiddenPaage from "@screens/hidden-page/hidden.page";
import IeltsPacticeScreen from "@screens/ielts-practice/ielts.practice.test.screen";
import IeltsReadingPacticeScreen from "@screens/ielts-practice/ielts.reading.practice.test.screen";
import PracticeHomeScreen from "@screens/ielts-practice/ielts.practice.home.screen";
import IeltsPraticeList from "@screens/ielts-practice/ielts.practice.list";

import ClassRoomScreen from "@screens/call-class/class.room.screen";
import WebviewScreen from "@screens/webview/Webview";
import CourseRecommendScreen from "@screens/course/course-recommend/course.recommend";
import HomeAffilite from "@screens/affiliate/intro.affiliate.screen";
import TextBase from "@shared-components/TextBase";
import { translations } from "@localization";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import IconSvg from "assets/svg";
import AudioListScreen from "@screens/audio/audio-list/audio.list.screen";
import AudioPlayScreen from "@screens/audio/audio-play/audio.play.screen";
import ClubScreen from "@screens/club/home-club/club.screen";
import AudioBookScreen from "@screens/audio/audio-book/audio.book.screen";
import RecommendBookScreen from "@screens/audio/recommend.book.screen";
import AllBookScreen from "@screens/audio/all.book.screen";
import { FloatingPlayer } from "@screens/audio/components/FloatingPlayer";
import AudioPreview from "@screens/audio/audio-preview/audio.preview";
import showAllReview from "@screens/audio/audio-preview/show.all.review";
import EliteClubScreen from "@screens/club/elite-club/elite.club.screen";
import CreateEventScreen from "@screens/club/create-event/create.event.screen";
import DiscoverScreen from "@screens/discover-screen/discover.screen";
import CreateClubScreen from "@screens/club/create-club/create.club.screen";
import EventsListScreen from "@screens/events/events.list.screen";
import DetailScreenEvent from "@screens/events/components/detail.screen.event";
import ListImageScreen from "@screens/club/elite-club/components/list.image.screen";
import BecomEliteClub from "@screens/club/elite-club/components/becom.elite.club";
import ClubPostScreen from "@screens/club/club/club.post.screen";
import ListMemberScreen from "@screens/club/list-member/list.member";
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
      case SCREENS.COURSE_LIST:
        iconName = focused ? "icCourse" : "icCourse";
        break;
      // case SCREENS.CHAT:
      //   iconName = focused ? "icCoach" : "icCoachBlur";
      //   break;
      case SCREENS.NOTIFICATION:
        iconName = focused ? "bell" : "bell";
        break;
      case SCREENS.SETTINGPROFILESCREEN:
        iconName = focused ? "icProfile" : "icProfile";
        break;
      case SCREENS.SETTING:
        iconName = focused ? "settings" : "settings";
        break;
      case SCREENS.DISCOVERSCREEN:
        iconName = focused ? "icDiscovery" : "icDiscovery";
        break;
      case SCREENS.CLUB_SCREEN:
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
      case SCREENS.COURSE_LIST:
        label = translations.courses;
        break;
      case SCREENS.CHAT:
        label = translations.chats;
        break;
      case SCREENS.NOTIFICATION:
        label = translations.notifications.notifications;
        break;
      case SCREENS.SETTINGPROFILESCREEN:
        label = translations.profile.profile;
        break;
      case SCREENS.DISCOVERSCREEN:
        label = translations.discovers;
        break;
      case SCREENS.SETTING:
        label = translations.setting;
        break;
      case SCREENS.CLUB_SCREEN:
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

  const renderTabNavigation = () => {
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
          <Tab.Screen name={SCREENS.HOME} component={HomeScreen} />
          <Tab.Screen name={SCREENS.COURSE_LIST} component={CourseListScreen} />
          <Tab.Screen name={SCREENS.CLUB_SCREEN} component={ClubScreen} />
          <Tab.Screen
            name={SCREENS.DISCOVERSCREEN}
            component={DiscoverScreen}
          />

          <Tab.Screen
            name={SCREENS.SETTINGPROFILESCREEN}
            component={SettingProfileScreen}
          />
        </Tab.Navigator>
      </>
    );
  };

  const renderStackIntro = () => {
    return null;
    // if (!isFirstOpenApp) return null;
    return (
      <>
        <Stack.Screen
          name={SCREENS.CHOOSE_LANGUAGE}
          component={ChooseLanguageScreen}
        />
        <Stack.Screen name={SCREENS.INTRO} component={IntroScreen} />

        <Stack.Screen name={SCREENS.WELCOME} component={WelcomeScreen} />
      </>
    );
  };

  const renderBanksStack = () => {
    return (
      <>
        <Stack.Screen name={SCREENS.BANK_LIST} component={BankListScreen} />
        <Stack.Screen name={SCREENS.WITHDRAW} component={WithdrawScreen} />
        <Stack.Screen name={SCREENS.ADD_BANK} component={AddBankScreen} />
      </>
    );
  };

  const renderPracticeTestStack = () => {
    return (
      <>
        <Stack.Screen
          name={SCREENS.IELTS_PRACTICE_HOME}
          component={PracticeHomeScreen}
        />
        <Stack.Screen
          name={SCREENS.IELTS_PRACTICE_LIST}
          component={IeltsPraticeList}
        />
        <Stack.Screen
          name={SCREENS.IELTS_READING_PRACTICE}
          component={IeltsReadingPacticeScreen}
        />
        <Stack.Screen
          name={SCREENS.IELTS_PRACTICE}
          component={IeltsPacticeScreen}
        />
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

        <Stack.Screen name={SCREENS.HOME_TAB} component={renderTabNavigation} />
        <Stack.Screen name={SCREENS.LEADERBOARD} component={LeaderBoard} />
        <Stack.Screen
          name={SCREENS.COURSE_RECOMMEND}
          component={CourseRecommendScreen}
        />
        <Stack.Screen
          name={SCREENS.CLASSHOMEWORK}
          component={ClassHomeWorkScreen}
        />
        {renderBanksStack()}
        {renderPracticeTestStack()}
        <Stack.Screen name={SCREENS.CHAT} component={ChatListScreen} />
        <Stack.Screen name={SCREENS.CALL_CLASS} component={ClassRoomScreen} />

        <Stack.Screen
          name={SCREENS.TEACHER_COURSES}
          component={TeacherCourse}
        />
        {/* {renderHomeworkScreens()} */}
        <Stack.Screen
          name={SCREENS.ADD_WORK_STUDENT}
          component={AddWorkStudentScreen}
        />

        <Stack.Screen name={SCREENS.DETAIL_TASK} component={DetailTaskScreen} />
        <Stack.Screen name={SCREENS.CREATE_WORK} component={CreateWorkScreen} />
        <Stack.Screen name={SCREENS.TASK_SCREEN} component={TaskScreen} />
        <Stack.Screen name={SCREENS.MY_COURES} component={MyCourse} />
        <Stack.Screen name={SCREENS.SETTING} component={SettingScreen} />
        <Stack.Screen
          name={SCREENS.NOTIFICATION}
          component={NotificationScreen}
        />

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
          name={SCREENS.COUPON_LIST}
          component={ListCouponForMyCourse}
        />
        <Stack.Screen
          name={SCREENS.COUPON_CREATE}
          component={CouponCreateScreen}
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
        <Stack.Screen
          options={{ gestureEnabled: false }}
          name={SCREENS.LIVE_STREAM}
          component={LiveStreamScreen}
        />
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
        <Stack.Screen name={SCREENS.AFFILIATE} component={AffiliatePage} />
        <Stack.Screen name={SCREENS.BLACK_LIST} component={BlackList} />
        <Stack.Screen name={SCREENS.HOME_AFFILIATE} component={HomeAffilite} />
        {/* <Stack.Screen name={SCREENS.TAB_FOLLOW} component={TabFollow} />
        <Stack.Screen
          name={SCREENS.PRIVATESETTING}
          component={PrivateSetting}
        />
        <Stack.Screen
          name={SCREENS.SETTINGPROFILESCREEN}
          component={SettingProfileScreen}
        /> */}
        <Stack.Screen
          name={SCREENS.CODE_ACTIVATIONS_SCREEN}
          component={CodeActivationsScreen}
        />
        <Stack.Screen name={SCREENS.HIDDEN_PAGE} component={HiddenPaage} />
        <Stack.Screen name={SCREENS.WEBVIEW_SCREEN} component={WebviewScreen} />
        <Stack.Screen name={SCREENS.AUDIO_PLAY} component={AudioPlayScreen} />
        <Stack.Screen name={SCREENS.AUDIO_LIST} component={AudioListScreen} />
        <Stack.Screen name={SCREENS.AUDIO_BOOK} component={AudioBookScreen} />
        <Stack.Screen
          name={SCREENS.RECOMMEND_AUDIO_BOOK}
          component={RecommendBookScreen}
        />
        <Stack.Screen name={SCREENS.ALL_AUDIO_BOOk} component={AllBookScreen} />
        <Stack.Screen name={SCREENS.AUDIO_PREVIEW} component={AudioPreview} />
        <Stack.Screen
          name={SCREENS.SHOW_ALL_REVIEW}
          component={showAllReview}
        />
        <Stack.Screen name={SCREENS.ELITE_CLUB} component={EliteClubScreen} />
        <Stack.Screen name={SCREENS.CLUB_HOME} component={ClubPostScreen} />
        <Stack.Screen
          name={SCREENS.LIST_MEMBER_CLUB}
          component={ListMemberScreen}
        />
        <Stack.Screen
          name={SCREENS.CREATEEVENT}
          component={CreateEventScreen}
        />
        <Stack.Screen
          name={SCREENS.CREATE_CLUB_SCREEN}
          component={CreateClubScreen}
        />
        <Stack.Screen
          name={SCREENS.EVENTSLISTSCREEN}
          component={EventsListScreen}
        />
        <Stack.Screen
          name={SCREENS.DETAILEVENTSCREEN}
          component={DetailScreenEvent}
        />
        <Stack.Screen
          name={SCREENS.LIST_IMAGE_SCREEN}
          component={ListImageScreen}
        />
        <Stack.Screen
          name={SCREENS.BECOME_ELITE_CLUB}
          component={BecomEliteClub}
        />
      </Stack.Navigator>
      <FloatingPlayer
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: getBottomSpace() + 52,
        }}
      />
    </NavigationContainer>
  );
};

export default Navigation;
