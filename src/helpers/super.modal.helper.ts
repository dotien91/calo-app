import cmStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { ViewStyle } from "react-native";
import { translations } from "@localization";
import eventEmitter from "@services/event-emitter";

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
  cb?: () => void;
}

export const typePopup = {
  confirmPopup: "CONFIRM_POPup",
};

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
    if (!btn) return { data };
    return { data: [...data, btn] };
  },
  getContentConfirmPopup({ title, desc, btn, cb }: ContentBasicPopupType) {
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
    return { type: typePopup.confirmPopup, data: [...data, btn], cb };
  },
};

export const showSuperModal = (params: ContentBasicPopupType) => {
  eventEmitter.emit(
    "show_super_modal",
    SuperModalHelper.getContentPopupNormal(params),
  );
};

export const showConfirmSuperModal = (params: ContentBasicPopupType) => {
  eventEmitter.emit(
    "show_super_modal",
    SuperModalHelper.getContentConfirmPopup(params),
  );
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

export const showLoading = () => {
  eventEmitter.emit("show_super_modal", { showLoading: true });
};

export const closeSuperModal = () => {
  eventEmitter.emit("close_super_modal");
};
