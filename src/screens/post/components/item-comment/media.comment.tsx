import * as React from "react";
import { useTheme, useIsFocused } from "@react-navigation/native";
import {
  Text,
  View,
  Pressable,
  Image,
  ViewStyle,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import Video from "react-native-video";
import CommonStyle from "@theme/styles";
import { TypedMedia } from "shared/models";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { palette } from "@theme/themes";
import { Viewport } from "@skele/components";

const ViewportAwareImage = Viewport.Aware(View);

interface ListFileProps {
  listFile: TypedMedia[];
  styleContainer?: ViewStyle;
}

const FileMedia = ({ listFile, styleContainer = {} }: ListFileProps) => {
  const listMedia = listFile.filter(
    (i: any) =>
      i.media_mime_type.includes("image") ||
      i.media_mime_type.includes("video"),
  );
  const theme = useTheme();
  const { colors } = theme;
  const refVideo = React.useRef<Video>();
  const [pause, setPause] = React.useState(true);
  const isVisible = React.useRef(false);

  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (!isFocused) {
      refVideo.current?.setNativeProps({ paused: true });
      setPause(true);
    } else {
      if (isVisible.current) {
        playVideo();
      }
    }
  }, [isFocused]);

  const playVideo = () => {
    isVisible.current = true;
    setPause(false);
    refVideo.current?.setNativeProps({ paused: false });
  };

  const stopVideo = () => {
    isVisible.current = false;
    setPause(true);
    refVideo.current?.setNativeProps({ paused: true });
  };

  const showImageVideo = (index: number) => {
    const listMedia = listFile.filter(
      (i: any) =>
        i.media_mime_type.includes("image") ||
        i.media_mime_type.includes("video"),
    );
    showSuperModal({
      contentModalType: EnumModalContentType.Library,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        listMedia,
        index,
      },
    });
  };

  const PlayVideo = () => {
    return (
      <View style={styles.viewPlayvideo}>
        <Icon
          size={56}
          name={"play-circle"}
          type={IconType.Ionicons}
          color={palette.white}
        />
      </View>
    );
  };

  const showImage0 = () => {
    showImageVideo(0);
  };
  const showImage1 = () => {
    showImageVideo(1);
  };
  const showImage2 = () => {
    showImageVideo(2);
  };
  const renderVideoPlayer = () => {
    return (
      <TouchableOpacity onPress={showImage0}>
        <Video
          onPress={showImage0}
          source={{ uri: listMedia[0].media_url }}
          ref={refVideo}
          paused={pause}
          style={[styles.image11, { backgroundColor: palette.black }]}
          useNativeControls
          width={styles.image11.width}
          height={styles.image11.height}
        />
      </TouchableOpacity>
    );
  };

  if (listMedia.length == 1) {
    if (listMedia[0].media_mime_type.includes("video"))
      return (
        <ViewportAwareImage
          onViewportEnter={playVideo}
          onViewportLeave={stopVideo}
          style={styles.image11}
        >
          {renderVideoPlayer()}
        </ViewportAwareImage>
      );
    return (
      <Pressable
        onPress={showImage0}
        style={[styles.viewImage1, styleContainer]}
      >
        <Image
          style={styles.image11}
          source={{
            uri: listMedia[0].media_thumbnail || listMedia[0].media_url,
          }}
        />
        {listMedia[0].media_mime_type.includes("video") && <PlayVideo />}
      </Pressable>
    );
  }
  if (listMedia.length == 2) {
    return (
      <View style={[styles.viewImage2, styleContainer]}>
        <Pressable onPress={showImage0} style={styles.imageNormal}>
          <Image
            style={styles.imageNormal}
            source={{
              uri: listMedia[0].media_thumbnail || listMedia[0].media_url,
            }}
          />
          {listMedia[0].media_mime_type.includes("video") && <PlayVideo />}
        </Pressable>
        <Pressable onPress={showImage1} style={styles.imageNormal}>
          <Image
            style={styles.imageNormal}
            source={{
              uri: listMedia[1].media_thumbnail || listMedia[1].media_url,
            }}
          />
          {listMedia[1].media_mime_type.includes("video") && <PlayVideo />}
        </Pressable>
      </View>
    );
  }
  if (listMedia.length >= 3) {
    return (
      <View style={[styles.viewImage3, styleContainer]}>
        <Pressable onPress={showImage0} style={styles.imageNormal}>
          <Image
            style={styles.imageNormal}
            source={{
              uri: listMedia[0].media_thumbnail || listMedia[0].media_url,
            }}
          />
          {listMedia[0].media_mime_type.includes("video") && <PlayVideo />}
        </Pressable>
        <View style={{ ...CommonStyle.flex1, gap: 4 }}>
          <Pressable onPress={showImage1} style={CommonStyle.flex1}>
            <Image
              style={styles.imageNormal}
              source={{
                uri: listMedia[1].media_thumbnail || listMedia[1].media_url,
              }}
            />
            {listMedia[1].media_mime_type.includes("video") && <PlayVideo />}
          </Pressable>
          <Pressable onPress={showImage2} style={CommonStyle.flex1}>
            <Image
              style={styles.imageNormal}
              source={{
                uri: listMedia[2].media_thumbnail || listMedia[2].media_url,
              }}
            />
            {listMedia.length > 3 && (
              <View style={styles.viewMore}>
                <Text style={{ color: colors.primary }}>
                  +{listMedia.length - 3}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  return null;
};

export default FileMedia;

const { width } = Dimensions.get("screen");

const PADDING_HORIZONTAL = 16;
// const SIZE_AVATAR = 32;
const FONT_SIZE = 16;
const BORDER_RADIUS1 = 4;
const BORDER_RADIUS2 = 4;
// const PADDING_LEFT = 12;
const SIZE_IMAGE1 = width / 2;
const Margin = 45;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: PADDING_HORIZONTAL,
    marginBottom: 2,
    backgroundColor: palette.background,
    paddingTop: 14,
    paddingBottom: 4,
    alignItems: "center",
  },
  viewPlayvideo: {
    ...CommonStyle.fillParent,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image11: {
    height: SIZE_IMAGE1,
    width: SIZE_IMAGE1,
    borderRadius: BORDER_RADIUS1,
    ...CommonStyle.center,
    alignSelf: "center",
  },
  viewImage1: {
    marginLeft: Margin,
  },
  viewImage2: {
    flexDirection: "row",
    height: (SIZE_IMAGE1 - 4) / 2,
    gap: 4,
  },
  viewImage3: {
    flexDirection: "row",
    height: ((SIZE_IMAGE1 - 4) * 3) / 5,
    gap: 4,
  },
  imageNormal: {
    ...CommonStyle.flex1,
    borderRadius: BORDER_RADIUS2,
  },
  containerLikeShare: {
    flexDirection: "row",
    marginTop: 4,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 4,
  },
  viewLike: {
    ...CommonStyle.flex1,
    flexDirection: "row",
    alignItems: "center",
  },
  textLikeShare: {
    ...CommonStyle.hnRegular,
    fontSize: FONT_SIZE,
    color: palette.textOpacity8,
    marginLeft: 8,
  },
  text: {
    ...CommonStyle.hnRegular,
    fontSize: FONT_SIZE,
    color: palette.textOpacity8,
  },
  viewMore: {
    ...CommonStyle.fillParent,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.blackOverlay,
    borderRadius: 4,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
