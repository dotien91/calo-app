import {
  View,
  Animated,
  FlatList,
  SafeAreaView,
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
import useStore from "@services/zustand/store";
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
  const language = useStore((state) => state.language);

  const first = useRef(new Animated.Value(0)).current;
  const second = useRef(new Animated.Value(0)).current;
  const third = useRef(new Animated.Value(0)).current;

  const scrollViewRef = React.useRef(null);

  // const handleStartNow = () => {
  //   NavigationService.replace(SCREENS.CHOOSE_LANGUAGE);
  //   _setJson("is_first_open_app", true);
  // };

  const dataScreen = [
    {
      svg: "intro1",
      imageBottom: require("assets/images/welcome3.png"),
      opacity: third,
      styleImageTop: { height: 230, width: 335 },
      styleImageBot: { height: heightScreen - 340, width: widthScreen },
      text1: translations.introwelcome.text11,
      text2: translations.introwelcome.text12,
    },
    {
      svg: "intro2",
      imageBottom: require("assets/images/welcome1.png"),
      opacity: first,
      styleImageTop: { height: 304, width: 304 },
      styleImageBot: { height: heightScreen - 340, width: widthScreen },
      text1: translations.introwelcome.text21,
      text2: translations.introwelcome.text22,
    },
    {
      svg: "intro3",
      imageBottom: require("assets/images/welcome2.png"),
      opacity: second,
      styleImageTop: { height: 304, width: 304 },
      styleImageBot: { height: heightScreen - 300, width: widthScreen },
      text1: translations.introwelcome.text31,
      text2: translations.introwelcome.text32,
    },
  ];

  const nextRight = () => {
    // animate2()
    if (currentPage > 1) {
      NavigationService.navigate(SCREENS.HOME, { screen: SCREENS.HOME });
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
        key={index}
        style={{
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          height: heightScreen,
          width: widthScreen,
        }}
      >
        <View
          style={{
            height: 340,
            width: widthScreen,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconSvg name={item.svg} size={304} />
        </View>
        <ImageBackground
          source={item.imageBottom}
          style={[{ justifyContent: "center" }, item.styleImageBot]}
        >
          <View
            style={{
              marginLeft: 64,
              width: 235,
              marginBottom: language === "vi" ? 0 : 40,
            }}
          >
            <Text
              style={{
                ...CS.hnSemiBold,
                fontSize: 24,
                color: colors.white,
                marginBottom: 4,
              }}
            >
              {item.text1}
            </Text>
            <Text style={{ ...CS.hnMedium, fontSize: 16, color: colors.white }}>
              {item.text2}
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: 20 }}>
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
        ></FlatList>
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
            <Text
              style={{ ...CS.hnSemiBold, fontSize: 16, color: colors.white }}
            >
              Got it
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
