import React, { useState, useMemo } from "react";
// import CS from "@theme/styles";
import { useTheme, useRoute } from "@react-navigation/native";
import createStyles from "./checkout.style";
import {
  ScrollView,
  Linking,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";

import Header from "@shared-components/header/Header";
// import FastImage from "react-native-fast-image";
import { PaymentMethod } from "constants/chat.constant";
import { translations } from "@localization";
import { numberWithCommas } from "@utils/string.utils";
import { createVnpayUrl, getOrderDetail } from "@services/api/payment.api";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { EnumClassType } from "models/course.model";
import {
  getDaysFromTimepick,
  getTimeFromTimepick,
} from "@screens/course-tab/course.helper";
import CS from "@theme/styles";
import useAppStateCheck from "@helpers/hooks/useAppStateCheck";
import useStore from "@services/zustand/store";
import { SCREENS } from "constants";
import ImageLoad from "@shared-components/image-load/ImageLoad";

const CheckoutScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.Init,
  );
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute();
  const courseData = route.params?.["courseData"];
  const timePick = route.params?.["timePick"];
  const duration = route.params?.["duration"];
  const type = courseData.type;
  const isClassCourse = type == EnumClassType.CallGroup;
  const isVideoCourse = type == EnumClassType.SelfLearning;

  const countCheckPaymentSuccess = React.useRef(0);

  const [tradeId, setTradeId] = useState("");
  const { appStateStatus } = useAppStateCheck();
  const userData = useStore((state) => state.userData);

  React.useEffect(() => {
    console.log("tradeId || appStateStatus", tradeId, appStateStatus);
    if (!tradeId || appStateStatus != "active") return;
    showSuperModal({
      contentModalType: EnumModalContentType.Loading,
      styleModalType: EnumStyleModalType.Middle,
    })
    //check payment success 4 times
    const intervalCheckPaymentSuccess = setInterval(() => {
      if (countCheckPaymentSuccess.current == 4) {
        closeSuperModal()
        clearInterval(intervalCheckPaymentSuccess);
        return;
      }
      countCheckPaymentSuccess.current += 1;
      getOrderDetail(tradeId).then((res) => {
        console.log("getOrderDetail", res);
        if (!res.isError) {
          if (res.data.status == "success") {
            //alert success
            callbackPaymentSuccess();
            closeSuperModal()
            clearInterval(intervalCheckPaymentSuccess);
          }
        } else {
          //failed
        }
      });
    }, 2000);
    return () => {
      if (intervalCheckPaymentSuccess)
        closeSuperModal()
        clearInterval(intervalCheckPaymentSuccess);
    };
  }, [tradeId, appStateStatus]);

  const callbackPaymentSuccess = () => {
    NavigationService.navigate(SCREENS.PAYMENT_SUCCESS);
  };
  let listFormTime = [];
  let learningTime = "";
  let days = "";

  if (!isVideoCourse) {
    learningTime = getTimeFromTimepick(timePick, isClassCourse);

    days = getDaysFromTimepick(timePick?.course_calendars || [...timePick]);

    listFormTime = [
      {
        title: translations.payment.formforLearning,
        value: courseData.title,
      },
      {
        title: translations.purchase.timeDuration,
        value: duration + " hour",
      },
      {
        title: translations.payment.class,
        value: isClassCourse ? "01" : "",
      },
      {
        title: translations.payment.days,
        value: days,
      },
      {
        title: translations.payment.learningtime,
        value: learningTime,
      },
    ];
  }

  const renderViewCoures = () => {
    return (
      <View style={[styles.styleViewCoures, styles.styleShawdow]}>
        <ImageLoad
          isAvatar={false}
          source={{
            uri: courseData?.media_id?.media_thumbnail,
          }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 8,
            marginRight: 8,
            marginVertical: 8,
          }}
          resizeMode="cover"
        />
        <View>
          <Text style={styles.styleContentCouresPayment} numberOfLines={3}>
            {courseData?.title}
          </Text>
          <Text style={styles.styleMoneyContentCouresPayment}>
            {numberWithCommas(courseData.price)}
          </Text>
        </View>
      </View>
    );
  };

  const renderFormTime = () => {
    return (
      <View style={[styles.styleMarginBottom, styles.styleShawdow]}>
        {listFormTime.map((item, index) => {
          if (!item.value) return null;
          return (
            <View
              key={index}
              style={[
                {
                  borderBottomColor: index === 3 ? colors.white : colors.grey3,
                },
                styles.styleViewItemFormTime,
              ]}
            >
              <Text style={styles.styleTextBold}>{item.title}</Text>
              <View style={{ flex: 0.5, ...CS.flexEnd }}>
                <Text style={styles.styleTextValueFormTime}>{item.value}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  // const renderPromo = () => {
  //   return (
  //     <View
  //       style={[
  //         styles.styleViewProMo,
  //         styles.styleShawdow,
  //         { marginBottom: 8 },
  //       ]}
  //     >
  //       <Text style={[styles.styleTextBold, { marginLeft: 16 }]}>
  //         {translations.payment.promo}
  //       </Text>
  //       <Text style={styles.styleTextAddcode}>Add Code</Text>
  //     </View>
  //   );
  // };

  const renderPaymentMethod = () => {
    return (
      <View style={[styles.styleMarginBottom, styles.styleShawdow]}>
        <Text
          style={[
            styles.styleTextBold,
            styles.styleMarginVerticalpaymentMethod,
          ]}
        >
          {translations.payment.paymentmethod}
        </Text>
        {paymentMethod === PaymentMethod.NotChoose ? (
          <Text style={styles.styleTextErrorPaymentMethod}>
            {translations.payment.errorpaymentmethod}
          </Text>
        ) : (
          <></>
        )}
        <TouchableOpacity
          onPress={() => {
            setPaymentMethod(PaymentMethod.VNPay);
          }}
          style={styles.styleViewItemPayment}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{ height: 24, width: 24, marginRight: 8 }}
              source={require("assets/images/VNPayIcon.png")}
            />
            <Text style={styles.styleItemOfPaymentMethod}>
              {translations.payment.vnpay}
            </Text>
          </View>
          <View style={styles.styleTouchableRadioButton}>
            <View style={styles.styleViewCustomRadioButtom}>
              <View
                style={[
                  styles.styleViewAdotRadioButton,
                  {
                    backgroundColor:
                      paymentMethod === PaymentMethod.VNPay
                        ? colors.red
                        : colors.white,
                  },
                ]}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setPaymentMethod(PaymentMethod.SmartBanking);
          }}
          style={styles.styleViewItemPayment}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{ height: 24, width: 24, marginRight: 8 }}
              source={require("assets/images/SmartBankingIcon.png")}
            />
            <Text style={styles.styleItemOfPaymentMethod}>
              {translations.payment.smartbanking}
            </Text>
          </View>
          <View style={styles.styleTouchableRadioButton}>
            <View style={styles.styleViewCustomRadioButtom}>
              <View
                style={[
                  styles.styleViewAdotRadioButton,
                  {
                    backgroundColor:
                      paymentMethod === PaymentMethod.SmartBanking
                        ? colors.red
                        : colors.white,
                  },
                ]}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPaymentDetail = () => {
    return (
      <View
        style={[styles.styleMarginBottomPaymentDetail, styles.styleShawdow]}
      >
        <Text
          style={[
            styles.styleTextBold,
            styles.styleMarginVerticalpaymentMethod,
          ]}
        >
          {translations.payment.paymentdetail}
        </Text>
        <View style={{ justifyContent: "space-between" }}>
          <View style={styles.styleViewItemPaymentDetail}>
            <Text style={styles.styleTextTitleItemPaymentDetail}>
              {translations.payment.couresfree}
            </Text>
            <Text style={styles.styleTextContentItemPaymentDetail}>
              {numberWithCommas(courseData.price)}
            </Text>
          </View>
          <View style={styles.styleViewLine}></View>
          {/* <View style={styles.styleViewItemPaymentDetail}>
            <Text style={styles.styleTextTitleItemPaymentDetail}>
              {translations.payment.promotion}
            </Text>
            <Text style={styles.styleTextContentItemPaymentDetail}>
              -2.000.000
            </Text>
          </View> */}
          <View style={styles.styleViewItemPaymentDetail}>
            <Text style={styles.styleTextBold}>
              {translations.payment.totalpayment}
            </Text>
            <Text style={styles.styleTextMoneyPaymentDetail}>
              {numberWithCommas(courseData.price)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderViewCompletePayment = () => {
    return (
      <View style={[styles.styleViewComplete, styles.styleShawdow]}>
        <View style={styles.styleViewTitleCompletePaymentPosition}>
          <Text style={styles.styleTextTotalCompletePayment}>
            {translations.payment.totalpayment}
          </Text>
          <Text style={styles.styleTextMoneyCompletePayment}>
            {numberWithCommas(courseData.price)}đ
          </Text>
        </View>
        <TouchableOpacity
          onPress={actionCompletePayment}
          style={styles.styleButtonComplete}
        >
          <Text style={styles.styleTextCompleteCheckout}>
            {translations.payment.completecheckout}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const createOrder = () => {
    const isVnPayMethod = PaymentMethod.VNPay == paymentMethod;
    countCheckPaymentSuccess.current = 0;
    setTradeId("");
    let dataPayload = null;
    if (!isClassCourse) {
      dataPayload = {
        user_id: userData._id,
        course_id: courseData._id,
        time_pick: timePick,
      };
    } else {
      dataPayload = {
        class_id: timePick._id,
        user_id: userData._id,
      };
    }

    const data = {
      payment_method: isVnPayMethod ? "vn_pay" : "smart_banking",
      plan_objects: [
        {
          amount_of_package: "1",
          plan_id: courseData.plan_id,
          type: "course",
          payload: dataPayload,
        },
      ],
    };
    createVnpayUrl(data).then(async (res) => {
      console.log("createVnpayUrl res", { timePick, res, data });
      closeSuperModal();
      if (!res.isError) {
        const url = res.data?.redirect_url;
        const tradeId = res.data._id;
        if (isVnPayMethod) {
          Linking.openURL(url);
          setTradeId(tradeId);
        } else {
          console.log("tradeIdtradeIdtradeId", tradeId);
          NavigationService.navigate(SCREENS.SMARTBANKING, {
            tradeId,
          });
        }
      } else {
        showToast({
          type: "error",
        });
      }
    });
  };

  const actionCompletePayment = () => {
    if (
      paymentMethod == PaymentMethod.SmartBanking ||
      paymentMethod == PaymentMethod.VNPay
    ) {
      // if (paymentMethod == PaymentMethod.VNPay) {
      showSuperModal({
        contentModalType: EnumModalContentType.Loading,
        styleModalType: EnumStyleModalType.Middle,
      });
      createOrder();
      // } else {
      //   // NavigationService.navigate(SCREENS.SMARTBANKING);
      //   //smart banking
      // }
    } else {
      setPaymentMethod(PaymentMethod.NotChoose);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <Header text="Checkout" />
        <ScrollView
          style={{ marginBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {renderViewCoures()}
          <Text style={styles.note}>{translations.payment.notePurchase}</Text>
          {renderFormTime()}
          {/* {renderPromo()} */}
          {renderPaymentMethod()}
          {renderPaymentDetail()}
        </ScrollView>
        {renderViewCompletePayment()}
      </View>
    </SafeAreaView>
  );
};
export default CheckoutScreen;
