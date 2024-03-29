import React, { memo, useEffect, useRef } from "react";
import { Text, StyleSheet, Animated } from "react-native";

import { formatPrice } from "@helpers/string.helper";
import BuyButton from "@screens/course/components/buy.button";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { ICourseItem } from "models/course.model";
import { View } from "react-native-animatable";
import EditButton from "@screens/course/components/edit.button";
import useStore from "@services/zustand/store";
import EnrollNow from "@screens/course/components/EnrollNow";

interface BuyBottomProps {
  show: boolean;
  data?: ICourseItem;
}

const BuyBottom = ({ show, data, courseRoom }: BuyBottomProps) => {
  const animationHeight = useRef(new Animated.Value(-90)).current;
  const userData = useStore((state) => state.userData);
  const isTeacher = userData?._id === data?.user_id._id;

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
      toValue: 100,
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

  if (!show || isTeacher) return null;

  if (data?.is_join)
    return (
      <Animated.View style={styles.container}>
        <View style={styles.viewShadow} />
        <Animated.View
          style={[
            styles.viewContainer,
            {
              maxHeight: animationHeight,
              paddingVertical: show ? 8 : 0,
            },
          ]}
        >
          <EnrollNow
            fromBottom
            courseRoom={courseRoom}
            data={data}
            course_id={data._id}
          />
        </Animated.View>
      </Animated.View>
    );

  return (
    <Animated.View style={styles.container}>
      <View style={styles.viewShadow} />
      <Animated.View
        style={[
          styles.viewContainer,
          {
            maxHeight: animationHeight,
            paddingVertical: show ? 8 : 0,
          },
        ]}
      >
        {((show && data?.coupon_id == null) ||
          (data?.coupon_id?.availableAt &&
            new Date(data?.coupon_id?.availableAt) > new Date()) ||
          (data?.coupon_id?.availableAt &&
            new Date(data?.coupon_id?.expired) < new Date())) && (
          <View style={[CS.flex1, { justifyContent: "center" }]}>
            <Text style={styles.textPrice}>{formatPrice(data?.price)}</Text>
          </View>
        )}
        {show &&
        data?.type === "Call 1-1" &&
        data?.coupon_id &&
        data.coupon_id.promotion > 0 &&
        data?.coupon_id?.availableAt &&
        new Date(data?.coupon_id?.availableAt) < new Date() &&
        data?.coupon_id?.availableAt &&
        new Date(data?.coupon_id?.expired) > new Date() ? (
          <View style={[CS.flex1, { justifyContent: "center" }]}>
            <Text style={styles.textPrice}>
              {data?.coupon_id?.promotion_type === "percentage"
                ? formatPrice(
                    data?.price -
                      (data?.price * data?.coupon_id?.promotion) / 100,
                  )
                : formatPrice(data?.price - data?.coupon_id?.promotion)}
            </Text>
            <Text style={styles.textPriceOld}>{formatPrice(data?.price)}</Text>
          </View>
        ) : null}
        {show &&
          (data?.type === "Call group" || data?.type === "Self-learning") && (
            <Text style={styles.textPriceOld}>{formatPrice(data?.price)}</Text>
          )}
        {show &&
          (isTeacher ? (
            <EditButton type="wrap" data={data} />
          ) : (
            <BuyButton courseRoom={courseRoom} type="wrap" data={data} />
          ))}
      </Animated.View>
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
    // flexDirection: "row",

    alignItems: "center",
    // shadowColor: "rgba(0,0,0,0.8)",
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.1,
    // elevation: 0,
    // shadowRadius: 2,
  },
  viewContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    minHeight: 60,
    ...CS.flexRear,
  },
  viewShadow: {
    height: 2,
    width: "100%",
    marginBottom: 1,
    backgroundColor: palette.background,
    shadowColor: "rgba(0,0,0,0.8)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 0,
    shadowRadius: 1,
  },
  textPrice: {
    ...CS.hnSemiBold,
    fontSize: 18,
    color: palette.primary,
  },
  textPriceOld: {
    ...CS.flex1,
    ...CS.hnSemiBold,
    fontSize: 14,
    color: palette.textOpacity8,
    textDecorationLine: "line-through",
  },
});
