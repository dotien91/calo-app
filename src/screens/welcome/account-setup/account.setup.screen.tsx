import React, { useRef, useState } from "react";
import { Animated, Dimensions, FlatList, StyleSheet, View } from "react-native";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import * as NavigationService from "react-navigation-helpers";
import PageControl from "react-native-page-control";

import Button from "@shared-components/button/Button";
import { SCREENS } from "constants";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import SetupScreen1 from "./components/setup.screen1";
import SetupScreen2 from "./components/setup.screen2";
import SetupScreen3 from "./components/setup.screen3";
// import { showToast } from "@helpers/super.modal.helper";
import { _setJson } from "@services/local-storage";

const AccountSetupScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const first = useRef(new Animated.Value(0)).current;
  const second = useRef(new Animated.Value(0)).current;
  const third = useRef(new Animated.Value(0)).current;
  const [value, setValue] = useState();
  const [value1, setValue1] = useState<string[]>([]);
  const [value2, setValue2] = useState<string[]>([]);

  const scrollViewRef = React.useRef(null);

  const renderScreen = [
    {
      opacity: first,
      values: <SetupScreen1 onSelectedData={setValue} />,
    },
    {
      opacity: second,
      values: <SetupScreen2 onSelectedData={setValue1} />,
    },
    {
      opacity: third,
      values: <SetupScreen3 onSelectedData={setValue2} />,
    },
  ];

  const nextRight = () => {
    switch (currentPage) {
      case 0:
        animateToNextPage();
        console.log(value);
        // if (value) {
        // } else {
        //   showToast({
        //     type: "error",
        //     message: translations.setup.errorChoose,
        //   });
        // }
        break;
      case 1:
        animateToNextPage();
        console.log(value1);
        // if (value1.length > 0) {
        // } else {
        //   showToast({
        //     type: "error",
        //     message: translations.setup.errorChoose,
        //   });
        // }
        break;
      case 2:
        navigateToIntro();
        console.log(value2);
        // if (value2.length > 0) {
        // } else {
        //   showToast({
        //     type: "error",
        //     message: translations.setup.errorChoose,
        //   });
        // }
        break;
      default:
        break;
    }
  };

  const animateToNextPage = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    scrollViewRef.current?.scrollToOffset({
      offset: newPage * Dimensions.get("window").width,
      animated: true,
    });
  };

  const navigateToIntro = () => {
    NavigationService.replace(SCREENS.TABS);
    _setJson("is_first_open_app", true);
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.containerItem}>
        <View style={{ flex: 1 }}>{item?.values}</View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={scrollViewRef}
        // scrollEnabled={false}
        style={styles.flatList}
        data={renderScreen}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        pagingEnabled
        horizontal
        onMomentumScrollEnd={(ev) => {
          setCurrentPage(
            Math.round(
              ev.nativeEvent.contentOffset.x / Dimensions.get("window").width,
            ),
          );
        }}
      />
      <View style={styles.viewPage}>
        <PageControl
          style={styles.pageControl}
          numberOfPages={3}
          currentPage={currentPage}
          hidesForSinglePage
          pageIndicatorTintColor={palette.grey1}
          currentPageIndicatorTintColor={palette.btnRedPrimary}
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
    </View>
  );
};

export default AccountSetupScreen;

const styles = StyleSheet.create({
  flatList: {
    marginTop: "15%",
    maxHeight: "75%",
  },
  viewPage: {
    alignItems: "center",
    marginHorizontal: 16,
  },
  pageControl: {
    height: 54,
    width: ScreenWidth - 32,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  containerItem: {
    width: ScreenWidth,
  },
});
