import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  getBottomSpace,
  getStatusBarHeight,
} from "react-native-iphone-screen-helper";
import CS from "@theme/styles";
import { FloatingPlayer } from "./FloatingPlayer";
import AudioPlayScreen from "../audio-play/audio.play.screen";
import { palette } from "@theme/themes";

const screenHeight = Dimensions.get("window").height;
const sheetMaxHeight = screenHeight;
const sheetMinHeight = 74;

const THRESHOLD = 74;

const MAX_Y = sheetMinHeight - sheetMaxHeight;
const MIN_Y = 0;

const BottomSheetPanResponder = () => {
  const lastRef = useRef(0);
  const [showFull, setShowFull] = useState(false);
  const sheetRef = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        sheetRef.setOffset(lastRef.current);
      },
      onPanResponderMove: (_, gesture) => {
        console.log("dy1...,", gesture.dy, MAX_Y);
        if (lastRef.current === MAX_Y && gesture.dy > THRESHOLD) {
          setShowFull(false);
        }
        if (lastRef.current === MIN_Y && gesture.dy > -MAX_Y + 2 * THRESHOLD) {
          setShowFull(true);
        }

        sheetRef.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        sheetRef.flattenOffset();

        if (gesture.dy > 0) {
          //dragging down
          if (gesture.dy <= THRESHOLD) {
            autoSpring(MIN_Y);
          } else {
            autoSpring(MIN_Y);
          }
        } else {
          // dragging up
          if (gesture.dy >= -THRESHOLD) {
            autoSpring(MIN_Y);
          } else {
            autoSpring(MAX_Y);
          }
        }
      },
    }),
  ).current;
  const View1 = () => {
    return (
      <View style={[CS.flex1, { maxHeight: 74, backgroundColor: "red" }]}>
        <FloatingPlayer />
      </View>
    );
  };
  const View2 = () => {
    return (
      <Pressable onPress={() => console.log("view1")}>
        <AudioPlayScreen />
      </Pressable>
    );
  };

  const autoSpring = (value) => {
    lastRef.current = value;
    console.log("value", value);
    if (value !== 0) {
      setShowFull(true);
    } else {
      setShowFull(false);
    }
    Animated.spring(sheetRef, {
      toValue: lastRef.current,
      useNativeDriver: false,
    }).start();
  };
  const animatedStyles = {
    height: sheetRef.interpolate({
      inputRange: [MAX_Y, MIN_Y],
      outputRange: [sheetMaxHeight, sheetMinHeight],
      extrapolate: "clamp",
    }),
    bottom: sheetRef.interpolate({
      inputRange: [MAX_Y, MIN_Y],
      outputRange: [0, getBottomSpace() + 50],
      extrapolate: "clamp",
    }),
  };
  console.log("showFull", showFull);
  return (
    // <View style={styles.container}>
    <Animated.View style={[styles.sheetContainer, animatedStyles]}>
      <View
        style={[CS.flex1, !showFull ? { height: 74 } : {}]}
        {...panResponder.panHandlers}
      >
        {!showFull ? <View1 /> : <View2 />}
      </View>
    </Animated.View>
    // </View>
  );
};

export default BottomSheetPanResponder;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#FFEBEE",
    position: "absolute",
    ...CS.flexRear,
    left: 0,
    right: 0,
    bottom: getBottomSpace() + 50,
  },
  sheetContainer: {
    backgroundColor: palette.background,
    position: "absolute",
    bottom: 0,
    width: "100%",
    elevation: 20,
  },
});
