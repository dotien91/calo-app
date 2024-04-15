import TextBase from "@shared-components/TextBase";
import { palette } from "@theme/themes";
import React from "react";
import { StyleSheet, View } from "react-native";

const ItemMember = () => {
  return (
    <View style={styles.infoMember}>
      <View style={styles.viewImgImage} />
      <TextBase fontSize={16} fontWeight="700" title="Manh Hai" />
      <TextBase fontSize={12} fontWeight="400" title="Business Coach" />
      <View style={styles.viewTitle}>
        <TextBase fontSize={14} fontWeight="400" title="IKI Group" />
      </View>
    </View>
  );
};

export default ItemMember;

const styles = StyleSheet.create({
  viewTitle: {
    marginTop: 10,
    marginBottom: 10,
  },
  infoMember: {
    height: 134,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  viewImgImage: {
    height: 56,
    width: 56,
    borderRadius: 99,
    backgroundColor: palette.pink,
  },
});
