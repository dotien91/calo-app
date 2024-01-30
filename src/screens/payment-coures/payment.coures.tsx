import React, { useState, useMemo } from "react";
import { useTheme } from "@react-navigation/native";
// import CS from "@theme/styles";

import createStyles from "./payment.coures.style";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import Header from "@shared-components/header/Header";
// import FastImage from "react-native-fast-image";
import { PaymentMethod } from "constants/chat.constant";
import { translations } from "@localization";
const PaymentCoures = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.Init,
  );
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const listFormTime = [
    {
      title: translations.payment.formforLearning,
      value: "Call group",
    },
    {
      title: translations.payment.class,
      value: "01",
    },
    {
      title: translations.payment.days,
      value: "Tue, Thu",
    },
    {
      title: translations.payment.learningtime,
      value: "Call group",
    },
  ];

  const renderViewCoures = () => {
    return (
      <View style={[styles.styleViewCoures, styles.styleShawdow]}>
        <Image
          source={{
            uri: "https://ropkeyarmormuseum.com/wp-content/uploads/2023/03/All-about-Roronoa-Zoro-One-Pieces-Most-beloved-Character.jpg",
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
            IELTS Listening [MASTERCLASS]: Get Band 7+ in 2024
          </Text>
          <Text style={styles.styleMoneyContentCouresPayment}>1.500.000</Text>
        </View>
      </View>
    );
  };

  const renderFormTime = () => {
    return (
      <View style={[styles.styleMarginBottom, styles.styleShawdow]}>
        {listFormTime.map((item, index) => {
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
              <Text style={styles.styleTextValueFormTime}>{item.value}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderPromo = () => {
    return (
      <View
        style={[
          styles.styleViewProMo,
          styles.styleShawdow,
          { marginBottom: 8 },
        ]}
      >
        <Text style={[styles.styleTextBold, { marginLeft: 16 }]}>
          {translations.payment.promo}
        </Text>
        <Text style={styles.styleTextAddcode}>Add Code</Text>
      </View>
    );
  };

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
              2.000.000
            </Text>
          </View>
          <View style={styles.styleViewLine}></View>
          <View style={styles.styleViewItemPaymentDetail}>
            <Text style={styles.styleTextTitleItemPaymentDetail}>
              {translations.payment.promotion}
            </Text>
            <Text style={styles.styleTextContentItemPaymentDetail}>
              -2.000.000
            </Text>
          </View>
          <View style={styles.styleViewItemPaymentDetail}>
            <Text style={styles.styleTextBold}>
              {translations.payment.totalpayment}
            </Text>
            <Text style={styles.styleTextMoneyPaymentDetail}>1.000.000</Text>
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
          <Text style={styles.styleTextMoneyCompletePayment}>1.500.000</Text>
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

  const actionCompletePayment = () => {
    if (
      paymentMethod == PaymentMethod.SmartBanking ||
      paymentMethod == PaymentMethod.VNPay
    ) {
      console.log("");
    } else {
      setPaymentMethod(PaymentMethod.NotChoose);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header text="Checkout" />
      <ScrollView
        style={{ marginBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {renderViewCoures()}
        {renderFormTime()}
        {renderPromo()}
        {renderPaymentMethod()}
        {renderPaymentDetail()}
      </ScrollView>
      {renderViewCompletePayment()}
    </View>
  );
};
export default PaymentCoures;
