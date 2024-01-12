import * as NavigationService from "react-navigation-helpers";

import { SCREENS } from "constants";
import { showConfirmSuperModal } from "@helpers/super.modal.helper";
import { translations } from "@localization";

export const showWarningLogin = (message?: string) => {
  showConfirmSuperModal({
    title: message || translations.login.requireLogin,
    cb: () => NavigationService.navigate(SCREENS.LOGIN_PAGE),
  });
};
