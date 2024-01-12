import { Platform } from "react-native";
import { PERMISSIONS } from "react-native-permissions";
import { Device } from "../utils/device.ui.utils";

export const HIT_SLOP_EXPAND_20 = { top: 20, left: 20, right: 20, bottom: 20 };
export const HIT_SLOP_EXPAND_10 = { top: 10, left: 10, right: 10, bottom: 10 };
export const ADMIN_ID = "640fd0f476d23263d0ccb101";
export const NUMBER_MESSAGE_BLOCK = 3;

const permissionMedia = () => {
  if (Device.isIos)
    return [
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.MICROPHONE,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
    ];
  if (Number(Platform.Version) >= 33)
    return [
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
    ];
  return [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  ];
};
const permissionRecord = () => {
  if (Device.isIos) return [PERMISSIONS.IOS.MICROPHONE];
  if (Number(Platform.Version) >= 33)
    return [
      PERMISSIONS.ANDROID.RECORD_AUDIO,
      PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
    ];
  return [
    PERMISSIONS.ANDROID.RECORD_AUDIO,
    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  ];
};
const permissionLibrary = () => {
  if (Device.isIos) return [PERMISSIONS.IOS.PHOTO_LIBRARY];
  if (Number(Platform.Version) >= 33)
    [
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
    ];
  return [
    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  ];
};

const permissionRecordVideo = () => {
  if (Device.isIos) return [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE];
  return [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.RECORD_AUDIO,
    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  ];
};

export const PERMISSION = {
  permissionVideoCall: Device.isIos
    ? [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]
    : [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO],
  permissionMedia: permissionMedia(),
  permissionRecord: permissionRecord(),
  permissionLibrary: permissionLibrary(),
  permissionRecordVideo: permissionRecordVideo(),
  permissionDownload: [PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE],
  permissionCamera: Device.isIos
    ? [PERMISSIONS.IOS.CAMERA]
    : [PERMISSIONS.ANDROID.CAMERA],
  permissionCall: Device.isIos
    ? []
    : [PERMISSIONS.ANDROID.POST_NOTIFICATIONS, PERMISSIONS.ANDROID.CALL_PHONE],
};

export const LIST_PERMISSIONS_MENTOR = [
  "channel/create",
  "channel/update",
  "channel/delete",
  "category/create",
  "category/update",
  "category/delete",
  "module/create",
  "module/update",
  "module/delete",
  "course/create",
  "course/update",
  "course/delete",
  "level/create",
  "level/update",
  "level/delete",
  "request/delete",
  "comment/update",
  "comment/delete",
  "user/create",
  "user/update",
  "user/delete",
];

export enum EnumPermission {
  Channel = "channel",
  Category = "category",
  Module = "module",
  Course = "course",
  Challenge = "challenge",
  Gift = "gift",
  Livestream = "livestream",
  Event = "event",
  Level = "level",
  Request = "request",
  Comment = "comment",
  User = "user",
}

export const STATUS_POST = [
  {
    key: "under_review",
    color: "#00A2FF",
    title: "Under Review",
  },
  {
    key: "planned",
    color: "#F0BA00",
    title: "Planned",
  },
  {
    key: "contact_support",
    color: "#FF9D00",
    title: "Contact Support",
  },
  {
    key: "completed",
    color: "#7D7EDF",
    title: "Completed",
  },
  {
    key: "declined",
    color: "#FF0000",
    title: "Declined",
  },
  {
    key: "feature_exists",
    color: "#333333",
    title: "Feature Exists",
  },
];

export enum EnumRole {
  Mentor = "mentor",
  User = "user",
  Admin = "admin",
}

export enum EnumTheme {
  Dark = "Dark",
  Light = "Light",
}

export enum EnumHeightWeightUnit {
  cmkg = "cm/kg",
  ftlb = "ft/lb",
}

export enum EnumDistanceUnit {
  km = "km",
  miles = "mi",
}

export enum EnumAnalytics {
  // POST
  Like_Post = "Like_Post",
  Dislike_Post = "Dislike_Post",
  Comment_Post = "Comment_Post",
  Delete_Comment = "Delete_Comment",
  Like_Comment_Post = "Like_Comment_Post",
  Dislike_Comment_Post = "Dislike_Comment_Post",
  Share_Post = "Share_Post",
  Copy_Link_Post = "Copy_Link_Post",
  Hide_Post = "Hide_Post",
  Report_Post = "Report_Post",
  Create_Poll_Post = "Create_Poll_Post",
  Copy_Content_Post = "Copy_Content_Post",
  Create_Post = "Create_Post",
  Update_Post = "Update_Post",
  Search_Post = "Search_Post",
  Delete_Your_Post = "Delete_Your_Post",
  Delete_User_Posts = "Delete_User_Posts",
  Pin_Post = "Pin_Post",
  TurnOff_Comment = "TurnOff_Comment",
  View_Detail_Post = "View_Detail_Post",
  See_List_Approval_Post = "See_List_Approval_Post",
  Approval_Post = "Approval_Post",
  Cancel_Post = "Cancel_Post",
  Filter_Post = "Filter_Post",
  View_Pending_Post = "View_Pending_Post",

