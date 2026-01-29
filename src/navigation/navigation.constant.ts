import { SCREENS } from "constants";

// ? Screens - General & Social
import WebviewScreen from "@screens/webview/Webview";
import HomeAffilite from "@screens/affiliate/intro.affiliate.screen";
import DetailScreen from "@screens/detail/DetailScreen";
import SettingScreen from "@screens/setting/setting.screen";
import SettingUser from "@screens/setting-user/setting.user";
import ChangeLanguage from "@screens/change-language/change.language";
import SmartBanking from "@screens/smart-banking/smart.banking";
import PaymentSuccess from "@screens/payment-success/payment.success";
import TabFollow from "@screens/tab-follow/tab.follow";
import NotificationScreen from "@screens/notification/NotificationScreen";
import CodeActivationsScreen from "@screens/code-activations/code.activations.screen";
import HiddenPaage from "@screens/hidden-page/hidden.page";
import BlackList from "@screens/black-list/black.list";

// ? Screens - Auth
import LoginScreen from "@screens/auth/login/login.screen";
import LoginWithEmailScreen from "@screens/auth/login/login.with.email.screen";
import SignUpScreen from "@screens/auth/sign-up/signup.screen";
import ForgotPasswordScreen from "@screens/auth/forgot-password/forgot.password.screen";
import NewPasswordScreen from "@screens/auth/forgot-password/create.new.password";
import VerifyCodeScreen from "@screens/auth/forgot-password/VerifyCodeScreen";

// ? Screens - Social (Post/Chat/Stream)
import SearchRoomChatScreen from "@screens/chat/search-room/search.room.view";
import ChatRoomScreen from "@screens/chat/room-chat/chat.room.screen";
import PostScreen from "@screens/post/create.post.screen";
import PostDetailScreen from "@screens/post/post.detail.screen";
import EditCommentScreen from "@screens/home/edit-comment/edit.comment.screen";
import SearchPostScreen from "@screens/search/search.post.screen";
import ProfileChatScreen from "@screens/chat/profile-chat/chat.profile.screen";
import CreateGroupChatScreen from "@screens/chat/create-group-chat/create.group.chat.screen";
import AddUserGroupChatScreen from "@screens/chat/add-user-to-group-chat/add.user.group.chat.screen";
import ChatListScreen from "@screens/chat/list-chat/chat.list.screen";
import ChatRoomMediaScreen from "@screens/chat/media-club/chat.media.screen";

// ? Screens - Health & Onboarding (Calorie App Core)
import OnboardingScreen from "@screens/welcome/onboarding/onboarding.screen";
import OnboardingFlowScreen from "@screens/welcome/onboarding/onboarding.flow.screen";
import GoalDetailScreen from "@screens/on-boarding/goal.screen";
import ChooseLanguageScreen from "@screens/welcome/choose-language/choose.language.screen";
import AddMealScreen from "@screens/add-meal";
import CalorierScannerScreen from "@screens/calorier-scanner/calorier.scanner.screen";
import CalorieResultScreen from "@screens/calorier-scanner/calorie.result.screen";

export const DiscoveryStackData: any[] = [];

// Đã xóa IELTS Practice vì không liên quan App Calo
export const PracticeTestData: any[] = [];

export const BankStackData: any[] = [];

export const StackIntroData = [
  {
    name: SCREENS.ONBOARDING,
    screen: OnboardingScreen,
  },
];

// Một màn onboarding duy nhất, chuyển bước bằng view (không navigate)
export const OnboardingStackData = [
  {
    name: SCREENS.CURRENT_WEIGHT,
    screen: OnboardingFlowScreen,
  },
];

export const ClubStackData: any[] = [];

export const CommonStackData = [
  ...OnboardingStackData, // Import luồng nhập liệu sức khỏe vào Common
  { name: SCREENS.GOAL, screen: GoalDetailScreen },
  { name: SCREENS.CHOOSE_LANGUAGE, screen: ChooseLanguageScreen },
  { name: SCREENS.POST_DETAIL, screen: PostDetailScreen },
  { name: SCREENS.CHAT, screen: ChatListScreen },
  { name: SCREENS.POST_SCREEN, screen: PostScreen },
  { name: SCREENS.ADD_MEAL_SCREEN, screen: AddMealScreen },
  { name: SCREENS.CALORIER_SCANNER, screen: CalorierScannerScreen },
  { name: SCREENS.CALORIE_RESULT, screen: CalorieResultScreen },
  { name: SCREENS.EDIT_COMMENT, screen: EditCommentScreen },
  { name: SCREENS.SEARCH_CHAT, screen: SearchRoomChatScreen },
  { name: SCREENS.SEARCH, screen: SearchPostScreen },
  { name: SCREENS.CHAT_ROOM, screen: ChatRoomScreen },
  { name: SCREENS.LOGIN_WITH_EMAIL, screen: LoginWithEmailScreen },
  { name: SCREENS.SIGN_UP, screen: SignUpScreen },
  { name: SCREENS.FORGOT_PASSWORD, screen: ForgotPasswordScreen },
  { name: SCREENS.VERIFY_CODE, screen: VerifyCodeScreen },
  { name: SCREENS.NEW_PASSWORD, screen: NewPasswordScreen },
  { name: SCREENS.SETTING_USER, screen: SettingUser },
  { name: SCREENS.CHANGELANGUAGE, screen: ChangeLanguage },
  { name: SCREENS.SMARTBANKING, screen: SmartBanking },
  { name: SCREENS.PAYMENT_SUCCESS, screen: PaymentSuccess },
  { name: SCREENS.TAB_FOLLOW, screen: TabFollow },
  { name: SCREENS.SETTING, screen: SettingScreen },
  { name: SCREENS.NOTIFICATION, screen: NotificationScreen },
  { name: SCREENS.PROFILE_CHAT, screen: ProfileChatScreen },
  { name: SCREENS.ADD_USER_TO_GROUP, screen: AddUserGroupChatScreen },
  { name: SCREENS.MEDIA_CHAT_SCREEN, screen: ChatRoomMediaScreen },
  { name: SCREENS.CREATE_GROUP_CHAT, screen: CreateGroupChatScreen },
  { name: SCREENS.DETAIL, screen: DetailScreen },
  { name: SCREENS.LOGIN_PAGE, screen: LoginScreen },
  { name: SCREENS.BLACK_LIST, screen: BlackList },
  { name: SCREENS.HOME_AFFILIATE, screen: HomeAffilite },
  { name: SCREENS.CODE_ACTIVATIONS_SCREEN, screen: CodeActivationsScreen },
  { name: SCREENS.HIDDEN_PAGE, screen: HiddenPaage },
  { name: SCREENS.WEBVIEW_SCREEN, screen: WebviewScreen },
];