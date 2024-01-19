import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import eventEmitter from "@services/event-emitter";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import useStore from "@services/zustand/store";
import { TypedUser } from "shared/models";
import { useTheme } from "@react-navigation/native";
import { selectMedia } from "@helpers/file.helper";
import { uploadMedia } from "@services/api/post";
import { isIos } from "@helpers/device.info.helper";
import { updateProfile } from "@services/api/user.api";
import { showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";

interface UploadAvatarProps {
  userInfo: TypedUser;
}

const AvatarProfile = ({ userInfo }: UploadAvatarProps) => {
  const userData = useStore((store) => store.userData);
  const theme = useTheme();
  const { colors } = theme;
  const [linkAvatar, setLinkAvatar] = useState(
    userInfo?.user_avatar_thumbnail || "",
  );
  const [updateing, setUpdating] = useState(false);
  const _setLinkAvatar = useStore((store) => store.setLinkAvatar);

  useEffect(() => {
    setLinkAvatar(userInfo?.user_avatar_thumbnail || "");
  }, [userInfo]);

  const onPressChangeAvatar = async () => {
    selectMedia({
      config: { mediaType: "photo", cropping: true, width: 400, height: 400 },
      callback: async (image) => {
        const res = await uploadMedia({
          name: image?.filename || image.path?.split("/")?.reverse()?.[0] || "",
          uri: isIos() ? image.path?.replace("file://", "") : image.path,
          type: image.mime,
        });
        if (res?.[0]?.callback?._id) {
          setLinkAvatar(res?.[0]?.callback?.media_thumbnail);
          _setLinkAvatar(res?.[0]?.callback?.media_thumbnail);
          const params = {
            _id: userData?._id,
            user_avatar: res?.[0]?.callback?.media_url,
            user_avatar_thumbnail: res?.[0]?.callback?.media_thumbnail,
          };
          setUpdating(true);
          updateProfile(params).then((res) => {
            if (!res.isError) {
              showToast({
                type: "success",
                message: translations.updateSuccess,
              });
              setUpdating(false);
              eventEmitter.emit("reload_list_post");
            } else {
              showToast({
                type: "error",
                message: translations.somethingWentWrong,
              });
              setUpdating(false);
            }
          });
        }
      },
    });
  };

  return (
    <View
      style={{
        ...CommonStyle.center,
        width: "100%",
        paddingVertical: 26,
      }}
    >
      <View style={{ ...styles.viewAvatar, ...CommonStyle.center }}>
        <Image
          style={styles.viewAvatar}
          source={
            linkAvatar.trim().length > 0
              ? { uri: linkAvatar }
              : require("@assets/images/default_avatar.jpg")
          }
        />
        {updateing && (
          <View
            style={{
              ...CommonStyle.fillParent,
              ...CommonStyle.center,
              zIndex: 1,
            }}
          >
            <ActivityIndicator size={"small"} color={colors.text} />
          </View>
        )}
        {userData?._id === userInfo?._id && (
          <View style={styles.viewCamera}>
            <Icon
              onPress={onPressChangeAvatar}
              name="camera-outline"
              type={IconType.Ionicons}
              color={colors.text}
              size={25}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default AvatarProfile;

const styles = StyleSheet.create({
  viewAvatar: { width: 86, height: 86, borderRadius: 30 },
  viewCamera: {
    position: "absolute",
    bottom: 0,
    right: -10,
    width: 30,
    height: 30,
    backgroundColor: palette.background2,
    ...CommonStyle.center,
    borderRadius: 15,
  },
});
