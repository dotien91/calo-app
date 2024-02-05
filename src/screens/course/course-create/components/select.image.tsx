import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { selectMedia } from "@helpers/file.helper";
import { isIos } from "@helpers/device.info.helper";
import { uploadMedia } from "@services/api/post";
import PressableBtn from "@shared-components/button/PressableBtn";
import { palette } from "@theme/themes";
import CS from "@theme/styles";
import { translations } from "@localization";
import LoadingUpdateMedia from "./LoadingUpdateMedia";
interface SelectImageHookProps {
  width?: number;
  height?: number;
}

const SelectImageHook = ({
  width = 400,
  height = 400,
}: SelectImageHookProps) => {
  const [linkImage, setLinkImage] = React.useState("");
  const [updatingImg, setUpdatingImg] = React.useState(false);
  const [idImage, setIdImage] = React.useState("");

  const onPressChangeMedia = async () => {
    selectMedia({
      config: {
        mediaType: "photo",
        cropping: true,
        width: width,
        height: height,
      },
      callback: async (image) => {
        const uri = isIos() ? image.path?.replace("file://", "") : image.path;
        setUpdatingImg(true);

        const res = await uploadMedia({
          name: image?.filename || image.path?.split("/")?.reverse()?.[0] || "",
          uri: uri,
          type: image.mime,
        });
        if (res?.[0]?.callback?._id) {
          setIdImage(res[0]?.callback?._id);
          setLinkImage(res?.[0]?.callback?.media_thumbnail);
          setUpdatingImg(false);
        } else {
          setUpdatingImg(false);
        }
      },
    });
  };

  const renderSelectImage = () => {
    return (
      <>
        {linkImage === "" && !updatingImg ? (
          <PressableBtn onPress={onPressChangeMedia}>
            <View
              style={{
                padding: 8,
                borderWidth: 1,
                borderColor: palette.borderColor,
                borderRadius: 8,
              }}
            >
              <Text style={CS.hnRegular}>
                {translations.course.uploadCoverImage}
              </Text>
            </View>
          </PressableBtn>
        ) : (
          <View style={styles.viewImage}>
            <Image source={{ uri: linkImage }} style={styles.viewImage} />
            {updatingImg && (
              <View style={styles.viewImageFill}>
                <LoadingUpdateMedia />
              </View>
            )}
          </View>
        )}
      </>
    );
  };

  return {
    renderSelectImage,
    idImage,
    updatingImg,
  };
};

export default SelectImageHook;

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
});
