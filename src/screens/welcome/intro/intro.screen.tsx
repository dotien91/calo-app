import {
  View,
  Animated,
  FlatList,
  Dimensions,
  ImageBackground,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

// import createStyles from "./intro.screen.style";
import { SCREENS } from "constants";
import { _setJson } from "@services/local-storage";
import CS from "@theme/styles";
import PageControl from "react-native-page-control";
import IconSvg from "assets/svg";
import { translations } from "@localization";

export default function IntroScreen() {
  const theme = useTheme();
  const { colors } = theme;
  // const styles = useMemo(() => createStyles(theme), [theme]);
  const heightScreen = Dimensions.get("window").height;
  const widthScreen = Dimensions.get("window").width;

  const [currentPage, setcurrentPage] = useState(0);

  const first = useRef(new Animated.Value(0)).current;
  const second = useRef(new Animated.Value(0)).current;
  const third = useRef(new Animated.Value(0)).current;

  const scrollViewRef = React.useRef(null);

  // const handleStartNow = () => {
  //   NavigationService.replace(SCREENS.CHOOSE_LANGUAGE);
  //   _setJson("is_first_open_app", true);
  // };
  const heightIcon =
    (heightScreen / 5) * 2 > 304 ? 304 : (heightScreen / 5) * 2;

  const dataScreen = [
    {
      svg: "intro1",
      imageBottom: require("assets/images/welcome1.png"),
      opacity: third,
      styleImageTop: { height: heightIcon, width: 304 },
      styleImageBot: { height: heightScreen - 340, width: widthScreen },
      text1: translations.introwelcome.text11,
      text2: translations.introwelcome.text12,
    },
    {
      svg: "intro2",
      imageBottom: require("assets/images/welcome2.png"),
      opacity: first,
      styleImageTop: { height: 304, width: 304 },
      styleImageBot: { height: heightScreen - 340, width: widthScreen },
      text1: translations.introwelcome.text21,
      text2: translations.introwelcome.text22,
    },
    {
      svg: "intro3",
      imageBottom: require("assets/images/welcome3.png"),
      opacity: second,
      styleImageTop: { height: 230, width: 335 },
      styleImageBot: { height: heightScreen - 300, width: widthScreen },
      text1: translations.introwelcome.text31,
      text2: translations.introwelcome.text32,
    },
  ];

  const nextRight = () => {
    // animate2()
    if (currentPage > 1) {
      NavigationService.navigate(SCREENS.HOME_TAB, { screen: SCREENS.HOME_TAB });
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
  console.log(widthScreen, heightScreen);
  const fontTitle = widthScreen > 375 ? 24 : 22;
  const fontDes = widthScreen > 375 ? 16 : 14;
  const fontWeightTitle = widthScreen > 375 ? "600" : "500";
  const fontWeightDes = widthScreen > 375 ? "500" : "400";

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <ImageBackground
        key={index}
        source={item.imageBottom}
        resizeMethod="resize"
        style={{
          backgroundColor: "white",
          height: heightScreen,
          width: widthScreen,
        }}
      >
        <View
          style={{
            flex: 2,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <IconSvg
            name={item.svg}
            width={item.styleImageTop.width}
            height={item.styleImageTop.height}
          />
        </View>
        <View
          style={{
            flex: 3,
            justifyContent: "flex-end",
            alignItems: "flex-start",
            paddingHorizontal: 64,
          }}
        >
          <Text
            style={{
              ...CS.hnSemiBold,
              fontSize: fontTitle,
              color: colors.white,
              fontWeight: fontWeightTitle,
              marginBottom: 4,
            }}
          >
            {item.text1}
          </Text>
          <Text
            style={{
              ...CS.hnMedium,
              fontSize: fontDes,
              fontWeight: fontWeightDes,
              color: colors.white,
            }}
          >
            {item.text2}
          </Text>
          <View style={{ marginBottom: 100 }} />
        </View>
      </ImageBackground>
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
          justifyContent: "space-between",
          flexDirection: "row",
          bottom: 30,
          height: 54,
          width: widthScreen - 32,
          marginHorizontal: 16,
        }}
      >
        <PageControl
          style={{}}
          numberOfPages={3}
          currentPage={currentPage}
          hidesForSinglePage
          pageIndicatorTintColor={colors.white}
          currentPageIndicatorTintColor={colors.btnRedPrimary}
          indicatorStyle={{ borderRadius: 5 }}
          currentIndicatorStyle={{ borderRadius: 5, width: 24, height: 8 }}
          indicatorSize={{ width: 8, height: 8 }}
        />
        <TouchableOpacity
          onPress={nextRight}
          style={{
            backgroundColor: colors.btnRedPrimary,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ ...CS.hnSemiBold, fontSize: 16, color: colors.white }}>
            {translations.gotIt}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
