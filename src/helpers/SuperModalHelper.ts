import cmStyle from "@theme/styles";
import { palette } from "@theme/themes";

import eventEmitter from "@services/event-emitter";

interface ContentBasicPopupType {
  title: string;
  desc?: string;
}

export const SuperModalHelper = {
  getContentPopupNormal({ title, desc }: ContentBasicPopupType) {
    return [
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
  },
};

export const openSuperModal = (params: ContentBasicPopupType) => {
  eventEmitter.emit(
    "show_super_modal",
    SuperModalHelper.getContentPopupNormal(params),
  );
};

export const showLoading = () => {
  eventEmitter.emit("show_super_modal", { showLoading: true });
};

export const closeSuperModal = () => {
  eventEmitter.emit("close_super_modal");
};
