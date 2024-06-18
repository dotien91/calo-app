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

const SubscriptionBtn = () => {
  const userData = useStore((state) => state.userData);
  const [loading, setLoading] = useState(false);
  const extraUserData = useStore((state) => state.extraUserData);
  const { subscription_sell } = extraUserData;
  const { isActiveSubscription } = useUserHelper();

  const planInfo = useMemo(() => {
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
          productId: subscription_sell?.price_id,
        },
        offerToken: planInfo.subscriptionOfferDetails?.[0]?.offerToken,
      });
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  if (!subscription_sell || !planInfo) return null;
  return (
    <Button
      disabled={loading}
      onPress={isActiveSubscription ? null : pressFollow}
      type={isActiveSubscription ? "outline" : "primary"}
      text={
        isActiveSubscription
          ? "Đã đăng ký thuê bao"
          : "Đăng ký " + subscription_sell?.title
      }
      subText={
        planInfo?.localizedPrice +
        "/" +
        planInfo?.subscriptionPeriodNumberIOS +
        " " +
        planInfo?.subscriptionPeriodUnitIOS
      }
    />
  );
};

export default SubscriptionBtn;
