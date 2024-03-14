import * as React from "react";
import { useTheme } from "@react-navigation/native";
import { Text, View, Pressable, Image } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import createStyles from "./post.item.style";

import CommonStyle from "@theme/styles";
import { TypedMedia } from "shared/models";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { palette } from "@theme/themes";

interface ListFileProps {
  listFile: TypedMedia[];
}

const ListFile = ({ listFile }: ListFileProps) => {
  const listMedia = listFile.filter(
    (i: any) =>
      i.media_mime_type.includes("image") ||
      i.media_mime_type.includes("video"),
  );
  const theme = useTheme();
  const { colors } = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);

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

  if (listMedia.length == 1) {
    return (
      <Pressable onPress={showImage0} style={styles.image11}>
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
      <View style={styles.viewImage2}>
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
      <View style={styles.viewImage3}>
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
