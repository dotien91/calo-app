import {
  View,
  Animated,
  FlatList,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import { SCREENS } from "constants";
import { _setJson } from "@services/local-storage";
import PageControl from "react-native-page-control";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import TextBase from "@shared-components/TextBase";
import Button from "@shared-components/button/Button";

export default function WellcomeScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const heightScreen = Dimensions.get("window").height;
  const widthScreen = Dimensions.get("window").width;

  const [currentPage, setcurrentPage] = useState(0);

  const first = useRef(new Animated.Value(0)).current;
  const second = useRef(new Animated.Value(0)).current;
  const third = useRef(new Animated.Value(0)).current;
  const fourth = useRef(new Animated.Value(0)).current;
  const fifth = useRef(new Animated.Value(0)).current;

  const scrollViewRef = React.useRef(null);

  const heightIcon =
    (heightScreen / 5) * 2 > 304 ? 304 : (heightScreen / 5) * 2;

  const dataScreen = [
    {
      imageBottom: require("assets/images/wellcome1.png"),
      opacity: first,
      styleImageTop: { height: heightIcon, width: 304 },
      styleImageBot: { height: heightScreen - 340, width: widthScreen },
      text1: translations.introwelcome.text11,
      text2: translations.introwelcome.text12,
    },
    {
      svg: "intro2",
      imageBottom: require("assets/images/wellcome2.png"),
      opacity: second,
      styleImageTop: { height: 304, width: 304 },
      styleImageBot: { height: heightScreen - 340, width: widthScreen },
      text1: translations.introwelcome.text21,
      text2: translations.introwelcome.text22,
    },
    {
      svg: "intro3",
      imageBottom: require("assets/images/wellcome3.png"),
      opacity: third,
      styleImageTop: { height: 230, width: 335 },
      styleImageBot: { height: heightScreen - 300, width: widthScreen },
      text1: translations.introwelcome.text31,
      text2: translations.introwelcome.text32,
    },
    {
      svg: "intro4",
      imageBottom: require("assets/images/wellcome4.png"),
      opacity: fourth,
      styleImageTop: { height: 304, width: 304 },
      styleImageBot: { height: heightScreen - 340, width: widthScreen },
      text1: translations.introwelcome.text41,
      text2: translations.introwelcome.text42,
    },
    {
      svg: "intro5",
      imageBottom: require("assets/images/wellcome5.png"),
      opacity: fifth,
      styleImageTop: { height: 304, width: 304 },
      styleImageBot: { height: heightScreen - 340, width: widthScreen },
      text1: translations.introwelcome.text51,
      text2: translations.introwelcome.text52,
    },
  ];

  const nextRight = () => {
    // animate2()
    if (currentPage > 3) {
      NavigationService.navigate(SCREENS.HOME_TAB, {
        screen: SCREENS.HOME_TAB,
      });
      _setJson("is_first_open_app", true);
    } else {
      const newPage = currentPage + 1;
      setcurrentPage(newPage);
      scrollViewRef?.current?.scrollToOffset({
        offset: newPage * Dimensions.get("window").width,
        animated: true,
      });
    }
  };
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View
        style={{
          width: widthScreen,
          marginTop: 124,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <ImageBackground
            key={index}
            source={item.imageBottom}
            resizeMethod="resize"
            style={{
              width: widthScreen - 32,
              height: 256,
            }}
            borderRadius={8}
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            marginHorizontal: 16,
          }}
        >
          <TextBase
            fontSize={24}
            fontWeight="700"
            color={palette.text}
            style={{ textAlign: "center" }}
            numberOfLines={2}
          >
            {item.text1}
          </TextBase>
          <TextBase
            fontSize={16}
            fontWeight="400"
            color={palette.textOpacity8}
            style={{ textAlign: "center" }}
            numberOfLines={4}
          >
            {item.text2}
          </TextBase>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={scrollViewRef}
        // scrollEnabled={false}
        data={dataScreen}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        pagingEnabled
        horizontal
        onMomentumScrollEnd={(ev) => {
          setcurrentPage(
            Math.round(
              ev.nativeEvent.contentOffset.x / Dimensions.get("window").width,
            ),
          );
        }}
      />
      <View
        style={{
          position: "absolute",
          alignItems: "center",
          bottom: 30,
          marginBottom: 88,
          marginHorizontal: 16,
        }}
      >
        <PageControl
          style={{
            height: 54,
            width: widthScreen - 32,
          }}
          numberOfPages={5}
          currentPage={currentPage}
          hidesForSinglePage
          pageIndicatorTintColor={colors.grey1}
          currentPageIndicatorTintColor={colors.btnRedPrimary}
          indicatorStyle={{ borderRadius: 5 }}
          currentIndicatorStyle={{ borderRadius: 24, width: 24, height: 8 }}
          indicatorSize={{ width: 8, height: 8 }}
        />
        <Button
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
          }}
          text={translations.continue}
          backgroundColor={palette.primary}
          textColor={palette.white}
          onPress={nextRight}
        />
      </View>
    </View>
  );
}
