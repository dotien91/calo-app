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
  SEARCH: "Search",
  NOTIFICATION: "Notification",
  PROFILE: "Profile",
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
  SETTINGPROFILESCREEN: "SettingProfileScreen",
  CLASSHOMEWORK: "ClassHomeWork",
  CREATE_WORK: "CreateWork",
};

export const IOS_CLIENT_ID_GOOGLE =
  "409582649419-j3ler20j0fklont9ivpeud6lmq7hkkqn.apps.googleusercontent.com";
export const WEB_CLIENT_ID_GOOGLE =
  "409582649419-0bojiri21udlkk2gov3fc8u4tr9i3dmm.apps.googleusercontent.com";

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
