import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import ListCodeActive from "@shared-components/code-active/list.code.active";
import InviteCode from "@shared-components/code-share/code.invite.share";
import { palette } from "@theme/themes";
import TextBase from "@shared-components/TextBase";
import { EnumColors } from "models";
import IconSvg from "assets/svg";
import PressableBtn from "@shared-components/button/PressableBtn";
import formatMoney from "@shared-components/input-money/format.money";
import useStore from "@services/zustand/store";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";

const HomeAffilite = () => {
  const dataText = [
    {
      flag: <IconSvg name="icMarkDone" color={palette.greenChart} size={20} />,
      label: translations.affiliate.text1,
    },
    {
      flag: <IconSvg name="icMarkDone" color={palette.greenChart} size={20} />,
      label: translations.affiliate.text2,
    },
    {
      flag: <IconSvg name="icMarkDone" color={palette.greenChart} size={20} />,
      label: translations.affiliate.text3,
    },
    {
      flag: <IconSvg name="icMarkDone" color={palette.greenChart} size={20} />,
      label: translations.affiliate.text4,
    },
  ];
  const userInfo = useStore((state) => state.userInfo);

  const handleSelect = () => {
    NavigationService.navigate(SCREENS.AFFILIATE);
  };

  return (
    <SafeAreaView
      style={{
        ...CS.safeAreaView,
      }}
    >
      <Header text={translations.listCategory.affiliate} />
      <ScrollView>
        <View style={styles.viewImg}>
          <ImageBackground
            source={require("../../assets/images/bgintroaffilite.jpg")}
            style={styles.styleImage}
            borderRadius={8}
          >
            <PressableBtn onPress={handleSelect} style={styles.viewBtn}>
              <View>
                <TextBase
                  fontSize={14}
                  fontWeight="400"
                  color={EnumColors.white}
                >
                  {translations.affiliate.totalAmount}
                </TextBase>
                <TextBase
                  fontSize={16}
                  fontWeight="600"
                  color={EnumColors.white}
                >
                  {`${formatMoney(userInfo?.current_token || 0)} VND`}
                </TextBase>
              </View>
              <IconSvg name="icNext" size={40} color={palette.white} />
            </PressableBtn>
          </ImageBackground>
        </View>
        <View style={styles.viewText}>
          <TextBase fontSize={16} fontWeight="600" color={EnumColors.text}>
            {translations.affiliate.whyJoin}
          </TextBase>
          <View style={styles.viewTxt}>
            {dataText.map((item, index) => {
              return (
                <View key={index} style={styles.styleDes}>
                  <View>{item.flag}</View>
                  <TextBase
                    fontSize={16}
                    fontWeight="400"
                    color={EnumColors.textOpacity8}
                  >
                    {item.label}
                  </TextBase>
                </View>
              );
            })}
          </View>
        </View>
        <View style={styles.viewCommission}>
          <View style={styles.viewContent}>
            <TextBase fontSize={16} fontWeight="600" color={EnumColors.text}>
              {translations.affiliate.commission}
            </TextBase>
            <View style={styles.viewDesciption}>
              <IconSvg name="icCommission" size={48} />
              <View style={styles.viewTxtDesciption}>
                <TextBase
                  fontSize={14}
                  fontWeight="400"
                  color={EnumColors.textOpacity8}
                >
                  {translations.affiliate.description}
                  <TextBase fontWeight="700">
                    {translations.affiliate.description2}
                  </TextBase>
                  {translations.affiliate.description3}
                  <IconSvg name="icCoin" color={palette.gold} size={14} />
                </TextBase>
              </View>
            </View>
            <InviteCode />
          </View>
        </View>
        <ListCodeActive />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeAffilite;

const styles = StyleSheet.create({
  viewImg: {
    marginHorizontal: 16,
    paddingBottom: 16,
  },
  styleImage: {
    height: 202,
    width: "100%",
  },
  viewCommission: {
    marginHorizontal: 16,
    backgroundColor: palette.backgroundColorGrey,
    borderRadius: 8,
  },
  viewContent: { marginHorizontal: 16, marginVertical: 8 },
  viewDesciption: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    minHeight: 132,
    paddingTop: 8,
  },
  viewTxtDesciption: {
    paddingHorizontal: 4,
    paddingBottom: 16,
    width: "80%",
    ...CS.center,
  },
  viewText: {
    marginHorizontal: 16,
  },
  viewTxt: { paddingBottom: 16, paddingTop: 16 },
  styleDes: { flexDirection: "row", gap: 8, paddingBottom: 8 },
  viewBtn: {
    flexDirection: "row",
    marginHorizontal: 16,
    justifyContent: "space-between",
    bottom: -140,
  },
});
