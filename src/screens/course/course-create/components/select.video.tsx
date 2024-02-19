import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { selectMedia } from "@helpers/file.helper";
import { isIos } from "@helpers/device.info.helper";
import { uploadMedia } from "@services/api/post";
import PressableBtn from "@shared-components/button/PressableBtn";
import { palette } from "@theme/themes";
import CS from "@theme/styles";
import { translations } from "@localization";
import LoadingUpdateMedia from "./LoadingUpdateMedia";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { WindowWidth } from "@freakycoder/react-native-helpers";

interface SelectVideoHookProps {
  link?: string;
  id?: string;
  type?: "photo" | "video" | "any";
  placeholder?: string;
  typeM?: string;
}

const SelectVideoHook = ({
  link,
  id,
  typeM,
  type = "any",
  placeholder,
}: SelectVideoHookProps) => {
  const [linkVideo, setLinkVideo] = React.useState("");
  const [updatingVid, setUpdatingVid] = React.useState(false);
  const [idVideo, setIdVideo] = React.useState("");
  const [typeMedia, setTypeMedia] = useState("");

  useEffect(() => {
    if (link) {
      setLinkVideo(link);
    }
    if (id) {
      setIdVideo(id);
    }
    if (typeM) {
      setTypeMedia(typeM);
    }
  }, [link, id, typeM]);

  const deleteVideo = () => {
    setIdVideo("");
    setLinkVideo("");
    setTypeMedia("");
  };

  const onPressChangeMedia = async () => {
    selectMedia({
      config: { mediaType: type },
      callback: async (image) => {
        const uri = isIos() ? image.path?.replace("file://", "") : image.path;
        setUpdatingVid(true);
        setTypeMedia(image.mime);
        const res = await uploadMedia({
          name: image?.filename || image.path?.split("/")?.reverse()?.[0] || "",
          uri: uri,
          type: image.mime,
        });
        if (res?.[0]?.callback?._id) {
          setIdVideo(res[0]?.callback?._id);
          setLinkVideo(res?.[0]?.callback?.media_thumbnail);
          setUpdatingVid(false);
        } else {
          setUpdatingVid(false);
        }
      },
    });
  };

  const renderSelectVideo = () => {
    return (
      <PressableBtn
        onPress={onPressChangeMedia}
        style={{
          height: (WindowWidth / 16) * 9,
          ...CS.center,
          backgroundColor: palette.placeholder,
        }}
      >
        {linkVideo === "" && !updatingVid ? (
          <View>
            <Text style={[CS.hnRegular, { color: palette.primary }]}>
              {placeholder || translations.course.uploadCoverImageOrVideo}
            </Text>
          </View>
        ) : (
          <View style={styles.viewImage}>
            <Image source={{ uri: linkVideo }} style={styles.viewImage} />
            {updatingVid && (
              <View style={styles.viewImageFill}>
                <LoadingUpdateMedia />
              </View>
            )}
            <View style={styles.deleteViceo}>
              <Icon
                name="close-outline"
                type={IconType.Ionicons}
                size={25}
                onPress={deleteVideo}
              />
            </View>
          </View>
        )}
      </PressableBtn>
    );
  };

  return {
    renderSelectVideo,
    idVideo,
    updatingVid,
    typeMedia,
  };
};

export default SelectVideoHook;

const styles = StyleSheet.create({
  viewImage: {
    width: WindowWidth,
    height: (WindowWidth / 16) * 9,
    backgroundColor: palette.placeholder,
  },
  viewImageFill: {
    ...CS.fillParent,
    ...CS.center,
    backgroundColor: palette.placeholder,
  },
  deleteViceo: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    ...CS.center,
    backgroundColor: palette.placeholder,
  },
});
