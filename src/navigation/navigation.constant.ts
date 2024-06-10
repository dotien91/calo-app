import AllBookScreen from "@screens/audio/all.book.screen";
import AudioPlayScreen from "@screens/audio/audio-play/audio.play.screen";
import AudioPreview from "@screens/audio/audio-preview/audio.preview";
import RecommendBookScreen from "@screens/audio/recommend.book.screen";
import DiscoverScreen from "@screens/discover-screen/discover.screen";
import PracticeHomeScreen from "@screens/ielts-practice/ielts.practice.home.screen";
import IeltsPraticeList from "@screens/ielts-practice/ielts.practice.list";
import IeltsPacticeScreen from "@screens/ielts-practice/ielts.practice.test.screen";
import ChooseLanguageScreen from "@screens/welcome/choose-language/choose.language.screen";
import WelcomeScreen from "@screens/welcome/welcome.screen";
import AddBankScreen from "@screens/withdraw/add.bank.screen";
import BankListScreen from "@screens/withdraw/bank.list.screen";
import WithdrawScreen from "@screens/withdraw/withdraw.screen";
import { SCREENS } from "constants";
import IntroScreen from "@screens/welcome/intro/intro.screen";
import AudioBookScreen from "@screens/audio/audio-book/audio.book.screen";
import ClassRoomScreen from "@screens/call-class/class.room.screen";
import WebviewScreen from "@screens/webview/Webview";
import CourseRecommendScreen from "@screens/course/course-recommend/course.recommend";
import HomeAffilite from "@screens/affiliate/intro.affiliate.screen";
import ClubScreen from "@screens/club/home-club/club.screen";
import showAllReview from "@screens/audio/audio-preview/show.all.review";
import EliteClubScreen from "@screens/club/elite-club/elite.club.screen";
import CreateEventScreen from "@screens/club/create-event/create.event.screen";
import CreateClubScreen from "@screens/club/create-club/create.club.screen";
import EventsListScreen from "@screens/events/events.list.screen";
import DetailScreenEvent from "@screens/events/components/detail.screen.event";
import ListImageScreen from "@screens/club/elite-club/components/list.image.screen";
import BecomEliteClub from "@screens/club/elite-club/components/becom.elite.club";
import ClubPostScreen from "@screens/club/club/club.post.screen";
import ListMemberScreen from "@screens/club/list-member/list.member";
import UpdateEventScreen from "@screens/events/update-event/update.event.screen";
import ListCourseClub from "@screens/home/components/list-course-club/list.course.club.screen";
import SettingClubScreen from "@screens/club/setting-club/setting.club.screen";
import SearchClubScreen from "@screens/club/search-club/search.club.screen";
import ClubByCategoryScreen from "@screens/club/search-club/club.by.category.screen";
import ClubMediaScreen from "@screens/club/media-club/club.media.screen";
import DetailScreen from "@screens/detail/DetailScreen";
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
import CourseSearchScreen from "@screens/course-tab/course-search/course.search.screen";
import CourseFilterResultScreen from "@screens/course-tab/course-filter-result/course.filter.result.screen";
import BookLessonScreen from "@screens/purchase-course/book-lesson/book.lesson.screen";
import ChooseClassScreen from "@screens/purchase-course/choose-class/choose.class.screen";
import PaymentCoures from "@screens/checkout/checkout.screen";
import CoursePreviewScreen from "@screens/course/course-preview/course.preview.screen";
import DetailTeacherScreen from "@screens/course/detail-teacher/detail.teacher.screen";
import CourseRate from "@screens/course/course-rate/course.rate.screen";
import ReviewScreen from "@screens/course/course-preview/review.screen";
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
import CodeActivationsScreen from "@screens/code-activations/code.activations.screen";
import HiddenPaage from "@screens/hidden-page/hidden.page";
import BlackList from "@screens/black-list/black.list";
import AccountSetupScreen from "@screens/welcome/account-setup/account.setup.screen";
import TeacherScreen from "@screens/profile.screen/ikiCoachTeacher.screen";
import ManagedClubScreen from "@screens/club/components/managed.club.screen";

export const DiscoveryStackData = [
  {
    name: SCREENS.DISCOVERSCREEN,
    screen: DiscoverScreen,
  },
  {
    name: SCREENS.ALL_AUDIO_BOOk,
    screen: AllBookScreen,
  },
  {
    name: SCREENS.AUDIO_BOOK,
    screen: AudioBookScreen,
  },
];

export const PracticeTestData = [
  {
    name: SCREENS.IELTS_PRACTICE_HOME,
    screen: PracticeHomeScreen,
  },
  {
    name: SCREENS.IELTS_PRACTICE_LIST,
    screen: IeltsPraticeList,
  },
  {
    name: SCREENS.IELTS_PRACTICE,
    screen: IeltsPacticeScreen,
  },
];

