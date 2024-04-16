import React, { useRef, useState } from "react";
import ImageViewer from "react-native-image-zoom-viewer";

import { Device } from "@utils/device.ui.utils";
import { closeSuperModal } from "@helpers/super.modal.helper";
import VideoPreview from "@screens/course/course-learn-video/components/video.preview";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { StyleSheet, View } from "react-native";
import CS from "@theme/styles";

interface Media {
  item: any;
}

const width = Device.width;

const Media = ({ item }: Media) => {
  const media_width = Device.width;
  const media_height = item?.media_meta?.find((i) => i.key === "height")?.value;
  const mediaHeight =
    media_width && media_height
      ? width / (Number(media_width) / Number(media_height))
      : width;

  const imgRender = [
    {
      url: item?.media_url,
    },
  ];

  const showFloatButtonDailyMission = useSharedValue(1);
  const videoRef = useRef<any>();
  const [isLanscape, setIsLanscape] = useState(false);

  const onPressLanscape = (isFullScreen: boolean) => {
    showFloatButtonDailyMission.value = withTiming(isFullScreen ? 0 : 1, {
      duration: 0,
    });
    setIsLanscape(isFullScreen);
  };

  const onPressItem = () => {
    videoRef?.current?.setShowPreview(false);
    // if (item?.type === "video") {
    //   if (currentProgressData) setCurrentProgressData(null);
    //   setSource(item);
    // } else {
    //   const data = {
    //     id: course_id,
    //     progress: 0,
    //     url: item?.media_id?.media_url,
    //   };
    //   setTimeout(() => {
    //     updateWatchingVideos(data);
    //   }, 2000);
    //   setSource(item);
    // }
  };

  const onPressMarkDone = () => {};

  const renderVideo = () => {
    return (
      <VideoPreview
        onPressLanscape={onPressLanscape}
        url={item?.media_url}
        ref={videoRef}
        changeOrientation={false}
        markDoneCourse={onPressMarkDone}
        thumbnail={item?.media_url.media_thumbnail}
        // currentProgressData={currentProgressData}
        source={item}
        setSource={onPressItem}
        fromSlideShow={true}
      />
    );
  };
  if (
    (item?.media_mime_type || "").includes("image") ||
    (item?.media_type || "").includes("image")
  ) {
    return (
      <ImageViewer
        style={{ height: mediaHeight, width }}
        imageUrls={imgRender}
        renderIndicator={() => null}
        onSwipeDown={closeSuperModal}
        enableSwipeDown
        saveToLocalByLongPress={false}
      />
    );
  }
  if (
    (item?.media_mime_type || "").includes("video") ||
    (item?.media_type || "").includes("video")
  ) {
    return (
      <View style={styles.viewVideo}>
        <View
          style={[
            styles.styleVideo,
            { height: isLanscape ? "100%" : (Device.width / 16) * 9 },
          ]}
        >
          <View style={isLanscape ? styles.viewLanscape : styles.viewPortrait}>
            {renderVideo()}
          </View>
        </View>
      </View>
    );
  }
};

export default React.memo(Media);

const styles = StyleSheet.create({
  styleVideo: {
    width: "100%",
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },
  viewLanscape: {
    height: Device.width,
    width: Device.height,
    transform: [{ rotate: "90deg" }],
  },
  viewPortrait: {
    width: "100%",
    height: "100%",
  },
  viewVideo: {
    ...CS.center,
    width: Device.width,
    height: Device.height,
  },
});
