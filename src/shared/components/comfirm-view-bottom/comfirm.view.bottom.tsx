import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";

const ConfirmViewBottom = ({ nameAction, title, closeModal, cb }) => {
  // console.log("ConfirmViewBottom", data)
  return (
    <View style={styles.modalInner}>
      <Text style={styles.title}>{title}</Text>
      <View style={CommonStyle.flexRear}>
        <TouchableOpacity
          onPress={() => {
            if (cb) {
              cb();
              closeModal();
            }
          }}
          style={{
            backgroundColor: palette.btnRedPrimary,
            height: 48,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
            borderRadius: 12,
          }}
        >
          <Text
            style={{ color: palette.white, fontSize: 16, fontWeight: "600" }}
          >
            {nameAction}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ConfirmViewBottom;

const styles = StyleSheet.create({
  modalInner: {
    minWidth: "60%",
    backgroundColor: palette.white,
    borderRadius: 6,
    padding: 30,
    overflow: "hidden",
  },
  title: {
    ...CommonStyle.hnBold,
    fontSize: 20,
    color: palette.text,
    textAlign: "center",
  },
});