export const BankStackData = [
  {
    name: SCREENS.BANK_LIST,
    screen: BankListScreen,
  },
  {
    name: SCREENS.WITHDRAW,
    screen: WithdrawScreen,
  },
  {
    name: SCREENS.ADD_BANK,
    screen: AddBankScreen,
  },
];

export const StackIntroData = [
  {
    name: SCREENS.CHOOSE_LANGUAGE,
    screen: ChooseLanguageScreen,
  },
  {
    name: SCREENS.INTRO,
    screen: IntroScreen,
  },
  {
    name: SCREENS.WELCOME,
    screen: WelcomeScreen,
  },
  {
    name: SCREENS.ACCOUNT_SETUP_SCREEN,
    screen: AccountSetupScreen,
  },
];

export const ClubStackData = [
  {
    name: SCREENS.CLUB_SCREEN,
    screen: ClubScreen,
  },
  {
    name: SCREENS.SETTING_CLUB_SCREEN,
    screen: SettingClubScreen,
  },
  {
    name: SCREENS.CLUB_HOME,
    screen: ClubPostScreen,
  },
  {
    name: SCREENS.CREATE_CLUB_SCREEN,
    screen: CreateClubScreen,
  },
  {
    name: SCREENS.ELITE_CLUB,
    screen: EliteClubScreen,
  },
  {
    name: SCREENS.LIST_MEMBER_CLUB,
    screen: ListMemberScreen,
  },
  {
    name: SCREENS.LIST_COURSE_CLUB,
    screen: ListCourseClub,
  },
  {
    name: SCREENS.CREATEEVENT,
    screen: CreateEventScreen,
  },
  {
    name: SCREENS.EVENTSLISTSCREEN,
    screen: EventsListScreen,
  },
  {
    name: SCREENS.DETAILEVENTSCREEN,
    screen: DetailScreenEvent,
  },
  {
    name: SCREENS.LIST_IMAGE_SCREEN,
    screen: ListImageScreen,
  },
  {
    name: SCREENS.BECOME_ELITE_CLUB,
    screen: BecomEliteClub,
  },
  {
    name: SCREENS.UPDATE_EVENT_SCREEN,
    screen: UpdateEventScreen,
  },
  {
    name: SCREENS.MEDIA_CLUB,
    screen: ClubMediaScreen,
  },
];

