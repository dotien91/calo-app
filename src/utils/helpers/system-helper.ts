export const useCallApi = () => {
  const dispatch = useAppDispatch();

  const useCall = async ({
    dispatchFunction,
    params,
    messageSuccess = "",
    showMessageFailed = true,
    actionSuccess = undefined,
    showLoading = true,
    hideLoading = true,
    messageFailed,
    actionFailed,
  }: TypedCallApi) => {
    if (showLoading) {
      // GlobalPopupHelper.showLoading()
      // show Loading
    }
    const res = await dispatch(dispatchFunction?.(params));
    console.log("res data call api", res);
    if (hideLoading) {
      // GlobalPopupHelper.hideLoading()
      // hide Loading
    }
    if (res.payload?.data) {
      if (actionSuccess) {
        actionSuccess?.(res.payload.data);
      }
      if (messageSuccess) {
        GlobalPopupHelper.alert({
          type: "success",
          message: messageSuccess,
        });
      }
      return;
    }

    const message = Array.isArray(res.error?.message)
      ? res.error?.message?.[0]
      : res.error?.message || languages.somethingWentWrong;
    if (showMessageFailed) {
      console.log("Call api failed", message, params);
      GlobalPopupHelper.alert({
        type: "error",
        message: messageFailed || message,
      });
    }
    actionFailed?.(message);
  };

  const useCallService = async ({
    functionService,
    params,
    messageSuccess = "",
    showMessageFailed = true,
    actionSuccess = undefined,
    showLoading = true,
    hideLoading = true,
    actionFailed,
  }: TypedCallApi) => {
    try {
      if (showLoading) {
        GlobalPopupHelper.showLoading();
      }
      const res = await functionService?.(params);
      if (hideLoading) {
        GlobalPopupHelper.hideLoading();
      }
      console.log("response", res);

      if (res) {
        if (actionSuccess) {
          actionSuccess?.(res);
        }
        if (messageSuccess) {
          GlobalPopupHelper.alert({
            type: "success",
            message: messageSuccess,
          });
        }
        return;
      }
      actionFailed?.("Network Error");
    } catch (error: any) {
      GlobalPopupHelper.hideLoading();
      const messages = error?.response?.data?.message;
      const message = Array.isArray(messages)
        ? messages?.[0]
        : messages || languages.somethingWentWrong;
      if (showMessageFailed) {
        console.log("Call api failed", message, params);
        GlobalPopupHelper.alert({
          type: "error",
          message,
        });
      }
      actionFailed?.(message);
    }
  };

  return { useCall, useCallService };
};