  // Personal page
  See_My_Personal_Page = "See_My_Personal_Page",
  Update_Personal_Page = "Update_Personal_Page",
  See_Other_Personal_Page = "See_Other_Personal_Page",
  Follow = "Follow",
  Unfollow = "Unfollow",
  Chat_In_Personal_Page = "Chat_In_Personal_Page",

  // Course
  Create_Course = "Create_Course",
  Update_Course = "Update_Course",
  Delete_Course = "Delete_Course",
  Add_Module = "Add_Module",
  Update_Module = "Update_Module",
  Delete_Module = "Delete_Module",
  Join_Course = "Join_Course",
  Complete_Lesson = "Complete_Course",
  Buy_Course = "Buy_Course",
  View_Detail_Course = "View_Detail_Course",

  // Charts
  View_Detail_User_Form_Charts = "View_Detail_User_Form_Charts",

  // Extension
  View_Detail_Extension = "View_Detail_Extension",
  Buy_Extension = "Buy_Extension",

  // Redeem
  Create_Redeem = "Create_Redeem",
  Update_Redeem = "Update_Redeem",
  Delete_Redeem = "Delete_Redeem",
  Create_Gift_For_Redeem = "Create_Gift_For_Redeem",
  View_Detail_Redeem = "View_Detail_Redeem",
  Click_Redeem_From_HomePage = "Click_Redeem_From_HomePage",
  Click_Redeem_From_Detail_Redeem = "Click_Redeem_From_Detail_Redeem",
  Receive_Gifts_Of_Diamonds = "Receive_Gifts_Of_Diamonds",
  Receive_Physical_Gifts = "Receive_Physical_Gifts",
  View_Physical_Gifts = "View_Physical_Gifts",

  // Podcast
  Add_Podcast = "Add_Podcast",
  Update_Podcast = "Update_Podcast",
  Delete_Podcast = "Delete_Podcast",
  View_Detail_Podcast = "View_Detail_Podcast",

  // Event
  Join_Event = "Join_Event",
  Leave_Event = "Leave_Event",
  Create_Event = "Create_Event",
  Update_Event = "Update_Event",
  Delete_Event = "Delete_Event",
  View_Detail_Event = "View_Detail_Event",
  View_List_Event_Via_Calendar = "View_List_Event_Via_Calendar",
  Filter_Event = "Filter_Event",

  // Revenue
  View_Channel_Revenue = "View_Channel_Revenue",
  Filter_Revenue = "Filter_Revenue",

  // livestream
  Create_Livestream = "Create_Livestream",
  Start_Livestream = "Start_Livestream",
  End_Of_Livestream = "End_Of_Livestream",
  Product_Pin = "Product_Pin",
  Delete_Product_Pin = "Delete_Product_Pin",
  Comment_In_Livestream = "Comment_In_Livestream",
  Drop_Icon = "Drop_Icon",
  Watch_Livestream = "Watch_Livestream",
  View_Product_Pin = "View_Product_Pin",
  Buy_Product_Pin = "Buy_Product_Pin",

  // Challenge
  Choose_Cookbook = "Choose_Cookbook",
  Create_Challenge = "Create_Challenge",
  Delete_Challenge = "Delete_Challenge",
  Update_Challenge = "Update_Challenge",
  Add_Gift_Challenge = "Add_Gift_Challenge",
  View_Detail_Challenge = "View_Detail_Challenge",
  Search_Challenge = "Search_Challenge",
  Join_Challenge = "Join_Challenge",
  Leave_Challenge = "Leave_Challenge",
  View_Charts_Challenge = "View_Charts_Challenge",
  View_Notification_Challenge = "View_Notification_Challenge",
  Add_Notification_Challenge = "Add_Notification_Challenge",
  Delete_Member_Challenge = "Delete_Member_Challenge",
  Add_Member_Challenge = "Add_Member_Challenge",
  View_Member_Challenge = "View_Member_Challenge",
  View_Member_Point_History = "View_Member_Point_History",
  View_Activity_History = "View_Activity_History",
  Share_Challenge = "Share_Challenge",
  Approval_Activities_Challenge = "Approval_Activities_Challenge",
  CheckIn_Challenge = "CheckIn_Challenge",

  // CheckIn
  Open_Bronze_Chest = "Open_Bronze_Chest",
  Open_Silver_Chest = "Open_Silver_Chest",
  Open_Gold_Chest = "Open_Gold_Chest",
}