export const CommonStackData = [
  { name: SCREENS.POST_DETAIL, screen: PostDetailScreen },
  { name: SCREENS.COURSE_CATEGORY, screen: CourseFilterResultScreen },
  { name: SCREENS.COURSE_DETAIL, screen: CoursePreviewScreen },
  { name: SCREENS.COURSE_RATE, screen: CourseRate },
  { name: SCREENS.COURSE_SEARCH, screen: CourseSearchScreen },
  { name: SCREENS.TEACHER_DETAIL, screen: DetailTeacherScreen },
  { name: SCREENS.CHAT, screen: ChatListScreen },
  { name: SCREENS.POST_SCREEN, screen: PostScreen },
  { name: SCREENS.EDIT_COMMENT, screen: EditCommentScreen },
  { name: SCREENS.PROFILE_CURRENT_USER, screen: ProfileUserScreen },
  { name: SCREENS.SEARCH_CHAT, screen: SearchRoomChatScreen },
  { name: SCREENS.EDIT_PROFILE, screen: EditProfileScreen },
  { name: SCREENS.SEARCH, screen: SearchPostScreen },
  { name: SCREENS.CHAT_ROOM, screen: ChatRoomScreen },
  { name: SCREENS.LOGIN_WITH_EMAIL, screen: LoginWithEmailScreen },
  { name: SCREENS.SIGN_UP, screen: SignUpScreen },
  { name: SCREENS.FORGOT_PASSWORD, screen: ForgotPasswordScreen },
  { name: SCREENS.VERIFY_CODE, screen: VerifyCodeScreen },
  { name: SCREENS.NEW_PASSWORD, screen: NewPasswordScreen },
  { name: SCREENS.PAYMENT_COURES, screen: PaymentCoures },
  { name: SCREENS.ABOUT_ME, screen: AboutMe },
  { name: SCREENS.SETTING_USER, screen: SettingUser },
  { name: SCREENS.CHANGELANGUAGE, screen: ChangeLanguage },
  { name: SCREENS.SMARTBANKING, screen: SmartBanking },
  { name: SCREENS.CALL_PAGE, screen: CallPageScreen },
  { name: SCREENS.IN_COMING_CALL, screen: InComingCall },
  { name: SCREENS.PAYMENT_SUCCESS, screen: PaymentSuccess },
  { name: SCREENS.TAB_FOLLOW, screen: TabFollow },
  { name: SCREENS.CALL_CLASS, screen: ClassRoomScreen },
  { name: SCREENS.TEACHER_COURSES, screen: TeacherCourse },
  { name: SCREENS.ADD_WORK_STUDENT, screen: AddWorkStudentScreen },
  { name: SCREENS.DETAIL_TASK, screen: DetailTaskScreen },
  { name: SCREENS.CREATE_WORK, screen: CreateWorkScreen },
  { name: SCREENS.TASK_SCREEN, screen: TaskScreen },
  { name: SCREENS.MY_COURES, screen: MyCourse },
  { name: SCREENS.SETTING, screen: SettingScreen },
  { name: SCREENS.NOTIFICATION, screen: NotificationScreen },
  { name: SCREENS.COURSE_CREATE, screen: CourseCreateScreen },
  { name: SCREENS.COURSE_LIST_MODULE, screen: CourseListVideoScreen },
  { name: SCREENS.COURSE_ADD_MODULE, screen: CourseAddModuleScreen },
  {
    name: SCREENS.COURSE_CREATE_CALENDAR_CALL,
    screen: CreateClassCallOneScreen,
  },
  { name: SCREENS.COURSE_LIST_CLASS, screen: CourseListClassScreen },
  { name: SCREENS.COURSE_CREATE_CLASS, screen: CourseCreateClassScreen },
  { name: SCREENS.CHOOSE_CLASS, screen: ChooseClassScreen },
  { name: SCREENS.BOOK_LESSON, screen: BookLessonScreen },
  { name: SCREENS.COURSE_LEARN_VIDEO_SCREEN, screen: CourseLearnScreen },
  { name: SCREENS.COURSE_LIST_RATE, screen: ReviewScreen },
  { name: SCREENS.COUPON_LIST, screen: ListCouponForMyCourse },
  { name: SCREENS.COUPON_CREATE, screen: CouponCreateScreen },
  { name: SCREENS.PROFILE_CHAT, screen: ProfileChatScreen },
  { name: SCREENS.ADD_USER_TO_GROUP, screen: AddUserGroupChatScreen },
  { name: SCREENS.MEDIA_CHAT_SCREEN, screen: MediaChatScreen },
  { name: SCREENS.CREATE_GROUP_CHAT, screen: CreateGroupChatScreen },
  { name: SCREENS.VIEW_LIVE_STREAM, screen: ViewStreamScreen },
  { name: SCREENS.LIVE_STREAM, screen: LiveStreamScreen },
  { name: SCREENS.DETAIL, screen: DetailScreen },
  { name: SCREENS.LOGIN_PAGE, screen: LoginScreen },
  { name: SCREENS.AFFILIATE, screen: AffiliatePage },
  { name: SCREENS.BLACK_LIST, screen: BlackList },
  { name: SCREENS.HOME_AFFILIATE, screen: HomeAffilite },
  { name: SCREENS.CODE_ACTIVATIONS_SCREEN, screen: CodeActivationsScreen },
  { name: SCREENS.HIDDEN_PAGE, screen: HiddenPaage },
  { name: SCREENS.WEBVIEW_SCREEN, screen: WebviewScreen },
  { name: SCREENS.SHOW_ALL_REVIEW, screen: showAllReview },
  { name: SCREENS.CLUB_BY_CATEGORY, screen: ClubByCategoryScreen },
  { name: SCREENS.SEARCH_CLUB, screen: SearchClubScreen },
  { name: SCREENS.LEADERBOARD, screen: LeaderBoard },
  { name: SCREENS.COURSE_RECOMMEND, screen: CourseRecommendScreen },
  { name: SCREENS.CLASSHOMEWORK, screen: ClassHomeWorkScreen },
  {
    name: SCREENS.AUDIO_PREVIEW,
    screen: AudioPreview,
  },
  {
    name: SCREENS.RECOMMEND_AUDIO_BOOK,
    screen: RecommendBookScreen,
  },
  {
    name: SCREENS.AUDIO_PLAY,
    screen: AudioPlayScreen,
  },
  {
    name: SCREENS.TEACHER_SCREEN,
    screen: TeacherScreen,
  },
  {
    name: SCREENS.MANAGE_CLUB,
    screen: ManagedClubScreen,
  },
  // {
  //   name: SCREENS.ALL_AUDIO_BOOk,
  //   screen: AllBookScreen,
  // },
  // {
  //   name: SCREENS.AUDIO_BOOK,
  //   screen: AudioBookScreen,
  // },
];
