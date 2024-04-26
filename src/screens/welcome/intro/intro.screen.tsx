import {
  View,
  Animated,
  FlatList,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import React, { useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import { SCREENS } from "constants";
import PageControl from "react-native-page-control";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import TextBase from "@shared-components/TextBase";
import Button from "@shared-components/button/Button";
import CS from "@theme/styles";
import { WindowWidth } from "@freakycoder/react-native-helpers";
import { _setJson } from "@services/local-storage";

export default function WellcomeScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const heightScreen = Dimensions.get("window").height;

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
      styleImageBot: { height: heightScreen - 340, width: WindowWidth },
      text1: translations.introwelcome.text11,
      text2: translations.introwelcome.text12,
    },
    {
      svg: "intro2",
      imageBottom: require("assets/images/wellcome2.png"),
      opacity: second,
      styleImageTop: { height: 304, width: 304 },
      styleImageBot: { height: heightScreen - 340, width: WindowWidth },
      text1: translations.introwelcome.text21,
      text2: translations.introwelcome.text22,
    },
    {
      svg: "intro3",
      imageBottom: require("assets/images/wellcome3.png"),
      opacity: third,
      styleImageTop: { height: 230, width: 335 },
      styleImageBot: { height: heightScreen - 300, width: WindowWidth },
      text1: translations.introwelcome.text31,
      text2: translations.introwelcome.text32,
    },
    {
      svg: "intro4",
      imageBottom: require("assets/images/wellcome4.png"),
      opacity: fourth,
      styleImageTop: { height: 304, width: 304 },
      styleImageBot: { height: heightScreen - 340, width: WindowWidth },
      text1: translations.introwelcome.text41,
      text2: translations.introwelcome.text42,
    },
    {
      svg: "intro5",
      imageBottom: require("assets/images/wellcome5.png"),
      opacity: fifth,
      styleImageTop: { height: 304, width: 304 },
      styleImageBot: { height: heightScreen - 340, width: WindowWidth },
      text1: translations.introwelcome.text51,
      text2: translations.introwelcome.text52,
    },
  ];

  const nextRight = () => {
    if (currentPage >= dataScreen.length - 1) {
      NavigationService.replace(SCREENS.TABS);
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
      <View style={styles.containerItem}>
        <View style={styles.viewImage}>
          <ImageBackground
            key={index}
            source={item.imageBottom}
            resizeMethod="resize"
            style={styles.image}
            borderRadius={8}
          />
        </View>
        <View style={styles.viewText}>
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
    <SafeAreaView style={CS.safeAreaView}>
      <FlatList
        ref={scrollViewRef}
        // scrollEnabled={false}
        style={styles.flatList}
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
      <View style={styles.viewPage}>
        <PageControl
          style={styles.pageControl}
          numberOfPages={5}
          currentPage={currentPage}
          hidesForSinglePage
          pageIndicatorTintColor={colors.grey4}
          currentPageIndicatorTintColor={colors.btnRedPrimary}
          indicatorStyle={{ borderRadius: 5 }}
          currentIndicatorStyle={{ borderRadius: 24, width: 24, height: 8 }}
          indicatorSize={{ width: 8, height: 8 }}
        />
        <Button
          style={styles.button}
          text={translations.continue}
          backgroundColor={palette.primary}
          textColor={palette.white}
          onPress={nextRight}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  pageControl: {
    height: 54,
    width: WindowWidth - 32,
  },
  flatList: {
    marginTop: "15%",
    maxHeight: "70%",
  },
  viewPage: {
    alignItems: "center",
    marginHorizontal: 16,
    flex: 1,
  },
  viewText: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
  },
  containerItem: {
    width: WindowWidth,
    flex: 1,
  },
  viewImage: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  image: {
    width: WindowWidth - 32,
    height: 256,
  },
});
