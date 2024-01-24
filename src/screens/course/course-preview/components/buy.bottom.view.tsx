import React, { memo, useEffect, useRef } from "react";
import { Text, StyleSheet, Animated } from "react-native";

import { formatPrice } from "@helpers/string.helper";
import BuyButton from "@screens/course/components/buy.button";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { ICourseItem } from "models/course.model";

interface BuyBottomProps {
  show: boolean;
  data?: ICourseItem;
}

const BuyBottom = ({ show, data }: BuyBottomProps) => {
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
      toValue: 60,
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
      <Text style={styles.textPrice}>{formatPrice(data?.price)}</Text>
      {show && <BuyButton type="wrap" data={data} />}
    </Animated.View>
  );
};

export default memo(BuyBottom);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: palette.background,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  textPrice: {
    ...CS.flex1,
    ...CS.hnSemiBold,
    fontSize: 18,
  },
});
