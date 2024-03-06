import React, { memo, useEffect, useRef } from "react";
import { StyleSheet, Animated } from "react-native";

import { palette } from "@theme/themes";
import { getStatusBarHeight } from "react-native-iphone-screen-helper";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";

interface HeaderAbsoluteProps {
  show: boolean;
}

const HeaderAbsolute = ({ show }: HeaderAbsoluteProps) => {
  const animationHeight = useRef(new Animated.Value(-90)).current;
  const collapseView = () => {
    Animated.timing(animationHeight, {
      duration: 300,
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const expandView = () => {
    Animated.timing(animationHeight, {
      duration: 300,
      toValue: getStatusBarHeight() + 60,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (show) {
      expandView();
    } else {
      collapseView();
    }
  }, [show]);

  return (
    <Animated.View style={[styles.container, { maxHeight: animationHeight }]}>
      {show && <Header text={translations.affiliate.yourIncome} />}
    </Animated.View>
  );
};

export default memo(HeaderAbsolute);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: palette.background,
    height: getStatusBarHeight() + 60,
    justifyContent: "flex-end",
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.8)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    elevation: 0,
    shadowRadius: 2,
  },
});
