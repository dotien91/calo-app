import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

import { showLoading, showWarningLogin } from "@helpers/super.modal.helper";
import useStore from "@services/zustand/store";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { TypedUser } from "models";
import { requestListSubscriptionByUserId } from "@services/api/user.api";
import eventEmitter from "@services/event-emitter";
import { isIOS } from "@freakycoder/react-native-helpers";
import moment from "moment";

interface SubscriptionBtnProps {
  userInfo: TypedUser;
}

const SubscriptionBtn = ({ userInfo }: SubscriptionBtnProps) => {
  const userData = useStore((state) => state.userData);
  const [subscriptions, setSubscriptions] = useState([]);

  const getDayFromUnitSubscriptions = (unit, number) => {
    if (unit == "DAY") {
      return number * 1;
    } else if (unit == "WEEK") {
      return number * 7;
    } else if (unit == "MONTH") {
      return number * 30;
    } else if (unit == "YEAR") {
      return number * 365;
    } else {
      return 0;
    }
  };
  const extraUserData = useStore((store) => store.extraUserData);

  const isExpired = (findData, subscriptionInfo) => {
    console.log(findData);
    const numberUnit = Number(subscriptionInfo?.subscriptionPeriodNumberIOS);
    const days = getDayFromUnitSubscriptions(
      subscriptionInfo?.subscriptionPeriodUnitIOS,
      numberUnit,
    );
    const expiredDate = moment().add(days, "days");
    return expiredDate > new Date();
  };

  const isSubscriptionActive = (data) => {
    const { user_subscription, subscriptions } = extraUserData;
    if (!user_subscription?.length) return false;
    let findData = null;
    findData = user_subscription.find(
      (item) => item.subscription_id?._id == data._id,
    );
    const subscriptionInfo = subscriptions.find(
      (item) => item.productId == data?.price_id,
    );

    return isExpired(findData, subscriptionInfo);
  };

  const getListSubscription = () => {
    requestListSubscriptionByUserId({ user_id: userInfo._id }).then((res) => {
      console.log("requestListSubscriptionByUserId", userInfo, res.data);
      if (!res.isError) {
        setSubscriptions(res.data);
      }
    });
  };

  useEffect(() => {
    getListSubscription();
  }, []);

  const pressFollow = (data) => {
    if (!userData) {
      showWarningLogin();
    } else {
      showLoading();
      eventEmitter.emit("emit_buy_subscription", {
        productId: data?.price_id,
        data: {
          payment_method: isIOS ? "apple" : "google",
          plan_objects: [
            {
              amount_of_package: "1",
              plan_id: data.plan_id,
              type: "Subscription",
              payload: {},
            },
          ],
          local_id: data._id,
        },
        typePurchase: "subscription",
        typeProduct: "subscription",
        cb: null,
        pac: {
          productId: data?.price_id,
        },
      });
    }
  };

  if (!subscriptions.length) return null;
  return (
    <>
      {subscriptions.map((item) => {
        console.log(222222, item);
        const isFollow = isSubscriptionActive(item);
        return (
          <TouchableOpacity
            disabled={loadding}
            onPress={() => pressFollow(item)}
            key={item._id}
            style={[
              styles.bottonAction,
              isFollow ? { backgroundColor: palette.baseColor2 } : {},
            ]}
          >
            <Text style={styles.txtButton}>
              {isFollow ? "Đã đăng ký " : "Đăng ký "}
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </>
  );
};

export default SubscriptionBtn;

const styles = StyleSheet.create({
  bottonAction: {
    width: 116,
    height: 40,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: palette.mainColor2,
    ...CommonStyle.center,
  },
  txtButton: {
    ...CommonStyle.hnBold,
    fontSize: 14,
    color: palette.mainColor2,
  },
});
