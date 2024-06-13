import * as React from "react";
import { useTheme, useIsFocused } from "@react-navigation/native";
import { Text, View, Pressable, Image, ViewStyle } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import Video from "react-native-video";

import createStyles from "./post.item.style";
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

const ListFile = ({ listFile, styleContainer = {} }: ListFileProps) => {
  const listMedia = listFile.filter(
    (i: any) =>
      i.media_mime_type.includes("image") ||
      i.media_mime_type.includes("video"),
  );
  const theme = useTheme();
  const { colors } = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);
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
      <Video
        source={{ uri: listMedia[0].media_url }}
        ref={refVideo}
        paused={pause}
        style={[styles.image11, { backgroundColor: palette.black }]}
        useNativeControls
        width={styles.image11.width}
        height={styles.image11.height}
      />
    );
  };

  if (listMedia.length == 1) {
    if (listMedia[0].media_mime_type.includes("video"))
      return (
        <ViewportAwareImage
          onViewportEnter={playVideo}
          onViewportLeave={stopVideo}
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
          source={{ uri: listMedia[0].media_thumbnail }}
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
            source={{ uri: listMedia[0].media_thumbnail }}
          />
          {listMedia[0].media_mime_type.includes("video") && <PlayVideo />}
        </Pressable>
        <Pressable onPress={showImage1} style={styles.imageNormal}>
          <Image
            style={styles.imageNormal}
            source={{ uri: listMedia[1].media_thumbnail }}
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
            source={{ uri: listMedia[0].media_thumbnail }}
          />
          {listMedia[0].media_mime_type.includes("video") && <PlayVideo />}
        </Pressable>
        <View style={{ ...CommonStyle.flex1, gap: 4 }}>
          <Pressable onPress={showImage1} style={CommonStyle.flex1}>
            <Image
              style={styles.imageNormal}
              source={{ uri: listMedia[1].media_thumbnail }}
            />
            {listMedia[1].media_mime_type.includes("video") && <PlayVideo />}
          </Pressable>
          <Pressable onPress={showImage2} style={CommonStyle.flex1}>
            <Image
              style={styles.imageNormal}
              source={{ uri: listMedia[2].media_thumbnail }}
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

export default ListFile;
