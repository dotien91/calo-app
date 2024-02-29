import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";

const InputViewModal = ({ title, closeModal, cb }) => {
  const [txtInput, settxtInput] = useState("");
  return (
    <View style={styles.modalInner}>
      <Text style={styles.title}>{title}</Text>
      <TextInput
        onChangeText={(text) => settxtInput(text)}
        placeholder="Nhập tên của nhóm"
        style={{
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 8,
          marginVertical: 5,
          height: 40,
          paddingHorizontal: 16,
        }}
        value={txtInput}
      />
      <View style={CommonStyle.flexRear}>
        <TouchableOpacity
          style={[styles.btnStyle, { flex: 1 }]}
          onPress={closeModal}
        >
          <Text style={styles.txtBtn}>Cancel</Text>
        </TouchableOpacity>
        <View style={{ width: 10 }} />
        <TouchableOpacity
          style={[
            styles.btnStyle,
            { backgroundColor: palette.danger, flex: 1 },
          ]}
          onPress={() => {
            if (cb) cb(txtInput);
          }}
        >
          <Text style={styles.txtBtn}>Ok</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InputViewModal;

const styles = StyleSheet.create({
  modalInner: {
    flex: 1,
    backgroundColor: palette.white,
    borderRadius: 6,
    padding: 30,
    overflow: "hidden",
  },
  btnStyle: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: palette.green,
    borderRadius: 99,
    ...CommonStyle.flexCenter,
  },
  txtBtn: {
    ...CommonStyle.hnSemiBold,
    fontSize: 16,
    color: palette.white,
  },
  title: {
    ...CommonStyle.hnBold,
    fontSize: 20,
    color: palette.text,
    textAlign: "center",
  },
});
