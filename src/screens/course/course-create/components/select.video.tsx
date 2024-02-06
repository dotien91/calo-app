import React, { useEffect } from "react";
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

interface SelectVideoHookProps {
  link?: string;
  id?: string;
}

const SelectVideoHook = ({ link, id }: SelectVideoHookProps) => {
  const [linkVideo, setLinkVideo] = React.useState("");
  const [updatingVid, setUpdatingVid] = React.useState(false);
  const [idVideo, setIdVideo] = React.useState("");

  useEffect(() => {
    if (link) {
      setLinkVideo(link);
    }
    if (id) {
      setIdVideo(id);
    }
  }, [link, id]);

  const deleteVideo = () => {
    setIdVideo("");
    setLinkVideo("");
  };

  const onPressChangeMedia = async () => {
    selectMedia({
      config: { mediaType: "video" },
      callback: async (image) => {
        const uri = isIos() ? image.path?.replace("file://", "") : image.path;
        setUpdatingVid(true);

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
      <>
        {linkVideo === "" && !updatingVid ? (
          <PressableBtn onPress={onPressChangeMedia}>
            <View
              style={{
                padding: 8,
                borderWidth: 1,
                borderColor: palette.borderColor,
                borderRadius: 8,
              }}
            >
              <Text style={CS.hnRegular}>{translations.post.addVideo}</Text>
            </View>
          </PressableBtn>
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
      </>
    );
  };

  return {
    renderSelectVideo,
    idVideo,
    updatingVid,
  };
};

export default SelectVideoHook;

const styles = StyleSheet.create({
  viewImage: {
    width: 160,
    height: 90,
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
  },
});
