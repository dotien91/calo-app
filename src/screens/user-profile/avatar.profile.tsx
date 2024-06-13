import React, { memo } from "react";
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  ViewStyle,
  Dimensions,
} from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import useStore from "@services/zustand/store";
import { TypedUser } from "shared/models";
import { useTheme } from "@react-navigation/native";
import SkeletonPlaceholder from "@shared-components/skeleton";
import ImageLoad from "@shared-components/image-load/ImageLoad";
import PressableBtn from "@shared-components/button/PressableBtn";
import useUserHelper from "@helpers/hooks/useUserHelper";

interface UploadAvatarProps {
  userInfo: TypedUser | null;
  customStyle?: ViewStyle;
}

const AvatarProfile = ({ userInfo, customStyle }: UploadAvatarProps) => {
  const widthScreen = Dimensions.get("window").width;

  const theme = useTheme();
  const { colors } = theme;
  const userMedia = useStore((store) => store.userMedia);

  const { changeUserMedia, isMe, loading } = useUserHelper();

  const avatarUrl = React.useMemo(() => {
    const data = isMe(userInfo) ? userMedia : userInfo;
    return data?.user_avatar || data?.user_avatar_thumbnail;
  }, [userInfo, userMedia]);

  const coverUrl = React.useMemo(() => {
    return isMe(userInfo) ? userMedia?.user_cover : userInfo?.user_cover;
  }, [userInfo, userMedia]);

  if (!userInfo?._id) {
    return (
      <View style={styles.containerSke}>
        <SkeletonPlaceholder>
          <View style={styles.viewAvatar} />
        </SkeletonPlaceholder>
      </View>
    );
  }

  const renderBg = () => {
    // if (!coverUrl && !isMe(userInfo))
    //   return (
    //     <View
    //       style={{
    //         height: 60,
    //       }}
    //     />
    //   );
    return (
      <View>
        <ImageLoad
          isAvatar={false}
          style={{ height: (widthScreen * 9) / 16, width: widthScreen }}
          source={{
            uri: coverUrl,
          }}
        />
        {isMe(userInfo) && (
          <PressableBtn
            onPress={() => changeUserMedia("user_cover")}
            style={styles.iconCover}
          >
            <Icon
              name="image"
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
            avatarUrl?.length > 0
              ? { uri: avatarUrl }
              : require("@assets/images/default_avatar.jpg")
          }
        />
        {loading && (
          <View
            style={{
              ...CommonStyle.fillParent,
              ...CommonStyle.center,
              zIndex: 1,
              borderRadius: 99,
              width: 33,
              height: 33,
              position: "absolute",
              left: "50%",
              top: "50%",
              marginTop: -25,
              marginLeft: -25,
            }}
          >
            <ActivityIndicator size={"small"} />
          </View>
        )}
        {isMe(userInfo) && (
          <View style={styles.viewCamera}>
            <Icon
              onPress={() => changeUserMedia("user_avatar")}
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
  containerSke: {
    ...CommonStyle.center,
    width: "100%",
    marginTop: 26,
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
    backgroundColor: palette.white,
    padding: 4,
    borderRadius: 99,
  },
});
