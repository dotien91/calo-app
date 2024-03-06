import React, { memo, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  ViewStyle,
  Dimensions,
} from "react-native";
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
import SkeletonPlaceholder from "@shared-components/skeleton";
import ImageLoad from "@shared-components/image-load/ImageLoad";
import PressableBtn from "@shared-components/button/PressableBtn";

interface UploadAvatarProps {
  userInfo: TypedUser | null;
  customStyle?: ViewStyle;
}

const AvatarProfile = ({ userInfo, customStyle }: UploadAvatarProps) => {
  const widthScreen = Dimensions.get("window").width;

  const userData = useStore((store) => store.userData);
  const setUserData = useStore((store) => store.setUserData);

  const theme = useTheme();
  const { colors } = theme;
  const [linkAvatar, setLinkAvatar] = useState(userInfo?.user_avatar || "");
  const [updateing, setUpdating] = useState(false);
  const _setLinkAvatar = useStore((store) => store.setLinkAvatar);

  useEffect(() => {
    setLinkAvatar(userInfo?.user_avatar || "");
  }, [userInfo]);

  const onPressChangeCover = async () => {
    if (updateing) return;
    selectMedia({
      config: { mediaType: "photo", cropping: true, width: 400, height: 400 },
      callback: async (image) => {
        const res = await uploadMedia({
          name: image?.filename || image.path?.split("/")?.reverse()?.[0] || "",
          uri: isIos() ? image.path?.replace("file://", "") : image.path,
          type: image.mime,
        });
        if (res?.[0]?.callback?._id) {
          const params = {
            _id: userData?._id,
            user_cover: res?.[0]?.callback?.media_url,
          };
          setUpdating(true);
          setUserData({
            ...userData,
            user_cover: res?.[0]?.callback?.media_url,
          });
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

  const onPressChangeAvatar = async () => {
    if (updateing) return;
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

  const isMe = React.useMemo(() => {
    return userInfo?._id == userData._id;
  }, [userInfo, userData]);

  if (isMe) userInfo = userData;

  if (!userInfo?._id) {
    return (
      <View style={styles.container}>
        <SkeletonPlaceholder>
          <View style={styles.viewAvatar} />
        </SkeletonPlaceholder>
      </View>
    );
  }

  const renderBg = () => {
    const url = userInfo?.user_cover;
    if (!url && !isMe)
      return (
        <View
          style={{
            height: 60,
          }}
        />
      );
    return (
      <View>
        <ImageLoad
          isAvatar={false}
          style={{ height: (widthScreen * 9) / 16, width: widthScreen }}
          source={{
            uri: url,
          }}
        />
        {isMe && (
          <PressableBtn onPress={onPressChangeCover} style={styles.iconCover}>
            <Icon
              name="camera-outline"
              type={IconType.Ionicons}
              color={colors.text}
              size={25}
            />
          </PressableBtn>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, customStyle && customStyle]}>
      <View style={{ ...CommonStyle.center, flex: 1 }}>
        {renderBg()}
        <Image
          style={[styles.viewAvatar, { position: "absolute", bottom: -50 }]}
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
              marginTop: 70,
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

export default memo(AvatarProfile);

const styles = StyleSheet.create({
  container: {
    ...CommonStyle.center,
    width: "100%",
    paddingBottom: 26,
  },
  viewAvatar: {
    width: 86,
    height: 86,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: palette.white,
  },
  viewCamera: {
    position: "absolute",
    bottom: -50,
    right: Dimensions.get("window").width / 2 - 55,
    width: 30,
    height: 30,
    backgroundColor: palette.background2,
    ...CommonStyle.center,
    borderRadius: 15,
  },
  iconCover: {
    position: "absolute",
    right: 8,
    bottom: 8,
    zIndex: 1,
  },
});
