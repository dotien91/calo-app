import { isIOS } from "@freakycoder/react-native-helpers";
import { closeSuperModal, showToast } from "@helpers/super.modal.helper";
import eventEmitter from "@services/event-emitter";
import { useEffect, useRef } from "react";
// setup({ storekitMode: 'STOREKIT2_MODE' })
import {
  PurchaseError,
  initConnection,
  isIosStorekit2,
  useIAP,
} from "react-native-iap";

export const useInAppPurchase = () => {
  const {
    finishTransaction,
    currentPurchase,
    subscriptions,
    products,
    getProducts,
    getAvailablePurchases,
    availablePurchases,
    requestPurchase,
  } = useIAP();
  const typeBuy = useRef<"subscription" | "product" | "">("");
  const callOneTime = useRef(true);
  const callback = useRef<() => void | undefined>();
  console.log("products=======", { products });

  useEffect(() => {
    console.log("currentPurchasecurrentPurchase", currentPurchase);
    const checkCurrentPurchase = async () => {
      try {
        // GlobalPopupHelper.hideLoading();
        closeSuperModal();
        if (
          (isIosStorekit2() && currentPurchase?.transactionId) ||
          (currentPurchase?.transactionReceipt && callOneTime.current)
        ) {
          await finishTransaction({
            purchase: currentPurchase,
            isConsumable: isIOS || typeBuy.current === "product",
          });
          callOneTime.current = false;
          // logEventAnalytics("user_purchased");

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
        closeSuperModal();
        try {
          await getAvailablePurchases();
        } catch (error) {
          console.log("getAvailablePurchases error", error);
        }
        console.log("error", error);

        if (error instanceof PurchaseError) {
          showToast({
            type: "error",
            message: error.message,
          });
        } else {
          showToast({
            type: "error",
            message: error?.toString(),
          });
        }
      }
    };

    checkCurrentPurchase();
  }, [currentPurchase, finishTransaction]);

  useEffect(() => {
    eventEmitter.on("emit_buy_product", buyProduct);
    return () => {
      eventEmitter.off("emit_buy_product", buyProduct);
    };
  }, []);

  const initIAP = async (productIds?: string[]) => {
    try {
      await initConnection();
      if (productIds.length > 0) {
        await getProducts({ skus: productIds });
      }
      // await getAvailablePurchases();
    } catch (error) {
      console.log("error initIAP", error);
    }
  };

  const buyProduct = async ({ productId, cb }) => {
    callback.current = cb;
    typeBuy.current = "product";
    if (isIOS) {
      closeSuperModal();
    }
    try {
      if (isIOS) {
        await requestPurchase({ sku: productId });
      } else {
        await requestPurchase({ skus: [productId] });
        // callback.current?.()
      }
    } catch (error) {
      closeSuperModal();
      console.log("requestPurchase error", error);
    }
  };

  return {
    buyProduct,
    subscriptions,
    initIAP,
    products,
    getAvailablePurchases,
    availablePurchases,
  };
};
