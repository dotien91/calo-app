import { Platform } from "react-native";
import { PERMISSIONS } from "react-native-permissions";
import { isIos } from "@helpers/device.info.helper";

// ? Screens
export const SCREENS = {
  INTRO: "LoginIntro",
  CHOOSE_LANGUAGE: "LoginChooseLanguage",
  WELCOME: "LoginWelcome",
  LOGIN_PAGE: "LoginPage",
  LOGIN_WITH_EMAIL: "LoginWithEmail",
  SIGN_UP: "SignUp",
  FORGOT_PASSWORD: "ForgotPassword",
  VERIFY_CODE: "VerifyCode",
  NEW_PASSWORD: "NewPassword",
  HOME: "Home",
  HOME_TAB: "HomeTab",
  SEARCH: "Search",
  NOTIFICATION: "Notification",
  PROFILE: "Profile1",
  DETAIL: "Detail",
  SETTING: "Setting",
  CHAT: "Chat",
  CHAT_ROOM: "ChatRoom",
  SEARCH_CHAT: "SearchChat",
  LIVE_STREAM: "LiveStream",
  VIEW_LIVE_STREAM: "ViewLiveStream",
  POST_SCREEN: "PostScreen",
  LIST_POST: "ListPost",
  POST_DETAIL: "PostDetail",
  EDIT_COMMENT: "EditComment",
  PROFILE_CHAT: "ProfileChat",
  CREATE_GROUP_CHAT: "CreateGroupChat",
  MEDIA_CHAT_SCREEN: "MediaChat",
  ADD_USER_TO_GROUP: "AddUserToGroup",
  PROFILE_GROUP_CHAT: "ProfileGroupChat",
  PROFILE_CURRENT_USER: "ProfileCurentUser",
  EDIT_PROFILE: "EditProfile",
  COURSE_LIST: "Course",
  COURSE_SEARCH: "CourseSearch",
  COURSE_CATEGORY: "CourseCategory",
  BOOK_LESSON: "BookLesson",
  CHOOSE_CLASS: "ChooseClass",
  PAYMENT_COURES: "PaymentCoures",
  COURSE_DETAIL: "CourseDetail",
  TEACHER_DETAIL: "TeacherDetail",
  COURSE_RATE: "CourseRate",
  COURSE_LIST_RATE: "CourseListRate",
  ABOUT_ME: "AboutMe",
  SETTING_USER: "SettingUser",
  CHANGELANGUAGE: "ChangeLanguage",
  SMARTBANKING: "SmartBanking",
  PAYMENT_SUCCESS: "PaymentSuccess",
  COURSE_LEARN_VIDEO_SCREEN: "CourseLearnVideoScreen",
  CALL_PAGE: "Call",
  IN_COMING_CALL: "InComingCall",
  MY_COURES: "MyCoures",
  COURSE_CREATE: "CourseCreate",
  COURSE_CREATE_CLASS: "CourseCreateClass",
  COURSE_LIST_CLASS: "CourseListClass",
  COURSE_CREATE_CALENDAR_CALL: "CourseCreateCalendarCall",
  COURSE_CREATE_MODULE: "CourseCreateModule",
  COURSE_LIST_MODULE: "CourseListModule",
  COURSE_ADD_MODULE: "CourseAddModule",
  CALL_CLASS: "CallClass",
  COUPON_CREATE: "CouponCreate",
  COUPON_LIST: "CouponList",
  TAB_FOLLOW: "TabFollow",
  BLACK_LIST: "BlackList",
  PRIVATESETTING: "PrivateSetting",
  SETTINGPROFILESCREEN: "Profile",
  CLASSHOMEWORK: "ClassHomeWork",
  CREATE_WORK: "CreateWork",
  DETAIL_TASK: "DetailTask",
  ADD_WORK_STUDENT: "AddWorkStudent",
  DISCOVERSCREEN: "Discover",
  LEADERBOARD: "LeaderBoard",
  SETTINGPPROFILE: "SettingProfile",
  TASK_SCREEN: "TaskScreen",
  TEACHER_COURSES: "TeacherCourses",
  AFFILIATE: "Affiliate",
  WITHDRAW: "Withdraw",
  BANK_LIST: "BankList",
  ADD_BANK: "AddBank",
  CODE_ACTIVATIONS_SCREEN: "CodeActivationsScreen",
  LIST_COURSE: "ListCourse",
  HIDDEN_PAGE: "HiddenPage",
  IELTS_PRACTICE: "IeltsPractice",
  IELTS_READING_PRACTICE: "IeltsReadingPractice",
  IELTS_PRACTICE_HOME: "PracticeHomeScreen",
  IELTS_PRACTICE_LIST: "IeltsPracticeList",
  WEBVIEW_SCREEN: "WebviewScreen",
  COURSE_RECOMMEND: "CourseRecommend",
  HOME_AFFILIATE: "HomeAffilite",
  AUDIO_LIST: "AudioList",
  AUDIO_PLAY: "AudioPlay",
  CLUB_SCREEN: "ClubScreen",
  CREATE_CLUB_SCREEN: "CreateClubScreen",
  CLUB_HOME: "ClubHome",
  LIST_MEMBER_CLUB: "ListMemberClub",
  LIST_COURSE_CLUB: "ListCourseClub",
  AUDIO_BOOK: "AudioBook",
  RECOMMEND_AUDIO_BOOK: "RecommandAudioBook",
  ALL_AUDIO_BOOk: "AllAudioBook",
  AUDIO_PREVIEW: "AudioPreview",
  SHOW_ALL_REVIEW: "ShowAllReview",
  ELITE_CLUB: "EliteClub",
  CREATEEVENT: "CreateEvent",
  EVENTSLISTSCREEN: "EventsListScreen",
  DETAILEVENTSCREEN: "DetailScreenEvent",
  LIST_IMAGE_SCREEN: "ListImageScreen",
  BECOME_ELITE_CLUB: "BecomeEliteClub",
  UPDATE_EVENT_SCREEN: "UpdateEventScreen",
};

export const IOS_CLIENT_ID_GOOGLE =
  "543656532685-ea3og352pgjtb382rlhmhdl983upijma.apps.googleusercontent.com";
export const WEB_CLIENT_ID_GOOGLE =
  "543656532685-oh1fjl1fhvc1dcdc32agqrotf28vjj69.apps.googleusercontent.com";

export enum SERVICE_UNIT {
  second = "second",
  minute = "minute",
  hour = "hour",
  day = "day",
}

export enum SEND_MESSAGE_STATUS {
  failed,
  pending,
}

export const PERMISSION = {
  permissionMedia: isIos()
    ? [
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.MICROPHONE,
        PERMISSIONS.IOS.PHOTO_LIBRARY,
      ]
    : Number(Platform.Version) >= 33
    ? [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
      ]
    : [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ],
  permissionRecord: isIos()
    ? [PERMISSIONS.IOS.MICROPHONE]
    : Number(Platform.Version) >= 33
    ? [PERMISSIONS.ANDROID.RECORD_AUDIO, PERMISSIONS.ANDROID.READ_MEDIA_AUDIO]
    : [
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ],
  permissionLibrary: isIos()
    ? [PERMISSIONS.IOS.PHOTO_LIBRARY]
    : Number(Platform.Version) >= 33
    ? [
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      ]
    : [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE],
  permissionCamera: isIos()
    ? [PERMISSIONS.IOS.CAMERA]
    : [PERMISSIONS.ANDROID.CAMERA],
  permissionCall: isIos()
    ? []
    : [PERMISSIONS.ANDROID.POST_NOTIFICATIONS, PERMISSIONS.ANDROID.CALL_PHONE],
};
