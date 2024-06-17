import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import CS from "@theme/styles";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import PressableBtn from "@shared-components/button/PressableBtn";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import useStore from "@services/zustand/store";
import AffiliateStatisticalView from "./affiliate.statistical.view";
import AffiliateHeader2 from "@screens/affiliate//components/affiliate.header";

const AffiliateShortcut = () => {
  const userData = useStore((state) => state.userData);

  const ItemAff = ({
    link,
    title,
    onPress,
  }: {
    link: any;
    title: string;
    onPress: () => void;
  }) => {
    return (
      <PressableBtn onPress={onPress} style={styles.item}>
        <View style={styles.viewImage}>
          {link && <Image style={styles.image} source={link} />}
        </View>
        <Text style={styles.text}>{title}</Text>
      </PressableBtn>
    );
  };

  const onPressSaleCourse = () => {
    NavigationService.navigate(SCREENS.COURSE_TAB);
  };
  const navigateAffiliate = () => {
    NavigationService.navigate(SCREENS.AFFILIATE);
  };
  const navigateWidthDraw = () => {
    NavigationService.navigate(SCREENS.WITHDRAW);
  };
  const showReferrer = () => {
    NavigationService.navigate(SCREENS.CODE_ACTIVATIONS_SCREEN);
  };

  // const _getReferralMe = () => {
  //   getReferralMe({}).then((res) => {
  //     setReferralMe(res.data);
  //   });
  // };

  const listAffiliate = [
    {
      title: translations.affiliate.saleCourse,
      image: require("assets/images/shopping-cart.png"),
      onPress: onPressSaleCourse,
    },
    {
      title: translations.affiliate.aff,
      image: require("assets/images/money.png"),
      onPress: navigateAffiliate,
    },
    {
      title: translations.affiliate.moneyOut,
      image: require("assets/images/payment.png"),
      onPress: navigateWidthDraw,
    },
    {
      title: translations.affiliate.referal,
      image: require("assets/images/capital.png"),
      onPress: showReferrer,
    },
  ];

  if ((userData?.current_coin || 0) < 10) return null;

  return (
    <>
      <View style={{ flexDirection: "row", paddingHorizontal: 16, gap: 8 }}>
        {listAffiliate.map((item, index) => {
          return (
            <ItemAff
              key={index}
              link={item.image}
              onPress={item.onPress}
              title={item.title}
            />
          );
        })}
      </View>
      <AffiliateHeader2 fromHomepage />
      <AffiliateStatisticalView fromHomepage />
    </>
  );
};

export default React.memo(AffiliateShortcut);

const styles = StyleSheet.create({
  item: {
    width: (SCREEN_WIDTH - 56) / 4,
  },
  viewImage: {
    width: (SCREEN_WIDTH - 56) / 4,
    height: (SCREEN_WIDTH - 56) / 4,
    borderRadius: 8,
    backgroundColor: palette.borderColor,
    ...CS.center,
  },
  image: {
    width: (SCREEN_WIDTH - 56) / 6,
    height: (SCREEN_WIDTH - 56) / 6,
  },
  text: {
    ...CS.hnRegular,
    fontSize: 14,
    color: palette.textOpacity8,
    marginTop: 4,
    textAlign: "center",
  },
});
