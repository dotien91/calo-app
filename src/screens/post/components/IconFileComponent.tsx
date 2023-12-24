import ImageLoad from "./ImageLoad";
import Video from "react-native-video";
import React from "react";
import { StyleSheet, View } from "react-native";
import { types } from "react-native-document-picker";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";

interface TypeIconFileComponent {
  file: any;
  sizeIcon: number;
}

const IconFileComponent = ({ file, sizeIcon = 32 }: TypeIconFileComponent) => {
  if (file.type.includes(types.audio.slice(0, types.audio.length - 1))) {
    return (
      <View style={styles.container}>
        <IconSvg name="icAudio" size={sizeIcon} />
      </View>
    );
  }

  if (file.type.includes(types.csv.slice(0, types.csv.length - 1))) {
    return (
      <View style={styles.container}>
        <IconSvg name="icCsv" size={sizeIcon} />
      </View>
    );
  }
  if (
    file.type.includes(types.doc.slice(0, types.doc.length - 1)) ||
    file.type.includes(types.docx.slice(0, types.docx.length - 1))
  ) {
    return (
      <View style={styles.container}>
        <IconSvg name="icDoc" size={sizeIcon} />
      </View>
    );
  }

  if (file.type.includes(types.pdf.slice(0, types.pdf.length - 1))) {
    return (
      <View style={styles.container}>
        <IconSvg name="icPdf" size={sizeIcon} />
      </View>
    );
  }

  if (
    file.type.includes(types.plainText.slice(0, types.plainText.length - 1))
  ) {
    return (
      <View style={styles.container}>
        <IconSvg name="icPlanText" size={sizeIcon} />
      </View>
    );
  }

  if (
    file.type.includes(types.ppt.slice(0, types.ppt.length - 1)) ||
    file.type.includes(types.pptx.slice(0, types.pptx.length - 1))
  ) {
    return (
      <View style={styles.container}>
        <IconSvg name="icPpt" size={sizeIcon} />
      </View>
    );
  }

  if (
    file.type.includes(types.xls.slice(0, types.xls.length - 1)) ||
    file.type.includes(types.xlsx.slice(0, types.xlsx.length - 1))
  ) {
    return (
      <View style={styles.container}>
        <IconSvg name="icXls" size={sizeIcon} />
      </View>
    );
  }

  if (file.type.includes(types.zip.slice(0, types.zip.length - 1))) {
    return (
      <View style={styles.container}>
        <IconSvg name="icZip" size={sizeIcon} />
      </View>
    );
  }

  if (file?.type?.includes("video/")) {
    if (file.thumbnail && (file.thumbnail || "").includes("https://")) {
      return (
        <View style={styles.container}>
          <ImageLoad
            source={{ uri: file.thumbnail }}
            style={StyleSheet.absoluteFillObject}
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
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    );
  }

  if (file.type.includes("image/")) {
    return (
      <View style={styles.container}>
        <ImageLoad
          source={{ uri: file.uri }}
          style={StyleSheet.absoluteFillObject}
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
    borderWidth: 1,
    borderColor: palette.borderColor,
  },
});

export default IconFileComponent;
