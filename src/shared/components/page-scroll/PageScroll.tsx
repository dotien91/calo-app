import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
// import Animated, {
//   useAnimatedScrollHandler,
//   useSharedValue,
//   withSpring,
// } from "react-native-reanimated"; // Removed reanimated
import { Animated } from "react-native"; // Fallback to React Native Animated
import { Dimensions, Platform, StyleSheet, ViewProps } from "react-native";
import CommonStyle from "@theme/styles";
const { width } = Dimensions.get("screen");
const isAndroid = Platform.OS === "android";
interface Props extends ViewProps {
  length: number;
  children: React.ReactNode;
  scrollEnabled: boolean;
  widthItem?: number;
}

export interface PagerScrollRef {
  scrollToLeft: () => void;
  scrollToRight: () => void;
  scrollToFirstPage: () => void;
  scrollToEnd: () => void;
  scrollToIndex: (index: number) => void;
}

const PageScroll = (props: Props, ref: React.Ref<PagerScrollRef>) => {
  const { length, scrollEnabled, widthItem } = props;
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const indexRef = useRef<number>(0);
  const widthI = widthItem || width;

  useImperativeHandle(ref, () => ({
    scrollToLeft,
    scrollToRight,
    scrollToFirstPage,
    scrollToEnd,
    scrollToIndex,
  }));

  // Removed: react-native-reanimated functionality
  // const percent = useSharedValue((1 / length) * 100);
  const totalWidth = useMemo(() => {
    return length * widthI;
  }, [length]);

  // Removed: react-native-reanimated scroll handler
  // const scrollHandler = useAnimatedScrollHandler({
  //   onEndDrag: (event) => {
  //     percent.value = withSpring(
  //       ((widthI + event.contentOffset.x) / totalWidth) * 100,
  //     );
  //   },
  // });

  const scrollToFirstPage = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, x: 0 });
  }, []);

  const onMomentumScrollEnd = (event) => {
    // Removed: react-native-reanimated functionality
    // percent.value = withSpring(
    //   ((widthI + event.nativeEvent.contentOffset.x) / totalWidth) * 100,
    // );
  };

  const scrollToLeft = () => {
    if (indexRef.current - 1 > 0) {
      scrollViewRef.current?.scrollTo({
        y: 0,
        x: (indexRef.current - 1) * widthI,
        animated: true,
      });
      indexRef.current -= 1;
      // Removed: react-native-reanimated functionality
      // if (isAndroid) {
      //   percent.value = (indexRef.current / length) * 100;
      // }
    }
  };

  const scrollToRight = () => {
    if (indexRef.current + 1 < length) {
      scrollViewRef.current?.scrollTo({
        y: 0,
        x: (indexRef.current + 1) * widthI,
        animated: true,
      });
      indexRef.current += 1;
      // Removed: react-native-reanimated functionality
      // if (isAndroid) {
      //   percent.value = (indexRef.current / length) * 100;
      // }
    }
  };

  const scrollToEnd = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      x: length * widthI,
      animated: true,
    });
    indexRef.current = length - 1;
  };
  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      x: index * widthI,
      animated: false,
    });
    indexRef.current = index;
  };

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      bounces={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={styles.content}
      scrollEventThrottle={16}
      onMomentumScrollEnd={onMomentumScrollEnd}
      // Removed: react-native-reanimated scroll handler
      // onScroll={scrollHandler}
      scrollEnabled={scrollEnabled}
      keyboardShouldPersistTaps="handled"
    >
      {props?.children}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    ...CommonStyle.flex1,
  },
});

export default forwardRef(PageScroll);
