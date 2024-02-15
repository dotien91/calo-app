import * as React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { getStatusBarHeight } from "@freakycoder/react-native-helpers";

/* eslint-disable camelcase */

import VideoPlayer from "@shared-components/video.player.component";
import ImageLoad from "@screens/post/components/ImageLoad";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { TypedMedia } from "shared/models";

const { width } = Dimensions.get("screen");

interface PagerScrollMediaProps {
  listMedia: TypedMedia[];
  closeModal: () => void;
  indexMedia: number;
}

const PagerScrollMedia = ({
  listMedia,
  closeModal,
  indexMedia,
}: PagerScrollMediaProps) => {
  const scrollViewRef = React.useRef(null);
  const caroselRef = React.useRef(null);
  const [indexImg, setIndexImg] = React.useState(indexMedia);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
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
              {
                height: Dimensions.get("window").height,
                width: Dimensions.get("window").width,
              },
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
            height={Dimensions.get("window").height}
            width={width}
            resizeMode="contain"
            autoPlay={true}
          />
        </View>
      );
    }
    return null;
  };

  const renderItemChildrenView = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          scrollToIndex(index);
        }}
        key={index}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
          paddingHorizontal: 5,
          borderWidth: 1,
          borderColor: index === indexImg ? "white" : "black",
        }}
      >
        <Image
          style={{ height: 50, width: 50 }}
          source={{ uri: item?.media_url }}
          resizeMode="cover"
        ></Image>
      </TouchableOpacity>
    );
  };

  React.useEffect(() => {
    if (indexMedia != 0) {
      scrollChildrenToIndex(indexMedia);
      scrollToIndex(indexMedia);
    }
  }, []);

  const scrollToIndex = (index: number) => {
    setIndexImg(index);
    scrollViewRef?.current?.scrollToOffset({
      offset: index * Dimensions.get("window").width,
      animated: true,
    });
  };

  const scrollChildrenToIndex = (index: number) => {
    if (index * 50 > Dimensions.get("window").width) {
      caroselRef?.current?.scrollToOffset({
        offset: index * 50,
        animated: true,
      });
    }
    if (index * 50 + 5 - 50 / 2 > Dimensions.get("window").width / 2) {
      caroselRef?.current?.scrollToOffset({
        offset: index * (50 + 10) - Dimensions.get("window").width / 2 + 50 / 2,
        animated: true,
      });
    }
    if (index * 50 + 5 - 50 / 2 < Dimensions.get("window").width / 2) {
      caroselRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };

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

      <FlatList
        ref={scrollViewRef}
        data={listMedia}
        renderItem={renderItem}
        pagingEnabled
        horizontal
        onMomentumScrollEnd={(ev) => {
          setIndexImg(
            Math.round(
              ev.nativeEvent.contentOffset.x / Dimensions.get("window").width,
            ),
          );
          scrollChildrenToIndex(
            Math.round(
              ev.nativeEvent.contentOffset.x / Dimensions.get("window").width,
            ),
          );
        }}
      ></FlatList>
      <View
        style={{
          width: "100%",
          height: 50,
          position: "absolute",
          bottom: 50,
          alignItems: "center",
        }}
      >
        <FlatList
          ref={caroselRef}
          data={listMedia}
          renderItem={renderItemChildrenView}
          horizontal
        ></FlatList>
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
