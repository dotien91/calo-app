import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import Input from "@shared-components/form/Input";
import { translations } from "@localization";
import Button from "@shared-components/button/Button";

const InputViewModal = ({
  defaultValue,
  title,
  closeModal,
  cb,
  placeholder,
}) => {
  console.log("defaultValuedefaultValue", defaultValue);
  const [text, setText] = React.useState(defaultValue);

  const _onPress = () => {
    if (cb) cb(text);
    closeModal();
  };

  return (
    <View style={styles.modalInner}>
      <Text style={styles.title}>{title}</Text>
      <View style={[CommonStyle.flexStart, { flex: 1 }]}>
        <Input
          defaultValue={text}
          cb={setText}
          placeholder={placeholder}
          customStyle={{ flex: 1, width: "100%" }}
        />
        <Button
          style={{ marginLeft: 8 }}
          type={(text || "").length ? "primary" : "disabled"}
          text={translations.login.send}
          onPress={_onPress}
        />
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
    paddingHorizontal: 16,
    paddingBottom: 26,
    overflow: "hidden",
  },
  title: {
    ...CommonStyle.hnSemiBold,
    fontSize: 18,
    color: palette.text,
    textAlign: "center",
    marginBottom: 12,
  },
});
