import React from "react";
import FastImage from "react-native-fast-image";

import VideoPlayer from "@shared-components/video.player.component";
import { Device } from "@utils/device.ui.utils";

interface Media {
  item: any;
}

const width = Device.width;

const Media = ({ item }: Media) => {
  const media_width = item?.media_meta?.find((i) => i.key === "width")?.value;
  const media_height = item?.media_meta?.find((i) => i.key === "height")?.value;
  const mediaHeight =
    media_width && media_height
      ? width / (Number(media_width) / Number(media_height))
      : width;

  if ((item?.media_type || "").includes("image")) {
    return (
      <FastImage
        source={{ uri: item?.media_url }}
        style={{ height: mediaHeight, width }}
        resizeMode="contain"
      />
    );
  }
  if ((item?.media_type || "").includes("video")) {
    return (
      <VideoPlayer
        mediaUrl={item?.media_url}
        height={mediaHeight}
        width={width}
        resizeMode="contain"
        autoPlay={true}
      />
    );
  }
};

export default React.memo(Media);
