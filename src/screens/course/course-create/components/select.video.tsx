import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { WindowWidth } from "@freakycoder/react-native-helpers";

import { selectMedia } from "@helpers/file.helper";
import { isIos } from "@helpers/device.info.helper";
import { uploadMedia } from "@services/api/post";
import PressableBtn from "@shared-components/button/PressableBtn";
import { palette } from "@theme/themes";
import CS from "@theme/styles";
import { translations } from "@localization";
import LoadingUpdateMedia from "./LoadingUpdateMedia";
import { showToast } from "@helpers/super.modal.helper";
import TextBase from "@shared-components/TextBase";
import IconSvg from "assets/svg";
import { EnumColors } from "models";

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
  const [updatingVid, setUpdatingVid] = React.useState(false);
  const [process, setProcess] = useState(0);
  const [media, setMedia] = useState({
    link: link || "",
    id: id || "",
    typeM: typeM || "",
  });
  // useEffect(() => {
  //   if (link) {
  //     setMedia({ ...media, link: link });
  //   }
  //   if (id) {
  //     setMedia({ ...media, id: id });
  //   }
  //   if (typeM) {
  //     setMedia({ ...media, typeM: typeM });
  //   }
  // }, [link, id, typeM]);

  const deleteVideo = () => {
    setMedia({ link: "", id: "", typeM: "" });
  };

  const onUploadProgress = function (progressEvent) {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total,
    );
    setProcess(percentCompleted);
  };

  const onPressChangeMedia = async () => {
    selectMedia({
      config: { mediaType: type },
      callback: async (image) => {
        const uri = isIos() ? image.path?.replace("file://", "") : image.path;
        setUpdatingVid(true);
        const res = await uploadMedia(
          {
            name:
              image?.filename || image.path?.split("/")?.reverse()?.[0] || "",
            uri: uri,
            type: image.mime,
          },
          onUploadProgress,
        );
        if (res?.[0]?.callback?._id) {
          setMedia({
            typeM: image.mime,
            id: res[0]?.callback?._id,
            link: res?.[0]?.callback?.media_thumbnail,
          });
          setUpdatingVid(false);
          setProcess(0);
        } else {
          setUpdatingVid(false);
          showToast({
            type: "error",
            message: translations.course.uploadVideoFailed,
          });
        }
      },
    });
  };

  const IconText = ({ nameIcon, text }: { nameIcon: string; text: string }) => {
    return (
      <View style={styles.viewIcon}>
        <TextBase fontSize={16} fontWeight="400" color={EnumColors.white}>
          {text}
        </TextBase>
        <IconSvg name={nameIcon} size={20} color={EnumColors.white} />
      </View>
    );
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
        {media.link === "" && !updatingVid ? (
          <View>
            <Text style={[CS.hnRegular, { color: palette.primary }]}>
              {placeholder || translations.course.uploadCoverImageOrVideo}
            </Text>
          </View>
        ) : (
          <View>
            <Image source={{ uri: media.link }} style={styles.viewImage} />
            {updatingVid && (
              <View style={styles.viewImageFill}>
                <LoadingUpdateMedia />
                <View style={styles.viewImageFill}>
                  <ActivityIndicator size={"small"} />
                  <TextBase fontSize={12} fontWeight="500" color="primary">
                    {process}%
                  </TextBase>
                </View>
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

  const renderSelectBackground = () => {
    return (
      <ImageBackground
        source={require("../../../../assets/images/bgeliteclub.png")}
        style={styles.viewImage}
        borderRadius={8}
      >
        <PressableBtn onPress={onPressChangeMedia} style={styles.styleBtn}>
          <View style={styles.viewGally}>
            <IconText nameIcon="icImage" text={translations.club.gallery} />
          </View>
        </PressableBtn>
        <Image source={{ uri: media.link }} style={styles.viewImage1} />
        {updatingVid && (
          <View style={styles.viewImageFill}>
            <LoadingUpdateMedia />
            <View style={styles.viewImageFill}>
              <ActivityIndicator size={"small"} />
              <TextBase fontSize={12} fontWeight="500" color="primary">
                {process}%
              </TextBase>
            </View>
          </View>
        )}
      </ImageBackground>
    );
  };

  return {
    renderSelectBackground,
    renderSelectVideo,
    idVideo: media.id,
    link: media.link,
    updatingVid,
    typeMedia: media.typeM,
    setMedia,
    onPressChangeMedia,
  };
};

export default SelectVideoHook;

const styles = StyleSheet.create({
  viewImage: {
    height: (WindowWidth / 16) * 9,
    backgroundColor: palette.placeholder,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  viewImageFill: {
    ...CS.fillParent,
    ...CS.center,
    backgroundColor: palette.placeholder,
    ...CS.row,
    gap: 8,
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
  viewGally: {
    ...CS.center,
  },
  viewIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
  },
  styleBtn: {
    backgroundColor: palette.placeholder,
    width: 98,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 8,
    right: 8,
    zIndex: 99,
  },
  viewImage1: {
    height: (WindowWidth / 16) * 9,
    borderRadius: 8,
  },
});
