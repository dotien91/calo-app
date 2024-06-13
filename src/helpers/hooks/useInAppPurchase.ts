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
  endConnection,
  clearTransactionIOS,
  flushFailedPurchasesCachedAsPendingAndroid,
} from "react-native-iap";
import { SCREENS } from "constants";
import { _getJson, _setJson } from "@services/local-storage";
import { subscriptionIds } from "constants/iap.constant";
import { isAndroid } from "@helpers/device.info.helper";
import useStore from "@services/zustand/store";

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
    getSubscriptions,
    requestSubscription,
    purchaseHistory,
  } = useIAP();
  const typeBuy = useRef<"subscription" | "product" | "">("");
  const callback = useRef<() => void | undefined>();
  const local_order_id = useRef("");
  const setExtraUserData = useStore((state) => state.setExtraUserData);

  console.log("subscriptions", subscriptions, {
    subscriptions,
    availablePurchases,
    purchaseHistory,
  });

  useEffect(() => {
    alert(JSON.stringify(subscriptions));
    setExtraUserData({ subscriptions });
  }, [subscriptions]);

  useEffect(() => {
    console.log("currentPurchase", currentPurchase);
    const checkCurrentPurchase = async () => {
      try {
        if (
          (isIosStorekit2() && currentPurchase?.transactionId) ||
          currentPurchase?.transactionReceipt
        ) {
          await finishTransaction({
            purchase: currentPurchase,
            isConsumable:
              isIOS || _getJson("current_product_type") == "product",
          });
          await getAvailablePurchases();
          const data = {
            order_id: isIOS
              ? currentPurchase.transactionId
              : JSON.parse(currentPurchase?.dataAndroid)?.orderId,
            local_order_id: local_order_id.current,
            product_id: currentPurchase.productId,
            purchase_time: currentPurchase.transactionDate + "",
            quantity: "1",
            package_name: "com.ikigroup.ikicoach",
            purchase_token: isIOS
              ? currentPurchase.transactionReceipt
              : currentPurchase.purchaseToken,
          };
          if (
            _getJson("current_product_type") === "product" ||
            _getJson("current_product_type") === "subscription"
          ) {
            const currentProductPurchaseType = _getJson(
              "current_product_purchase_type",
            );
            requestIapBackend(data).then((res) => {
              closeSuperModal();
              if (!res.isError) {
                showToast({
                  type: "success",
                  message: translations.payment.completecheckout,
                });
                if (currentProductPurchaseType == "livestream") {
                  NavigationService.popToTop();
                  NavigationService.navigate(SCREENS.VIEW_LIVE_STREAM, {
                    liveStreamId: _getJson("current_product_id"),
                  });
                  eventEmitter.emit("refresh_livestream_preview");
                  eventEmitter.emit("reload_list_stream");
                } else if (currentProductPurchaseType == "subscription") {
                  alert("subscribe success");
                } else {
                  NavigationService.navigate(SCREENS.MY_COURES);
                }
                _setJson("current_product_purchase_type", "");
                _setJson("current_product_id", "");
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
    eventEmitter.on("emit_buy_subscription", buySubscription);

    return () => {
      eventEmitter.off("emit_buy_product", buyProduct);
      eventEmitter.on("emit_buy_subscription", buySubscription);
      endConnection();
    };
  }, []);

  const initIAP = async (productIds?: string[]) => {
    try {
      await initConnection();
      isAndroid() && (await flushFailedPurchasesCachedAsPendingAndroid());
      if (productIds.length > 0) {
        await getProducts({ skus: productIds });
      }
      if (subscriptionIds.length > 0) {
        await getSubscriptions({
          skus: subscriptionIds.map((item) => item.id),
        });
      }
      // await getAvailablePurchases();
      // await getAvailablePurchases();
    } catch (error) {
      console.log("error initIAP", error);
    }
  };

  const createOrder = async (data) => {
    return createVnpayUrl(data).then(async (res) => {
      console.log("ress", res);
      if (!res.isError) {
        local_order_id.current = res.data?._id;
        return res.data?._id;
      } else {
        closeSuperModal();
        return null;
      }
    });
  };

  const buySubscription = async ({
    pac,
    cb,
    typePurchase,
    data,
    offerToken,
  }) => {
    if (!isAndroid()) {
      await clearTransactionIOS();
    }
    callback.current = cb;
    _setJson("current_product_type", typePurchase);
    const orderData = await createOrder(data);
    if (!orderData) {
      showToast({
        type: "error",
      });
      return;
    }
    try {
      await requestSubscription({
        sku: pac?.productId,
        ...(isAndroid() &&
          offerToken && {
            subscriptionOffers: [{ sku: pac?.productId, offerToken }],
          }),
      });
    } catch (error: any) {
      closeSuperModal();
      console.log("request subcription error", error);
    }
  };

  const buyProduct = async ({
    productId,
    cb,
    data,
    typeProduct,
    local_id,
    typePurchase = "product",
  }) => {
    callback.current = cb;
    typeBuy.current = typeProduct;
    const orderData = await createOrder(data);
    if (!orderData) return;
    // typeProduct.current = typeProduct;
    // local_id.current = local_id;
    _setJson("current_product_purchase_type", typeProduct);
    _setJson("current_product_id", local_id);
    _setJson("current_product_type", typePurchase);

    try {
      if (isIOS) {
        await requestPurchase({ sku: productId });
      } else {
        await requestPurchase({ skus: [productId] });
      }
    } catch (error) {
      console.log(22222, error);
      closeSuperModal();
      showToast({
        type: "error",
      });
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
