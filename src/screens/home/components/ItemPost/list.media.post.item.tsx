import * as React from "react";
import { useTheme } from "@react-navigation/native";
import { Text, View, Pressable, Image } from "react-native";

import createStyles from "./ItemPost.style";

import CommonStyle from "@theme/styles";
import { TypedMedia } from "shared/models";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

const BORDER_RADIUS2 = 12;

interface ListFileProps {
  listFile: TypedMedia[];
  sizeImage2: number;
}

const ListFile = ({ listFile, sizeImage2 }: ListFileProps) => {
  const listMedia = listFile.filter(
    (i: any) =>
      i.media_mime_type.includes("image") ||
      i.media_mime_type.includes("video"),
  );

  const theme = useTheme();
  const { colors } = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const showImageVideo = (index: number) => {
    //gọi supermodal hiển thị danh sách image, video
    // truyền vào danh sách
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
        indexMedia: index,
      },
    });
  };

  const PlayVideo = () => {
    return (
      <View
        style={{
          ...CommonStyle.fillParent,
          zIndex: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon
          size={62}
          name={"play-circle"}
          type={IconType.Ionicons}
          color={colors.primary}
        />
      </View>
    );
  };

  if (listMedia.length == 1) {
    return (
      <Pressable onPress={() => showImageVideo(0)} style={styles.image11}>
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
      <View style={{ flexDirection: "row", height: sizeImage2, gap: 4 }}>
        <Pressable onPress={() => showImageVideo(0)} style={styles.image12}>
          <Image
            style={styles.image12}
            source={{ uri: listMedia[0].media_thumbnail }}
          />
          {listMedia[0].media_mime_type.includes("video") && <PlayVideo />}
        </Pressable>
        <Pressable onPress={() => showImageVideo(1)} style={styles.image22}>
          <Image
            style={styles.image22}
            source={{ uri: listMedia[1].media_thumbnail }}
          />
          {listMedia[1].media_mime_type.includes("video") && <PlayVideo />}
        </Pressable>
      </View>
    );
  }
  if (listMedia.length == 3) {
    return (
      <View style={{ flexDirection: "row", height: sizeImage2, gap: 4 }}>
        <Pressable onPress={() => showImageVideo(0)} style={styles.image12}>
          <Image
            style={styles.image12}
            source={{ uri: listMedia[0].media_thumbnail }}
          />
          {listMedia[0].media_mime_type.includes("video") && <PlayVideo />}
        </Pressable>
        <View style={{ ...CommonStyle.flex1, gap: 4 }}>
          <Pressable onPress={() => showImageVideo(1)} style={styles.image23}>
            <Image
              style={styles.image23}
              source={{ uri: listMedia[1].media_thumbnail }}
            />
            {listMedia[1].media_mime_type.includes("video") && <PlayVideo />}
          </Pressable>
          <Pressable onPress={() => showImageVideo(2)} style={styles.image33}>
            <Image
              style={styles.image33}
              source={{ uri: listMedia[2].media_thumbnail }}
            />
            {listMedia[2].media_mime_type.includes("video") && <PlayVideo />}
          </Pressable>
        </View>
      </View>
    );
  }
  if (listMedia.length > 3) {
    return (
      <View style={{ flexDirection: "row", height: sizeImage2, gap: 4 }}>
        <Pressable onPress={() => showImageVideo(0)} style={styles.image12}>
          <Image
            style={styles.image12}
            source={{ uri: listMedia[0].media_thumbnail }}
          />
          {listMedia[0].media_mime_type.includes("video") && <PlayVideo />}
        </Pressable>
        <View style={{ ...CommonStyle.flex1, gap: 4 }}>
          <Pressable
            onPress={() => showImageVideo(1)}
            style={{ ...CommonStyle.flex1 }}
          >
            <Image
              style={{
                ...CommonStyle.flex1,
                borderTopRightRadius: BORDER_RADIUS2,
              }}
              source={{ uri: listMedia[1].media_thumbnail }}
            />
            {listMedia[1].media_mime_type.includes("video") && <PlayVideo />}
          </Pressable>
          <Pressable
            onPress={() => showImageVideo(2)}
            style={{ ...CommonStyle.flex1 }}
          >
            <Image
              style={{
                ...CommonStyle.flex1,
                borderBottomRightRadius: BORDER_RADIUS2,
              }}
              source={{ uri: listMedia[2].media_thumbnail }}
            />
            <View
              style={{
                ...CommonStyle.fillParent,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.blackOverlay,
                borderBottomRightRadius: 12,
              }}
            >
              <Text style={{ color: colors.primary }}>
                +{listMedia.length - 3}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  }

  return null;
};

export default ListFile;
