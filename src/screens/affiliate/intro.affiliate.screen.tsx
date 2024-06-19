import React, { useEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import ListCodeActive from "@shared-components/code-active/list.code.active";
import InviteCode from "@shared-components/code-share/code.invite.share";
import { palette } from "@theme/themes";
import TextBase from "@shared-components/TextBase";
import { EnumColors } from "models";
import IconSvg from "assets/svg";
// import PressableBtn from "@shared-components/button/PressableBtn";
// import * as NavigationService from "react-navigation-helpers";
// import { SCREENS } from "constants";
// import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import AfiliateShortcut from "./components/afiliate.shortcut";

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
  // const userInfo = useStore((state) => state.userInfo);

  // const handleSelect = () => {
  //   NavigationService.navigate(SCREENS.AFFILIATE);
  // };

  // const userData = useStore((state) => state.userData);
  // const isShowMoney =
  //   userData?.user_role === "teacher" || userData?.user_role === "admin";

  // const [commission, setCommission] = useState([]);
  // const [referralMe, setReferralMe] = useState([]);

  // const _getCommission = () => {
  //   const paramsRequest = {};
  //   getCommission(paramsRequest).then((res) => {
  //     if (!res.isError) {
  //       console.log("commission Rate====", res.data.config.data_content);

  //       setCommission(res.data.config.data_content);
  //     }
  //   });
  // };

  useEffect(() => {
    // _getCommission();
    // _getReferralMe();
  }, []);

  // const ItemAff = ({
  //   link,
  //   title,
  //   onPress,
  // }: {
  //   link: any;
  //   title: string;
  //   onPress: () => void;
  // }) => {
  //   return (
  //     <PressableBtn onPress={onPress} style={styles.item}>
  //       <View style={styles.viewImage}>
  //         {link && <Image style={styles.image} source={link} />}
  //       </View>
  //       <Text style={styles.text}>{title}</Text>
  //     </PressableBtn>
  //   );
  // };

  // const onPressSaleCourse = () => {
  //   NavigationService.navigate(SCREENS.COURSE_TAB);
  // };
  // const navigateAffiliate = () => {
  //   NavigationService.navigate(SCREENS.AFFILIATE);
  // };
  // const navigateWidthDraw = () => {
  //   NavigationService.navigate(SCREENS.WITHDRAW);
  // };
  // const showReferrer = () => {
  //   NavigationService.navigate(SCREENS.CODE_ACTIVATIONS_SCREEN);
  // };

  // const _getReferralMe = () => {
  //   getReferralMe({}).then((res) => {
  //     setReferralMe(res.data);
  //   });
  // };

  return (
    <SafeAreaView
      style={{
        ...CS.safeAreaView,
      }}
    >
      <Header text={translations.listCategory.affiliate} />
      <ScrollView>
        {/* <View style={styles.viewImg}>
          <ImageBackground
            source={require("../../assets/images/bgintroaffilite.jpg")}
            style={styles.styleImage}
            borderRadius={8}
          >
            <PressableBtn onPress={handleSelect} style={styles.viewBtn}>
              <View>
                {isShowMoney && (
                  <View>
                    <TextBase
                      fontSize={14}
                      // fontWeight="400"
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
                )}
                <View>
                  <TextBase
                    fontSize={14}
                    // fontWeight="400"
                    color={EnumColors.white}
                  >
                    {translations.affiliate.totalCoin}
                  </TextBase>
                  <TextBase
                    fontSize={16}
                    fontWeight="600"
                    color={EnumColors.white}
                  >
                    {`${formatMoney(userInfo?.current_coin || 0)} IHC`}
                  </TextBase>
                </View>
              </View>
              <IconSvg name="icNext" size={40} color={palette.white} />
            </PressableBtn>
          </ImageBackground>
        </View> */}
        <AfiliateShortcut hideStatic />
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
                    style={CS.flex1}
                  >
                    {item.label}
                  </TextBase>
                </View>
              );
            })}
          </View>
        </View>
        {/* <View style={styles.viewCommission}> */}
        <View style={styles.viewContent}>
          <TextBase fontSize={16} fontWeight="600" color={EnumColors.text}>
            {`${translations.affiliate.commissionSale}`}
          </TextBase>
          <TextBase
            fontSize={14}
            fontWeight="400"
            color={EnumColors.textOpacity8}
          >
            {translations.affiliate.desCommission}
          </TextBase>
          <TextBase fontSize={16} fontWeight="600" color={EnumColors.text}>
            {`${translations.affiliate.referalCommission}`}
          </TextBase>
          <TextBase
            fontSize={14}
            fontWeight="400"
            color={EnumColors.textOpacity8}
          >
            {translations.affiliate.desRef}
          </TextBase>
        </View>
        <InviteCode />
        {/* </View> */}
        <ListCodeActive />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeAffilite;

const styles = StyleSheet.create({
  // viewImg: {
  //   marginHorizontal: 16,
  //   paddingBottom: 16,
  // },
  // styleImage: {
  //   height: 202,
  //   width: "100%",
  //   justifyContent: "flex-end",
  //   paddingBottom: 10,
  // },
  // viewCommission: {
  //   marginHorizontal: 16,
  //   backgroundColor: palette.backgroundColorGrey,
  //   borderRadius: 8,
  // },
  viewContent: { marginHorizontal: 16, marginVertical: 8, gap: 8 },
  // viewDesciption: {
  //   flexDirection: "row",
  //   gap: 8,
  //   width: "100%",
  //   minHeight: 132,
  //   paddingTop: 8,
  // },
  // viewTxtDesciption: {
  //   paddingHorizontal: 4,
  //   paddingBottom: 16,
  //   width: "80%",
  //   ...CS.center,
  // },
  viewText: {
    marginHorizontal: 16,
  },
  viewTxt: { paddingBottom: 16, paddingTop: 16 },
  styleDes: { flexDirection: "row", gap: 8, paddingBottom: 8 },
  // viewBtn: {
  //   flexDirection: "row",
  //   marginHorizontal: 16,
  //   alignItems: "flex-end",
  //   justifyContent: "space-between",
  // },
  // item: {
  //   width: (SCREEN_WIDTH - 56) / 4,
  //   alignItems: "center",
  // },
  // viewImage: {
  //   width: (SCREEN_WIDTH - 56) / 5,
  //   height: (SCREEN_WIDTH - 56) / 5,
  //   borderRadius: 8,
  //   // backgroundColor: palette.borderColor,
  //   ...CS.center,
  // },
  // image: {
  //   width: (SCREEN_WIDTH - 56) / 5,
  //   height: (SCREEN_WIDTH - 56) / 5,
  // },
  // text: {
  //   ...CS.hnRegular,
  //   textAlign: "center",
  //   fontSize: 14,
  // },
});
