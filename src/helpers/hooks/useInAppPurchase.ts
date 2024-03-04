import { useEffect, useRef } from "react";

import { PurchaseError, isIosStorekit2, useIAP } from "react-native-iap";

import { Device } from "@utils/device.ui.utils";

export const useInAppPurchase = () => {
  const {
    finishTransaction,
    currentPurchase,
    // getSubscriptions,
    subscriptions,
    requestSubscription,
    products,
    getProducts,
    getAvailablePurchases,
    availablePurchases,
    requestPurchase,
    initConnectionError,
  } = useIAP();
  const typeBuy = useRef<"subscription" | "product" | "">("");
  const callOneTime = useRef(true);
  const callback = useRef();

  useEffect(() => {
    const checkCurrentPurchase = async () => {
      try {
        // GlobalPopupHelper.hideLoading();
        if (
          (isIosStorekit2() && currentPurchase?.transactionId) ||
          (currentPurchase?.transactionReceipt && callOneTime.current)
        ) {
          await finishTransaction({
            purchase: currentPurchase,
            isConsumable: Device.isIos || typeBuy.current === "product",
          });
          callOneTime.current = false;
          //   logEventAnalytics("user_purchased");

          await getAvailablePurchases();
          if (typeBuy.current === "subscription") {
            // dispatch(setIsPremium(true));
            // navigationHelper.replace(NAVIGATION_PREMIUM_SUCCESS_SCREEN);
          }
          if (typeBuy.current === "product") {
            callback.current?.();
          }

          return;
        }
      } catch (error) {
        try {
          await getAvailablePurchases();
        } catch (error) {
          console.log("error", error);
        }

        if (error instanceof PurchaseError) {
          //   GlobalPopupHelper.alert({
          //     type: "error",
          //     message: error.message
          //   });
        } else {
          //   GlobalPopupHelper.alert({
          //     type: "error",
          //     message: error?.toString()
          //   });
        }
      }
    };

    checkCurrentPurchase();
  }, [currentPurchase, finishTransaction]);

  useEffect(() => {
    console.log("initConnectionError", initConnectionError);
  }, [initConnectionError]);

  const initIAP = async () => {
    const productIds = ["coursetiertest"];

    const products = await getProducts({ skus: productIds });
    // const availablePurchases =   await getAvailablePurchases();
    console.log("products iap======", products);
  };

  const buySubscription = async (pac, cb) => {
    callback.current = cb;
    typeBuy.current = "subscription";
    if (Device.isIos) {
      //   GlobalPopupHelper.showLoading(false);
    }
    try {
      const offerToken: string | undefined = pac?.subscriptionOfferDetails
        ? pac.subscriptionOfferDetails.find((i) => !!i.offerId)?.offerToken ||
          pac?.subscriptionOfferDetails[0]?.offerToken
        : undefined;
      await requestSubscription({
        sku: pac?.productId,
        ...(offerToken && {
          subscriptionOffers: [{ sku: pac?.productId, offerToken }],
        }),
      });
    } catch (error: any) {
      //   GlobalPopupHelper.hideLoading();
      console.log("request subcription error", error);
    }
  };

  const buyProduct = async (productId, cb) => {
    callback.current = cb;
    typeBuy.current = "product";
    if (Device.isIos) {
      //   GlobalPopupHelper.showLoading(false);
    }
    try {
      await requestPurchase({ sku: productId });
    } catch (error) {
      //   GlobalPopupHelper.hideLoading();
      console.log("requestPurchase error", error);
    }
  };

  return {
    buySubscription,
    buyProduct,
    subscriptions,
    initIAP,
    products,
    getAvailablePurchases,
    availablePurchases,
  };
};
