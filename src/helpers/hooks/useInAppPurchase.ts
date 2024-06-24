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
import { priceIdsLiveStream, subscriptionIds } from "constants/iap.constant";
import { isAndroid } from "@helpers/device.info.helper";
import useStore from "@services/zustand/store";
import { Platform } from "react-native";
import { getUserSuscription } from "@services/api/user.api";

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
  } = useIAP();
  const typeBuy = useRef<"subscription" | "product" | "">("");
  const callback = useRef<() => void | undefined>();
  const local_order_id = useRef("");
  const setExtraUserData = useStore((state) => state.setExtraUserData);
  const userData = useStore((state) => state.userData);

  console.log("subscriptions22222", subscriptions);

  useEffect(() => {
    setExtraUserData({ subscriptions });
  }, [subscriptions]);

  useEffect(() => {
    console.log("currentPurchase", currentPurchase);
    const checkCurrentPurchase = async () => {
      try {
        // alert(JSON.stringify(currentPurchase))
        if (
          (isIosStorekit2() && currentPurchase?.transactionId) ||
          currentPurchase?.transactionReceipt
        ) {
          const currentProductPurchaseType = _getJson(
            "current_product_purchase_type",
          );
          const currentProductType = _getJson("current_product_type");

          const paramsFinishTransaction = {
            purchase: currentPurchase,
            isConsumable: isIOS || currentProductPurchaseType == "product",
            ...(Platform.OS === "android"
              ? { developerPayloadAndroid: "" }
              : {}),
          };
          await finishTransaction(paramsFinishTransaction);
          await getAvailablePurchases();
          const data = {
            order_id: isIOS
              ? currentPurchase.transactionId
              : JSON.parse(currentPurchase?.dataAndroid)?.orderId,
            local_order_id: local_order_id.current,
            product_id: currentPurchase.productId,
            purchase_time: currentPurchase.transactionDate + "",
            quantity: "1",
            package_name: isAndroid()
              ? "com.ikigroup.ikigaiextra"
              : "com.ikigroup.ikicoach",
            type: currentProductPurchaseType,
            purchase_token: isIOS
              ? currentPurchase.transactionReceipt
              : currentPurchase.purchaseToken,
          };

          if (
            currentProductPurchaseType === "product" ||
            currentProductPurchaseType === "subscription"
          ) {
            requestIapBackend(data).then((res) => {
              closeSuperModal();
              if (!res.isError) {
                showToast({
                  type: "success",
                  message: translations.payment.completecheckout,
                });
                if (currentProductType == "livestream") {
                  NavigationService.popToTop();
                  NavigationService.navigate(SCREENS.VIEW_LIVE_STREAM, {
                    liveStreamId: _getJson("current_product_id"),
                  });
                  eventEmitter.emit("refresh_livestream_preview");
                  eventEmitter.emit("reload_list_stream");
                } else if (currentProductType == "subscription") {
                  alert("subscribe success");
                  getUserSuscription(userData?._id).then((res) => {
                    console.log("ressss userSub", userData?._id, res.data);
                    if (!res.isError) {
                      setExtraUserData({
                        user_subscription: res.data,
                      });
                    }
                  });
                } else {
                  NavigationService.navigate(SCREENS.MY_COURES);
                  getUserSuscription(userData?._id).then((res) => {
                    console.log("ressss userSub", userData?._id, res.data);
                    if (!res.isError) {
                      setExtraUserData({
                        user_subscription: res.data,
                      });
                    }
                  });
                }
                _setJson("current_product_purchase_type", "");
                _setJson("current_product_id", "");
                _setJson("current_product_type", "");
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
      console.log("priceIdsLiveStreampriceIdsLiveStream", priceIdsLiveStream);
      const livestreamIds = priceIdsLiveStream
        .filter((item) => !!item.id)
        .map((item) => item.id);
      if (productIds.length > 0 || !!priceIdsLiveStream.length) {
        await getProducts({ skus: [...productIds, ...livestreamIds] });
      }
      console.log("subscriptionIds", subscriptionIds());
      if (subscriptionIds()?.length > 0) {
        await getSubscriptions({
          skus: subscriptionIds().map((item) => item.id),
        });
      }
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

  const buySubscription = async ({ pac, cb, data, offerToken }) => {
    if (!isAndroid()) {
      await clearTransactionIOS();
    }
    callback.current = cb;
    _setJson("current_product_type", "podcast");
    _setJson("current_product_purchase_type", "subscription");
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
    console.log("orderDataorderData", orderData);
    if (!orderData) return;
    // typeProduct.current = typeProduct;
    // local_id.current = local_id;
    _setJson("current_product_purchase_type", typePurchase);
    _setJson("current_product_id", local_id);
    _setJson("current_product_type", typeProduct);

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
