import React from "react";

import VideoPlayer from "@shared-components/video.player.component";
import { Device } from "@utils/device.ui.utils";
import ImageLoad from "@shared-components/image-load/ImageLoad";

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

  if (
    (item?.media_mime_type || "").includes("image") ||
    (item?.media_type || "").includes("image")
  ) {
    return (
      <ImageLoad
        source={{ uri: item?.media_url }}
        style={{ height: mediaHeight, width }}
        resizeMode="contain"
        showImageDefault={false}
      />
    );
  }
  if (
    (item?.media_mime_type || "").includes("video") ||
    (item?.media_type || "").includes("video")
  ) {
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
