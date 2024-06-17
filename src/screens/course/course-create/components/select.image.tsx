import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { selectMedia } from "@helpers/file.helper";
import { isIos } from "@helpers/device.info.helper";
import { uploadMedia } from "@services/api/post.api";
import PressableBtn from "@shared-components/button/PressableBtn";
import { palette } from "@theme/themes";
import CS from "@theme/styles";
import { translations } from "@localization";
import LoadingUpdateMedia from "./LoadingUpdateMedia";
import IconSvg from "assets/svg";
interface SelectImageHookProps {
  width?: number;
  height?: number;
  link?: string;
  id?: string;
  typeM?: string;
}

const SelectImageHook = ({
  width = 400,
  height = 400,
  link,
  id,
  typeM,
}: SelectImageHookProps) => {
  const [updatingImg, setUpdatingImg] = React.useState(false);
  const [media, setMedia] = React.useState({
    link: link || "",
    id: id || "",
    typeM: typeM || "",
  });

  const clearImage = () => {
    setMedia({
      link: "",
      id: "",
      typeM: "",
    });
  };

  const onPressChangeMedia = async () => {
    setUpdatingImg(true);
    selectMedia({
      config: {
        mediaType: "photo",
        cropping: true,
        width: width,
        height: height,
      },
      callback: async (image) => {
        const res = await uploadMedia({
          name: image?.filename || image.path?.split("/")?.reverse()?.[0] || "",
          uri: isIos() ? image.path?.replace("file://", "") : image.path,
          type: image.mime,
        });
        if (res?.[0]?.callback?._id) {
          setMedia({
            typeM: image.mime,
            id: res[0]?.callback?._id,
            link: res?.[0]?.callback?.media_thumbnail,
          });
          setUpdatingImg(false);
        } else {
          setUpdatingImg(false);
        }
      },
      _finally: () => {
        setUpdatingImg(false);
      },
    });
  };

  const renderSelectImageAudio = () => {
    return (
      <>
        {media.link === "" && !updatingImg ? (
          <PressableBtn onPress={onPressChangeMedia}>
            <View style={styles.viewImageBorder}>
              <Text style={{ ...CS.hnRegular, textAlign: "center" }}>
                {translations.course.uploadCoverImage}
              </Text>
            </View>
          </PressableBtn>
        ) : (
          <View style={styles.viewImage2}>
            {updatingImg ? (
              <View style={styles.viewImageFill}>
                <LoadingUpdateMedia />
              </View>
            ) : (
              <>
                <Image
                  borderRadius={8}
                  source={{ uri: media.link || " " }}
                  style={styles.viewImage2}
                />
                <PressableBtn onPress={clearImage} style={styles.viewClose}>
                  <IconSvg
                    name="icClose"
                    size={16}
                    color={palette.textOpacity8}
                  />
                </PressableBtn>
              </>
            )}
          </View>
        )}
      </>
    );
  };

  return {
    idImage: media.id,
    updatingImg,
    renderSelectImageAudio,
  };
};

export default SelectImageHook;

const styles = StyleSheet.create({
  // viewImage: {
  //   width: 160,
  //   height: 90,
  //   backgroundColor: palette.placeholder,
  // },
  viewImage2: {
    width: 90,
    height: 120,
  },
  viewImageBorder: {
    padding: 8,
    borderWidth: 1,
    borderColor: palette.borderColor,
    borderRadius: 8,
    width: 90,
    height: 120,
    ...CS.center,
  },
  viewImageFill: {
    ...CS.fillParent,
    ...CS.center,
    backgroundColor: palette.placeholder,
    borderRadius: 8,
  },
  viewClose: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    ...CS.center,
    backgroundColor: palette.btnInactive,
    zIndex: 1,
  },
});
