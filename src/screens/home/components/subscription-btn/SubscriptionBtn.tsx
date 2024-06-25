import React, { useMemo, useState } from "react";

import {
  closeSuperModal,
  showLoading,
  showWarningLogin,
} from "@helpers/super.modal.helper";
import useStore from "@services/zustand/store";
import eventEmitter from "@services/event-emitter";
import { isIOS } from "@freakycoder/react-native-helpers";
import Button from "@shared-components/button/Button";
import useUserHelper from "@helpers/hooks/useUserHelper";
import { isAndroid } from "@helpers/device.info.helper";

const SubscriptionBtn = () => {
  const userData = useStore((state) => state.userData);
  const [loading, setLoading] = useState(false);
  const extraUserData = useStore((state) => state.extraUserData);
  const { subscription_sell, subscriptions } = extraUserData;
  const { isActiveSubscription } = useUserHelper();
  const planInfo = useMemo(() => {
    if (isAndroid())
      return extraUserData?.subscriptions?.[0]?.subscriptionOfferDetails?.[0]
        ?.pricingPhases?.pricingPhaseList?.[0];
    return extraUserData?.subscriptions?.[0];
  }, [extraUserData]);
  const pressFollow = () => {
    closeSuperModal();
    if (!userData) {
      showWarningLogin();
    } else {
      setLoading(true);
      showLoading();
      eventEmitter.emit("emit_buy_subscription", {
        productId: subscription_sell?.price_id,
        data: {
          payment_method: isIOS ? "apple" : "google",
          plan_objects: [
            {
              amount_of_package: "1",
              plan_id: subscription_sell.plan_id,
              type: "Subscription",
              payload: {},
            },
          ],
          local_id: subscription_sell._id,
        },
        typePurchase: "subscription",
        typeProduct: "subscription",
        cb: null,
        pac: {
          productId: extraUserData?.subscriptions?.[0].productId,
        },
        offerToken:
          extraUserData?.subscriptions?.[0]?.subscriptionOfferDetails?.[0]
            ?.offerToken,
      });
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };
  const subText = React.useMemo(() => {
    if (isAndroid()) {
      console.log("planInfo", planInfo);
      return planInfo?.formattedPrice + "/" + planInfo?.billingPeriod;
    }
    return (
      planInfo?.localizedPrice +
      "/" +
      planInfo?.subscriptionPeriodNumberIOS +
      " " +
      planInfo?.subscriptionPeriodUnitIOS
    );
  }, [planInfo]);
  if (!subscription_sell || !planInfo || !subscriptions?.length) return null;

  return (
    <Button
      disabled={loading}
      onPress={isActiveSubscription ? null : pressFollow}
      type={isActiveSubscription ? "outline" : "primary"}
      text={
        isActiveSubscription
          ? "Đã đăng ký Podcast Premium"
          : "Đăng ký " + subscription_sell?.title
      }
      subText={subText}
    />
  );
};

export default SubscriptionBtn;
