import cmStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { ViewStyle } from "react-native";
import { translations } from "@localization";
import eventEmitter from "@services/event-emitter";
import Toast from "react-native-toast-message";

interface IBtnStyle {
  typeError?: boolean;
  text?: string | null;
  style?: ViewStyle;
  type: "btn";
}

interface ContentBasicPopupType {
  title: string;
  desc?: string;
  btn?: IBtnStyle;
}
interface ItemMediaProps {
  url: string;
  type: string;
}

interface ContentMediaPopup {
  listLink: ItemMediaProps[];
}

interface ToastProps {
  type: "success" | "error" | "info";
  message: string;
}

export const SuperModalHelper = {
  getContentPopupNormal({ title, desc, btn }: ContentBasicPopupType) {
    const data = [
      {
        text: title,
        style: {
          fontSize: 20,
          lineHeight: 24,
          ...cmStyle.hnBold,
          color: palette.text,
          textAlign: "center",
          marginBottom: 12,
        },
      },
      {
        text: desc,
        style: {
          fontSize: 16,
          lineHeight: 18,
          ...cmStyle.hnRegular,
          color: palette.text,
          textAlign: "center",
          marginBottom: 8,
        },
      },
    ];
    if (btn) {
      if (btn.typeError)
        btn = {
          ...btn,
          type: "btn",
          text: translations.approve,
          style: { backgroundColor: palette.error },
        };
    }
    if (!btn) return data;
    return [...data, btn];
  },
};

export const showSuperModal = (params: ContentBasicPopupType) => {
  eventEmitter.emit(
    "show_super_modal",
    SuperModalHelper.getContentPopupNormal(params),
  );
};
export const showDetailImageView = (
  listLink: ContentMediaPopup,
  index: number,
  type: string,
) => {
  eventEmitter.emit("show_media", { listLink, index, type });
};

export const showErrorModal = (res: any) => {
  if (res.message) {
    showSuperModal({
      title: res.message,
      btn: { typeError: true },
    });
  } else {
    showSuperModal({
      title: translations.error.unknown,
      btn: { typeError: true },
    });
  }
};
export const showToast = (res: ToastProps) => {
  Toast.show({
    type: res.type,
    text1: res.message,
  });
};

export const showLoading = () => {
  eventEmitter.emit("show_super_modal", { showLoading: true });
};

export const closeSuperModal = () => {
  eventEmitter.emit("close_super_modal");
};
