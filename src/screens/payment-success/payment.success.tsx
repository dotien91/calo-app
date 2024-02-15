import React, { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView,
} from "react-native";
import LottieView from "lottie-react-native";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import createStyles from "./payment.success.style";
import { SCREENS } from "constants";
import CS from "@theme/styles";

const PaymentSuccess = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const widthScreen = Dimensions.get("window").width;

  const openMyCourse = () => {
    NavigationService.navigate(SCREENS.HOME);
    NavigationService.navigate(SCREENS.MY_COURES);
  };

  return (
    <SafeAreaView style={{ flex: 1, ...CS.flexCenter }}>
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
        <TouchableOpacity
          onPress={openMyCourse}
          style={styles.styleButtonGoMyLearning}
        >
          <Text style={styles.styleTextGomyLearning}>
            {translations.payment.gomylearning}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default PaymentSuccess;
