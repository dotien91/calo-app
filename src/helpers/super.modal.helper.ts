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
}

export enum EnumStyleModalType {
  Bottom = "bottom",
  Middle = "middle",
}

export interface IShowModalParams {
  contentModalType: EnumModalContentType;
  styleModalType: EnumStyleModalType;
  data: any;
}

interface ToastProps {
  type: "success" | "error" | "info";
  message: string;
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
}

export const showSuperModalByType = ({ type, data }: IModalByTypeData) => {
  eventEmitter.emit("show_bottom_modal", { type, data });
};

export const showToast = (res: ToastProps) => {
  Toast.show({
    type: res.type || "info",
    text1: res.message || "Có lỗi không xác định xảy ra!",
  });
};

export const closeSuperModal = () => {
  eventEmitter.emit("close_super_modal");
};
