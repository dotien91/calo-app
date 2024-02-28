import React, { useMemo } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { useTheme } from "@react-navigation/native";

import createStyles from "./affiliate.screen.style";
import Header from "@shared-components/header/Header";
import Button from "@shared-components/button/Button";
import { translations } from "@localization";
import CS from "@theme/styles";

const AffiliatePage = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  // const dataCourse = [
  //   {
  //     image: "",
  //     title: "IELTS Listening [MASTERCLASS]: Get Band 7+ in 2024",
  //     price: "1.500.000đ",
  //     customer: "Hoang Quan Nguyen",
  //   },
  //   {
  //     image: "",
  //     title: "IELTS Listening [MASTERCLASS]: Get Band 8+ in 2024",
  //     price: "1.500.000đ",
  //     customer: "Hoang Quan Nguyen",
  //   },
  //   {
  //     image: "",
  //     title: "IELTS Listening [MASTERCLASS]: Get Band 9+ in 2024",
  //     price: "1.500.000đ",
  //     customer: "Hoang Quan Nguyen",
  //   },
  // ]

  const renderViewTotalAffiliate = () => {
    return (
      <View style={styles.styleViewTotalAff}>
        <View style={styles.styleTotalToday}>
          <ImageBackground
            source={}
            resizeMode="cover"
            style={styles.styleImageBg2}
          >
            <Text>Today</Text>
            <Text>2.500 IHC</Text>
          </ImageBackground>
        </View>
        <View style={styles.styleViewLine}>
          <View style={styles.styleViewTotal}>
            <View>
              <Text>This month</Text>
              <Text>4.500 IHC</Text>
            </View>
            <Icon name="" type={IconType.Ionicons} />
          </View>
          <View>
            <View style={styles.styleViewTotal}>
              <Text>Last month</Text>
              <Text>5.500 IHC</Text>
            </View>
            <Icon name="" type={IconType.Ionicons} />
          </View>
        </View>
      </View>
    );
  };

  const renderButtonSelected = () => {
    return (
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Button
          style={styles.styleButton}
          text={translations.affiliate.date}
          backgroundColor={colors.gray}
          textColor={colors.white}
          // onPress={handleSubmit(onSubmit)}
        />
      </View>
    );
  };

  return (
    <View style={CS.safeAreaView}>
      <Header text="Your Income" />
      <ScrollView
        style={{ marginBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {renderViewTotalAffiliate()}
        {renderButtonSelected()}
      </ScrollView>
    </View>
  );
};

export default AffiliatePage;
