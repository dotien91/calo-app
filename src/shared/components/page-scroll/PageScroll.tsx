import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  ViewProps,
} from "react-native";
import { palette } from "@theme/themes";
import CommonStyle from "@theme/styles";
const { width } = Dimensions.get("screen");
const isAndroid = Platform.OS === "android";
interface Props extends ViewProps {
  length: number;
  children: React.ReactNode;
  scrollEnabled: boolean;
}

export interface PagerScrollRef {
  scrollToLeft: () => void;
  scrollToRight: () => void;
  scrollToFirstPage: () => void;
  scrollToEnd: () => void;
  scrollToIndex: (index: number) => void;
}

const PageScroll = (props: Props, ref: React.Ref<PagerScrollRef>) => {
  const { length, scrollEnabled } = props;
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const indexRef = useRef<number>(0);

  useImperativeHandle(ref, () => ({
    scrollToLeft,
    scrollToRight,
    scrollToFirstPage,
    scrollToEnd,
    scrollToIndex,
  }));

  const percent = useSharedValue((1 / length) * 100);
  const totalWidth = useMemo(() => {
    return length * width;
  }, [length]);

  const scrollHandler = useAnimatedScrollHandler({
    onEndDrag: (event) => {
      percent.value = withSpring(
        ((width + event.contentOffset.x) / totalWidth) * 100,
      );
    },
  });

  const scrollToFirstPage = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, x: 0 });
  }, []);

  const onMomentumScrollEnd = (event) => {
    percent.value = withSpring(
      ((width + event.nativeEvent.contentOffset.x) / totalWidth) * 100,
    );
  };

  const scrollToLeft = () => {
    if (indexRef.current - 1 >= 0) {
      scrollViewRef.current?.scrollTo({
        y: 0,
        x: (indexRef.current - 1) * width,
        animated: true,
      });
      indexRef.current -= 1;
      if (isAndroid) {
        percent.value = (indexRef.current / length) * 100;
      }
    }
  };

  const scrollToRight = () => {
    if (indexRef.current + 1 <= length) {
      scrollViewRef.current?.scrollTo({
        y: 0,
        x: (indexRef.current + 1) * width,
        animated: true,
      });
      indexRef.current += 1;
      if (isAndroid) {
        percent.value = (indexRef.current / length) * 100;
      }
    }
  };

  const scrollToEnd = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      x: length * width,
      animated: true,
    });
    indexRef.current = length - 1;
  };
  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      x: index * width,
      animated: false,
    });
    indexRef.current = index;
  };

  return (
    <SafeAreaView style={[styles.container, props?.style]}>
      {/* <Animated.View style={styles.viewHeader}>
        <Animated.View style={[styles.inline, stylePercent]} />
      </Animated.View> */}
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
        onScroll={scrollHandler}
        scrollEnabled={scrollEnabled}
        keyboardShouldPersistTaps="handled"
      >
        {props?.children}
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: palette.background,
    ...CommonStyle.flex1,
  },

  content: {
    ...CommonStyle.flex1,
  },
});

export default forwardRef(PageScroll);
