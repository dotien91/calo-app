import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { useActiveTrack } from "react-native-track-player";
import { useLastActiveTrack } from "../hook/useLastActiveTrack";
import ModalAudioPlayScreen from "../audio-play/modal.audio.play.screen";
import eventEmitter from "@services/event-emitter";
import { SCREENS } from "constants";

const screenHeight = Dimensions.get("window").height;
const sheetMaxHeight = screenHeight;
const sheetMinHeight = 74;

const THRESHOLD = 74;

const MAX_Y = sheetMinHeight - sheetMaxHeight;
const MIN_Y = 0;

const BottomSheetPanResponder = () => {
  const lastRef = useRef(MIN_Y);
  const [showFull, setShowFull] = useState(false);
  const [showPodcast, setShowPodcast] = useState(false);
  const sheetRef = useRef(new Animated.Value(0)).current;
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
  const listScreenShow = [
    SCREENS.HOME,
    // SCREENS.DISCOVERSCREEN,
    SCREENS.AUDIO_BOOK,
    SCREENS.AUDIO_LIST,
    SCREENS.AUDIO_PREVIEW,
    SCREENS.RECOMMEND_AUDIO_BOOK,
    SCREENS.ALL_AUDIO_BOOk,
  ];

  const screenActive = ({ screen }) => {
    console.log("screen2", screen);
    if (listScreenShow.includes(screen)) {
      setShowPodcast(true);
    } else {
      setShowPodcast(false);
    }
  };

  useEffect(() => {
    eventEmitter.on("screen_active", screenActive);
    return () => {
      eventEmitter.off("screen_active", screenActive);
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        sheetRef.setOffset(lastRef.current);
      },
      onPanResponderMove: (_, gesture) => {
        if (lastRef.current === MAX_Y && gesture.dy > -MAX_Y + 2 * THRESHOLD) {
          console.log(gesture.dy, -MAX_Y + 2 * THRESHOLD);
          setShowFull(false);
        }
        if (lastRef.current === MIN_Y && gesture.dy > -THRESHOLD) {
          console.log(gesture.dy > -THRESHOLD);
          setShowFull(true);
        }

        sheetRef.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        sheetRef.flattenOffset();

        if (gesture.dy > 0) {
          //dragging down
          if (gesture.dy <= THRESHOLD) {
            autoSpring(MAX_Y);
            setShowFull(true);
          } else {
            autoSpring(MIN_Y);
            setShowFull(false);
          }
        } else {
          // dragging up
          if (gesture.dy >= -THRESHOLD) {
            autoSpring(MIN_Y);
            setShowFull(false);
          } else {
            autoSpring(MAX_Y);
            setShowFull(true);
          }
        }
      },
    }),
  ).current;
  const activeTrack = useActiveTrack();
  const lastActiveTrack = useLastActiveTrack();

  const displayedTrack = activeTrack ?? lastActiveTrack;
  console.log("displayedTrack", displayedTrack);

  const onPressHide = () => {
    autoSpring(MIN_Y);
    setShowFull(false);
  };
  const onPressShow = () => {
    autoSpring(MAX_Y);
    setShowFull(true);
  };
  if (
    !displayedTrack ||
    displayedTrack.url ===
      "https://ia801304.us.archive.org/32/items/SilentRingtone/silence.mp3" ||
    !showPodcast
  )
    return null;

  return (
    // <View style={styles.container}>
    <Animated.View style={[styles.sheetContainer, animatedStyles]}>
      <View style={[CS.flex1]} {...panResponder.panHandlers}>
        <ModalAudioPlayScreen
          onPressHide={onPressHide}
          onPressShow={onPressShow}
          type={showFull ? "full" : "bottom"}
        />
      </View>
    </Animated.View>
    // </View>
  );
};

export default BottomSheetPanResponder;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: palette.background,
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
