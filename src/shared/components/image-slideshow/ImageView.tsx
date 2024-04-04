import React from "react";
import ImageViewer from "react-native-image-zoom-viewer";

import VideoPlayer from "@shared-components/video.player.component";
import { Device } from "@utils/device.ui.utils";
import { closeSuperModal } from "@helpers/super.modal.helper";

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
