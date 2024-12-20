import React, { memo } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";

import CS from "@theme/styles";
import { ICourseItem } from "models/course.model";
import { palette } from "@theme/themes";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";

interface AlbumViewProps {
  data?: ICourseItem;
}

const HEIGHT_IMAGE = (SCREEN_WIDTH - 56) / 4;

const AlbumView = ({ data }: AlbumViewProps) => {
  const allbum = data?.media_album;
  // console.log("album...", allbum);

  const showImageVideo = (index: number) => {
    showSuperModal({
      contentModalType: EnumModalContentType.Library,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        listMedia: allbum,
        index,
      },
    });
  };

  if (!allbum || allbum?.length == 0) {
    return null;
  }

  const length = allbum.length;

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{"Album"}</Text>
      <View style={styles.viewImage}>
        {allbum?.map((item, index) => {
          if (index > 3) {
            return null;
          }
          return (
            <TouchableOpacity
              key={index}
              style={styles.imageNormal}
              onPress={() => showImageVideo(index)}
            >
              <Image
                style={styles.imageNormal}
                source={{ uri: item.media_thumbnail }}
              />
              {index == 3 && length - 4 > 0 ? (
                <View style={styles.viewMore}>
                  <Text style={styles.txtMore}>+{length - 4}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
export default memo(AlbumView);

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  viewImage: {
    // marginHorizontal: 16,
    gap: 8,
    ...CS.row,
    marginTop: 8,
  },
  imageNormal: {
    width: HEIGHT_IMAGE,
    height: HEIGHT_IMAGE,
  },
  paragraph: {
    ...CS.hnMedium,
    fontSize: 20,
    minHeight: 20,
  },
  viewMore: {
    ...CS.fillParent,
    ...CS.center,
    backgroundColor: palette.textOpacity4,
  },
  txtMore: {
    ...CS.hnRegular,
    color: palette.white,
    minHeight: 16,
  },
});
