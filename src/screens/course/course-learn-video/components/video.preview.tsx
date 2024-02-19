import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
} from "react-native";
import FastImage from "react-native-fast-image";
import Orientation from "react-native-orientation-locker";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Video from "react-native-video";
import Slider from "@react-native-community/slider";
import * as NavigationService from "react-navigation-helpers";

import { palette } from "@theme/themes";
import { HS, MHS } from "@utils/size.utils";
import {
  HIT_SLOP_EXPAND_10,
  HIT_SLOP_EXPAND_20,
} from "constants/system.constant";
import CS from "@theme/styles";
import { formatTime } from "@utils/date.utils";
import IconSvg from "assets/svg";
import PressableBtn from "@shared-components/button/PressableBtn";

const PERCENT_DONE_VIDEO = 0.3;

const VideoPreview = (
  {
    onPressLanscape = (status: boolean) => {
      console.log(status);
    },
    url,
    hasFullScreen = true,
    repeat = false,
    changeOrientation = false,
    markDoneCourse = () => {},
    thumbnail = "",
  },
  ref: any,
) => {
  const duration = useRef(0);
  const videoRef = useRef<any>(null);
  const currentTime = useRef(0);
  const loadDone = useSharedValue(false);
  const showOptions = useSharedValue(0);
  const sliderRef = useRef<Slider>(null);
  const pausedRef = useRef(false);
  const aniPause = useSharedValue(0);
  const isFullScreen = useRef(false);
  const [ready, setReady] = useState(true);
  const firstTime = useRef(true);
  const [isLanscapeVideo, setIsLanscapeVideo] = useState(true);
  const countTimeoutDone = useRef(0);
  const isDoneCourse = useRef(false);
  const [timeAlive, setTimeAlive] = useState(0);

  useEffect(() => {
    if (firstTime.current) {
      firstTime.current = false;
    } else {
      countTimeoutDone.current = 0;
      currentTime.current = 0;
      loadDone.value = false;
      pausedRef.current = false;
      aniPause.value = withTiming(0, { duration: 0 });
      duration.current = 0;
      videoRef.current?.setNativeProps({
        paused: true,
      });
      isDoneCourse.current = false;
      setReady(false);
    }
  }, [url]);

  useEffect(() => {
    if (!ready) {
      setTimeout(() => {
        setReady(true);
      }, 500);
    }
  }, [ready]);

  useImperativeHandle(ref, () => ({
    paused: () => {
      videoRef.current?.setNativeProps({
        paused: true,
      });
    },
  }));

  const styleVideo = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: loadDone.value ? 0 : 1,
        },
      ],
    };
  });

  const onProgress = (data: any) => {
    loadDone.value = true;
    onProgressWatchVideo();

    if (duration.current === 0 && data.duration > 0) {
      duration.current = Number(data.duration / 1000);
      sliderRef.current?.setNativeProps({
        maximumValue: Number(duration.current),
      });
    }

    if (data.seekableDuration > 0) {
      setTimeAlive(Math.floor(data.currentTime));
      currentTime.current = data.currentTime;
      sliderRef.current?.setNativeProps({
        value: data.currentTime,
      });
    }
  };

  const onSlidingComplete = (value: any) => {
    if (duration.current > 0) {
      videoRef.current?.seek(value);
      videoRef.current?.setNativeProps({
        paused: false,
      });
    } else {
      videoRef.current?.setNativeProps({
        paused: false,
      });
    }
  };

  const styleAction = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        showOptions.value,
        [0, 1],
        [0, 1],
        Extrapolate.CLAMP,
      ),
    };
  });

  const styleButton = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            showOptions.value,
            [0, 1],
            [0, 1],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  const stylePlayButton = useAnimatedStyle(() => {
    return {
      opacity: interpolate(aniPause.value, [0, 1], [1, 0], Extrapolate.CLAMP),
    };
  });

  const stylePauseButton = useAnimatedStyle(() => {
    return {
      opacity: interpolate(aniPause.value, [0.5, 1], [0, 1], Extrapolate.CLAMP),
    };
  });

  const onPressPause = () => {
    pausedRef.current = !pausedRef.current;
    aniPause.value = withTiming(pausedRef.current ? 1 : 0, { duration: 300 });
    videoRef.current?.setNativeProps({ paused: pausedRef.current });
    //set lại hiển thị bộ option chứ không thì sẽ ăn cái gesture handle rồi ẩn đi mất
    showOptions.value = withTiming(1, { duration: 0 }, (f1) => {
      if (f1) {
        showOptions.value = withDelay(2000, withTiming(0, { duration: 300 }));
      }
    });
  };

  // tua laij 10s
  const onPressReplay = () => {
    if (duration.current === 0) {
      return;
    }
    const timeSeek = Math.max(0, currentTime.current - 10);
    sliderRef.current?.setNativeProps({
      value: timeSeek,
    });
    setTimeAlive(Math.floor(timeSeek));

    videoRef.current?.seek(timeSeek);
    showOptions.value = withTiming(1, { duration: 0 }, (f1) => {
      if (f1) {
        showOptions.value = withDelay(2000, withTiming(0, { duration: 300 }));
      }
    });
  };

  // tua di 10s
  const onPressForward = () => {
    if (duration.current === 0) {
      return;
    }
    const timeSeek = Math.min(duration.current - 3, currentTime.current + 10);
    sliderRef.current?.setNativeProps({
      value: timeSeek,
    });
    videoRef.current?.seek(timeSeek);
    setTimeAlive(Math.floor(timeSeek));
    showOptions.value = withTiming(1, { duration: 0 }, (f1) => {
      if (f1) {
        showOptions.value = withDelay(2000, withTiming(0, { duration: 300 }));
      }
    });
  };
  const onPressFullScreen = () => {
    console.log("onPressFullScreen", timeAlive);
    isFullScreen.current = !isFullScreen.current;
    onPressLanscape?.(isFullScreen.current);
    if (changeOrientation) {
      if (isFullScreen.current) {
        Orientation.lockToLandscape();
      } else {
        Orientation.lockToPortrait();
      }
    }

    showOptions.value = withTiming(1, { duration: 0 }, (f1) => {
      if (f1) {
        showOptions.value = withDelay(2000, withTiming(0, { duration: 300 }));
      }
    });
  };

  const onPressView = () => {
    showOptions.value = withTiming(
      showOptions.value === 0 ? 1 : 0,
      { duration: 300 },
      (f1) => {
        if (f1) {
          showOptions.value = withDelay(2000, withTiming(0, { duration: 300 }));
        }
      },
    );
  };

  const onProgressWatchVideo = () => {
    if (!markDoneCourse) {
      return;
    }
    countTimeoutDone.current += 1;

    if (
      countTimeoutDone.current / duration.current >= PERCENT_DONE_VIDEO &&
      !isDoneCourse.current
    ) {
      isDoneCourse.current = true;
      console.log("call done course");
      markDoneCourse?.();
    }
  };

  const renderVideo = () => {
    if (!ready) {
      return null;
    }
    return (
      <Video
        ref={videoRef}
        style={StyleSheet.absoluteFill}
        resizeMode={isLanscapeVideo ? "contain" : "cover"}
        source={{ uri: url }}
        onLoad={(data) => {
          console.log("onLoad Video", data);
          loadDone.value = true;
          duration.current = data.duration;
          sliderRef.current?.setNativeProps({
            maximumValue: Number(duration.current),
          });
          if (data?.naturalSize?.orientation) {
            setIsLanscapeVideo(data?.naturalSize?.orientation === "landscape");
          }
        }}
        onProgress={onProgress}
        onEnded={(data: any) => console.log("onEnded", data)}
        repeat={repeat}
      />
    );
  };

  const _goBack = () => {
    NavigationService.goBack();
  };
  const _shareScreen = () => {};
  const _shareToTV = () => {};
  const _settingVideo = () => {};

  return (
    <Pressable style={[styles.container]} onPress={onPressView}>
      <Animated.View style={[styles.loading, styleVideo]}>
        {thumbnail ? (
          <FastImage
            style={StyleSheet.absoluteFillObject}
            source={{ uri: thumbnail }}
          />
        ) : null}

        <ActivityIndicator size={"large"} color={palette.textMain} />
      </Animated.View>

      <View style={[{ ...StyleSheet.absoluteFillObject }]}>
        {renderVideo()}
      </View>
      <Animated.View style={[styles.headerAbs, styleAction]}>
        <PressableBtn onPress={_goBack}>
          <IconSvg size={24} name={"icArrowDown"} color={palette.white} />
        </PressableBtn>
        <View style={{ flexDirection: "row", gap: 4 }}>
          <PressableBtn onPress={_shareScreen}>
            <IconSvg size={24} name={"icShareScreen"} color={palette.white} />
          </PressableBtn>
          <PressableBtn onPress={_shareToTV}>
            <IconSvg size={24} name={"icAirPlay"} color={palette.white} />
          </PressableBtn>
          <PressableBtn onPress={_settingVideo}>
            <IconSvg size={24} name={"icSettingVideo"} color={palette.white} />
          </PressableBtn>
        </View>
      </Animated.View>

      <Animated.View style={[styles.actionVideo, styleAction]}>
        <Animated.View
          style={[
            styles.centerContent,
            { flexDirection: "row", gap: HS._20 },
            styleButton,
          ]}
        >
          <Pressable onPress={onPressReplay} hitSlop={HIT_SLOP_EXPAND_20}>
            <IconSvg name="icBackward" size={32} color={palette.white} />
          </Pressable>
          <Pressable onPress={onPressPause} hitSlop={HIT_SLOP_EXPAND_20}>
            <Animated.View style={[stylePlayButton]}>
              <IconSvg name="icPause" size={48} color={palette.white} />
            </Animated.View>
            <Animated.View style={[{ position: "absolute" }, stylePauseButton]}>
              <IconSvg name="icPlay" size={48} color={palette.white} />
            </Animated.View>
          </Pressable>
          <Pressable onPress={onPressForward} hitSlop={HIT_SLOP_EXPAND_20}>
            <IconSvg name="icForward" size={32} color={palette.white} />
          </Pressable>
        </Animated.View>
        <View style={styles.viewSlider}>
          <View
            style={[
              {
                width: 40,
                height: 40,
                ...CS.center,
              },
            ]}
          >
            <Text style={styles.txtTime}>
              {formatTime(currentTime.current)}
            </Text>
          </View>
          <Slider
            ref={sliderRef}
            style={styles.slider}
            minimumValue={0}
            maximumValue={0}
            minimumTrackTintColor={palette.primary}
            thumbTintColor={palette.primary}
            hitSlop={HIT_SLOP_EXPAND_10}
            onSlidingStart={() => {
              loadDone.value = false;
              videoRef.current?.setNativeProps({ paused: true });
            }}
            onSlidingComplete={onSlidingComplete}
          />
          <View
            style={[
              {
                width: 40,
                height: 40,
                ...CS.center,
              },
            ]}
          >
            <Text style={styles.txtTime}>{formatTime(duration.current)}</Text>
          </View>
          {hasFullScreen ? (
            <TouchableWithoutFeedback
              onPress={onPressFullScreen}
              hitSlop={HIT_SLOP_EXPAND_20}
            >
              <Animated.View style={[styles.iconFullScreen, styleAction]}>
                <IconSvg name="icFullScreen" size={24} color={palette.white} />
              </Animated.View>
            </TouchableWithoutFeedback>
          ) : null}
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },

  txtTime: {
    ...CS.hnRegular,
    fontSize: 12,
    color: palette.white,
  },
  headerAbs: {
    position: "absolute",
    top: MHS._10,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },

  viewSlider: {
    position: "absolute",
    bottom: MHS._10,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  slider: {
    flex: 1,
  },
  actionVideo: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 100,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconFullScreen: {},

  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 10,
  },
});

export default forwardRef(VideoPreview);
