import Toast from "react-native-toast-message";
import * as NavigationService from "react-navigation-helpers";

import { SCREENS } from "constants";
import { translations } from "@localization";
import eventEmitter from "@services/event-emitter";

export enum EnumModalContentType {
  Confirm = "confirm",
  Loading = "loading",
  Library = "libray",
  Report = "report",
  PostAction = "post-action",
  CommentAction = "comment-action",
  FilterListCourse = "filter-list-course",
  FilterTypeCourse = "filter-type-course",
  SelectBox = "select-box",
  MoreTeacher = "more-teacher",
  ChatRoom = "chat-room",
  ListUser = "list-user",
  AddLesson = "add-lesson",
  TextInput = "text-input",
  ListMoreAction = "list-more-action",
  GamificationView = "gimification-view",
  LottieAnimation = "lottie-animation",
  CustomView = "custom-view",
  ListCourse = "list-course",
  FilterAffiliate = "filter-affiliate",
  SearchBank = "search-bank",
  SelectSort = "select-sort",
  Referral = "Referral",
  InviteCode = "invite-code",
  TeacherClass = "teacher-class",
  MoreCourse = "more-course",
  AddCouponToCourse = "add-coupon-to-course",
  SelectMissions = "select-missions",
  RefferralTask = "RefferralTask",
  FilterSortClub = "filter-sort-club",
  ReviewAudio = "ReviewAudio",
  MemberAction = "MemberAction",
  SelectCourse = "SelectCourse",
}

export enum EnumStyleModalType {
  Bottom = "bottom",
  Middle = "middle",
}

export interface IShowModalParams {
  contentModalType: EnumModalContentType;
  styleModalType: EnumStyleModalType;
  data?: any;
}

interface ToastProps {
  type?: "success" | "error" | "info" | "warning";
  message?: string;
  title?: string;
}

// example
// show loading
// showSuperModal({
//   contentModalType: EnumModalContentType.Loading,
//   styleModalType: EnumStyleModalType.Middle,
// })

// show report
// showSuperModal({
//   contentModalType: EnumModalContentType.Report,
//   styleModalType: EnumStyleModalType.Bottom,
//   data
// })

export const showLoading = () => {
  showSuperModal({
    contentModalType: EnumModalContentType.Loading,
    styleModalType: EnumStyleModalType.Middle,
  });
};

export const showSuperModal = (params: IShowModalParams) => {
  eventEmitter.emit("show_super_modal", params);
};

export const showWarningLogin = (message?: string) => {
  showSuperModal({
    contentModalType: EnumModalContentType.Confirm,
    styleModalType: EnumStyleModalType.Middle,
    data: {
      title: message || translations.login.requireLogin,
      cb: () => NavigationService.navigate(SCREENS.LOGIN_PAGE),
    },
  });
};
interface IModalByTypeData {
  type: string;
  data: any;
  isDetail?: boolean;
}

export const showSuperModalByType = ({
  type,
  data,
  isDetail = false,
}: IModalByTypeData) => {
  eventEmitter.emit("show_bottom_modal", { type, data, isDetail });
};

export const showToast = (res: ToastProps) => {
  Toast.show({
    type: res.type || "success",
    text1: res.message || translations.error.unknown,
    text2: res.title,
  });
};

export const closeSuperModal = () => {
  eventEmitter.emit("close_super_modal");
};
