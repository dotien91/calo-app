/* eslint-disable camelcase */

import VideoPlayer from "@shared-components/VideoPlayer";
import ImageLoad from "@screens/post/components/ImageLoad";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import * as React from "react";
import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import PageScroll from "@shared-components/page-scroll/PageScroll";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { getStatusBarHeight } from "@freakycoder/react-native-helpers";
const { width } = Dimensions.get("screen");

interface PagerScrollMediaProps {
  listMedia: any;
  closeModal: any;
  index: number;
}

const PagerScrollMedia = ({
  listMedia,
  closeModal,
  index,
}: PagerScrollMediaProps) => {
  const scrollViewRef = React.useRef<any>(null);
  React.useEffect(() => {
    console.log("index", index);
    setTimeout(() => {
      scrollViewRef.current?.scrollToIndex(index);
    }, 1);
  }, [index]);

  return (
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
          const media_width = item?.media_meta?.find(
            (i) => i.key === "width",
          )?.value;
          const media_height = item?.media_meta?.find(
            (i) => i.key === "height",
          )?.value;
          const heightMedia =
            media_width && media_height
              ? width / (Number(media_width) / Number(media_height))
              : width;
          if (item?.type === "image") {
            return (
              <View style={styles.viewBackground}>
                <ImageLoad
                  source={{ uri: item?.url }}
                  style={[styles.image, { height: heightMedia }]}
                  resizeMode="cover"
                />
              </View>
            );
          }
          return (
            <View key={index} style={styles.viewBackground}>
              <VideoPlayer
                mediaUrl={
                  "https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8"
                }
                height={heightMedia}
                width={width}
              />
            </View>
          );
        })}
      </PageScroll>
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
