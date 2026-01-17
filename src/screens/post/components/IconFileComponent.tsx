import Video from "react-native-video";
import React from "react";
import { StyleSheet, View } from "react-native";

import ImageLoad from "./ImageLoad";

import { palette } from "@theme/themes";
import IconSvg from "assets/svg";

interface TypeIconFileComponent {
  file: any;
  sizeIcon: number;
}

const IconFileComponent = ({ file, sizeIcon = 32 }: TypeIconFileComponent) => {
  // Check file types using MIME type strings instead of react-native-document-picker types
  const fileType = file?.type || "";
  
  if (fileType.includes("audio")) {
    return (
      <View style={styles.container}>
        <IconSvg name="icAudio" size={sizeIcon} />
      </View>
    );
  }

  if (fileType.includes("csv") || fileType.includes("text/csv")) {
    return (
      <View style={styles.container}>
        <IconSvg name="icCsv" size={sizeIcon} />
      </View>
    );
  }
  if (
    fileType.includes("msword") ||
    fileType.includes("application/msword") ||
    fileType.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
  ) {
    return (
      <View style={styles.container}>
        <IconSvg name="icDoc" size={sizeIcon} />
      </View>
    );
  }

  if (fileType.includes("pdf") || fileType.includes("application/pdf")) {
    return (
      <View style={styles.container}>
        <IconSvg name="icPdf" size={sizeIcon} />
      </View>
    );
  }

  if (fileType.includes("text/plain") || fileType.includes("text")) {
    return (
      <View style={styles.container}>
        <IconSvg name="icPlanText" size={sizeIcon} />
      </View>
    );
  }

  if (
    fileType.includes("application/vnd.ms-powerpoint") ||
    fileType.includes("application/vnd.openxmlformats-officedocument.presentationml.presentation")
  ) {
    return (
      <View style={styles.container}>
        <IconSvg name="icPpt" size={sizeIcon} />
      </View>
    );
  }

  if (
    fileType.includes("application/vnd.ms-excel") ||
    fileType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  ) {
    return (
      <View style={styles.container}>
        <IconSvg name="icXls" size={sizeIcon} />
      </View>
    );
  }

  if (fileType.includes("zip") || fileType.includes("application/zip")) {
    return (
      <View style={styles.container}>
        <IconSvg name="icZip" size={sizeIcon} />
      </View>
    );
  }

  if (file?.type?.includes("video")) {
    if (file.thumbnail && (file.thumbnail || "").includes("https://")) {
      return (
        <View style={styles.container}>
          <ImageLoad
            source={{ uri: file.thumbnail }}
            style={{ ...StyleSheet.absoluteFillObject, borderRadius: 10 }}
            resizeMode="cover"
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Video
          paused={true}
          source={{ uri: file.uri }}
          style={{
            ...StyleSheet.absoluteFillObject,
            borderRadius: 10,
          }}
        />
      </View>
    );
  }

  if (file?.type?.includes("image")) {
    return (
      <View style={styles.container}>
        <ImageLoad
          source={{ uri: file.uri }}
          style={{ ...StyleSheet.absoluteFillObject, borderRadius: 10 }}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <IconSvg name="icFile" size={sizeIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: palette.background2,
    borderRadius: 10,
  },
});

export default IconFileComponent;
