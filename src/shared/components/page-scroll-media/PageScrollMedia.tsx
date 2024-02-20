import * as React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { getStatusBarHeight } from "@freakycoder/react-native-helpers";
import Carousel from "react-native-snap-carousel";

/* eslint-disable camelcase */

import VideoPlayer from "@shared-components/video.player.component";
import ImageLoad from "@screens/post/components/ImageLoad";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import PageScroll, {
  PagerScrollRef,
} from "@shared-components/page-scroll/PageScroll";
import { TypedMedia } from "shared/models";

const { width } = Dimensions.get("screen");

interface PagerScrollMediaProps {
  listMedia: TypedMedia[];
  closeModal: () => void;
  index: number;
}

const PagerScrollMedia = ({
  listMedia,
  closeModal,
  index,
}: PagerScrollMediaProps) => {
  const scrollViewRef = React.useRef<PagerScrollRef>(null);
  const caroselRef = React.useRef(null);
  const [indexImg, setIndexImg] = React.useState(0);
  React.useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToIndex(index);
    }, 1);
  }, [index]);

  const renderItemListImage = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    return (
      <View key={index}>
        <Image
          style={{ height: 50, width: 30 }}
          source={{ uri: item?.media_url }}
        ></Image>
      </View>
    );
  };

  const scrollLeftIcon = () => {
    scrollViewRef.current?.scrollToLeft();
    caroselRef.current?.snapToItem(indexImg - 1);
    setIndexImg(indexImg - 1);
    if (indexImg <= 1) {
      setIndexImg(0);
      scrollViewRef.current?.scrollToIndex(0);
    }
  };

  const scrollRight = () => {
    scrollViewRef.current?.scrollToRight();
    caroselRef.current?.snapToItem(indexImg + 1);
    setIndexImg(indexImg + 1);
    if (indexImg >= listMedia.length - 1) {
      setIndexImg(listMedia.length - 1);
    }
  };

  // const panResponder = React.useRef(
  //   PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onPanResponderMove: (event, gestureState) => {
  //       // Check if the user is swiping down
  //       // goc giua 2 vecto A(x0, y0), B(moveX, moveY)

  //       const hesogoc = (gestureState.moveY - gestureState.y0)/(gestureState.moveX - gestureState.x0)
  //       // Y0 = hesogoc*X0 + b => hesogoc*x0 - y0 + b = 0 => vecto(hesogoc - 1)
  //                                                         //=> vecto(0, 1)
  //       // const b = hesogoc*gestureState.x0 - gestureState.y0
  //       // pt dt = y = hesogoc* x + b => hesogoc*x -y + b = 0 => vecto A(hesogoc, -y0)
  //       // pt dt Oy = la x = 0 => vecto B(0 ,1)
  //       // cosA = x.x1 + y.y1 / can(x^2 + y^2).can(x^2+ y^2)
  //       const cosX = (1) / Math.sqrt(hesogoc*hesogoc)

  //       console.log("Math.cos(cosX)", cosX)
  //       if (-0.5 < cosX || cosX < 0.5 ) {
  //         // Perform actions as the user swipes down
  //         // closeModal()

  //         console.log('Swiping down...', gestureState.dy, "Swiping down..." ,gestureState.dx);
  //       }
  //     },
  //     onPanResponderRelease: () => {
  //       // closeModal()

  //     },
  //   })
  // ).current;

  return (
    //{...panResponder.panHandlers}
    <View style={styles.modalInner}>
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

      <PageScroll
        ref={scrollViewRef}
        scrollEnabled={true}
        length={listMedia.length}
      >
        {listMedia.map((item, index) => {
          const media_width = width;
          const media_height = item?.media_meta?.find(
            (i) => i.key === "height",
          )?.value;
          const heightMedia =
            media_width && media_height
              ? width / (Number(media_width) / Number(media_height))
              : width;
          if ((item?.media_type || "").includes("image")) {
            return (
              <View
                key={index}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "black",
                }}
              >
                <ImageLoad
                  source={{ uri: item?.media_url }}
                  style={[
                    styles.image,
                    { height: heightMedia, width: media_width },
                  ]}
                  resizeMode="contain"
                />
              </View>
            );
          }
          if ((item?.media_type || "").includes("video")) {
            return (
              <View key={index} style={styles.viewBackground}>
                <VideoPlayer
                  mediaUrl={item?.media_url}
                  height={heightMedia}
                  width={width}
                  resizeMode="contain"
                  autoPlay={true}
                />
              </View>
            );
          }
          return null;
        })}
      </PageScroll>
      <TouchableOpacity
        onPress={scrollLeftIcon}
        style={{
          width: 20,
          height: 30,
          position: "absolute",
          left: 0,
          top: Dimensions.get("window").height / 2,
          backgroundColor: "grey",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{ height: 20, width: 20 }}
          source={require("assets/images/arrow-left.png")}
        ></Image>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={scrollRight}
        style={{
          width: 20,
          height: 30,
          position: "absolute",
          right: 0,
          top: Dimensions.get("window").height / 2,
          backgroundColor: "grey",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{ height: 20, width: 20 }}
          source={require("assets/images/arrow-right.png")}
        ></Image>
      </TouchableOpacity>
      <View
        style={{
          width: "100%",
          height: 50,
          position: "absolute",
          bottom: 50,
          alignItems: "center",
        }}
      >
        <Carousel
          ref={caroselRef}
          data={listMedia}
          renderItem={renderItemListImage}
          sliderWidth={70}
          itemWidth={30}
        />
      </View>
    </View>
  );
};

export default PagerScrollMedia;

const styles = StyleSheet.create({
  modalInner: {
    backgroundColor: palette.black,
    borderRadius: 6,
    paddingTop: getStatusBarHeight() + 10,
    flex: 1,
  },
  viewBackground: {
    ...CommonStyle.flex1,
    ...CommonStyle.center,
    backgroundColor: palette.black,
  },
  image: {
    width: width,
  },
  headerContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
});
