import { isIOS } from "@freakycoder/react-native-helpers";
import * as NavigationService from "react-navigation-helpers";

import { closeSuperModal, showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";
import { createVnpayUrl, requestIapBackend } from "@services/api/payment.api";
import eventEmitter from "@services/event-emitter";
import { useEffect, useRef } from "react";
// setup({ storekitMode: 'STOREKIT2_MODE' })
import {
  PurchaseError,
  initConnection,
  isIosStorekit2,
  useIAP,
} from "react-native-iap";
import { SCREENS } from "constants";

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
  const callback = useRef<() => void | undefined>();
  const local_order_id = useRef("");

  console.log(
    "products",
    products.map((item) => item.productId),
  );

  useEffect(() => {
    const checkCurrentPurchase = async () => {
      console.log("currentPurchasecurrentPurchase", currentPurchase);
      try {
        if (
          (isIosStorekit2() && currentPurchase?.transactionId) ||
          currentPurchase?.transactionReceipt
        ) {
          await finishTransaction({
            purchase: currentPurchase,
            isConsumable: isIOS || typeBuy.current === "product",
          });
          await getAvailablePurchases();
          if (typeBuy.current === "product") {
            const data = {
              order_id: isIOS
                ? currentPurchase.transactionId
                : JSON.parse(currentPurchase?.dataAndroid)?.orderId,
              local_order_id: local_order_id.current,
              product_id: currentPurchase.productId,
              purchase_time: currentPurchase.transactionDate + "",
              quantity: "1",
              package_name: "com.ikigroup.ieltshunter",
              purchase_token: isIOS
                ? currentPurchase.transactionReceipt
                : currentPurchase.purchaseToken,
            };

            requestIapBackend(data).then((res) => {
              closeSuperModal();
              if (!res.isError) {
                showToast({
                  type: "success",
                  message: translations.payment.completecheckout,
                });
                NavigationService.navigate(SCREENS.MY_COURES);
              } else {
                showToast({
                  message: res.message,
                  type: "error",
                });
              }
            });
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

  const createOrder = async (data) => {
    return createVnpayUrl(data).then(async (res) => {
      if (!res.isError) {
        local_order_id.current = res.data?._id;
        return res.data?._id;
      } else {
        closeSuperModal();
        return null;
      }
    });
  };

  const buyProduct = async ({ productId, cb, data }) => {
    console.log("11111", JSON.stringify(data));
    const orderData = await createOrder(data);
    if (!orderData) return;
    callback.current = cb;
    typeBuy.current = "product";
    try {
      if (isIOS) {
        await requestPurchase({ sku: productId });
      } else {
        await requestPurchase({ skus: [productId] });
      }
    } catch (error) {
      closeSuperModal();
      // showToast({
      //   type: "error",
      // });
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
