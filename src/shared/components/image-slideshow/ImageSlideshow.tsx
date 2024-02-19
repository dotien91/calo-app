import * as React from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { getStatusBarHeight } from "@freakycoder/react-native-helpers";
import SwiperFlatList from "react-native-swiper-flatlist";
/* eslint-disable camelcase */

import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { TypedMedia } from "shared/models";
import ImageModalInner from "./ImageModalInner";

interface ImageSlideShowProps {
  listMedia: TypedMedia[];
  closeModal: () => void;
  index: number;
}

const ImageSlideShow = ({ listMedia, closeModal }: ImageSlideShowProps) => {
  const [disabledScrollView, setDisabledScrollView] = React.useState(false);

  const _setDisabledScrollView = React.useCallback(() => {
    disabledScrollView == false && setDisabledScrollView(true);
    Animated.spring(x, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  }, [disabledScrollView]);
  const x = React.useRef(new Animated.Value(0)).current;

  const onSwipeRelease = () => {
    Animated.spring(x, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const renderItem = ({ item }, index) => {
    return (
      <View key={index} style={[styles.viewBackground]}>
        <ImageModalInner
          onSwipeMove={_setDisabledScrollView}
          swipeThreshold={100}
          scrollOffset={1}
          propagateSwipe={true}
          setDisabledScrollView={setDisabledScrollView}
          swipeDirection={["down", "up"]}
          onSwipeComplete={closeModal}
          backdropOpacity={0}
          onSwipeRelease={onSwipeRelease}
          item={item}
        />
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.modalInner,
        {
          backgroundColor: x.interpolate({
            inputRange: [0, 1],
            outputRange: [palette.black, palette.lightOverlay],
          }),
        },
      ]}
    >
      <View style={styles.headerContainer}>
        <Pressable onPress={closeModal}>
          <Icon
            size={36}
            name="close-circle-outline"
            type={IconType.Ionicons}
            color={palette.white}
          />
        </Pressable>
      </View>
      <SwiperFlatList
        disableGesture={disabledScrollView}
        index={0}
        data={listMedia}
        renderItem={renderItem}
        style={{ backgroundColor: "transparent" }}
      />
    </Animated.View>
  );
};

export default ImageSlideShow;

const styles = StyleSheet.create({
  modalInner: {
    // backgroundColor: palette.black,
    borderRadius: 6,
    paddingTop: getStatusBarHeight() + 10,
    flex: 1,
  },
  viewBackground: {
    ...CommonStyle.flex1,
    ...CommonStyle.center,
    // backgroundColor: palette.green,
  },
  headerContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
});
