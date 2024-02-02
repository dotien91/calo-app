import React, { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import { Text, TouchableOpacity, View, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

import { translations } from "@localization";
import Header from "@shared-components/header/Header";
import createStyles from "./payment.success.style";

const PaymentSuccess = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const widthScreen = Dimensions.get("window").width;

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={styles.styleViewMain}>
        <LottieView
          style={{
            height: widthScreen / 2.5,
            width: widthScreen / 2.5,
            aspectRatio: 3,
          }}
          source={require("assets/images/Check.json")}
          autoPlay
          loop
          resizeMode="cover"
        />
        <Text style={styles.styleTextPaymentSuccess}>
          {translations.payment.paymentsuccess}
        </Text>
        <Text style={styles.styleTextWhencomplete}>
          {translations.payment.completepayment}
        </Text>
        <TouchableOpacity style={styles.styleButtonGoMyLearning}>
          <Text style={styles.styleTextGomyLearning}>
            {translations.payment.gomylearning}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default PaymentSuccess;
