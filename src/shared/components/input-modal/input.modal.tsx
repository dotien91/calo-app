import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import Input from "@shared-components/form/Input";
import { translations } from "@localization";
import Button from "@shared-components/button/Button";
import IconSvg from "assets/svg";

interface TypeInputViewModal {
  defaultValue: string;
  title: string;
  closeModal: () => void;
  cb: any;
  placeholder: string;
  icon?: string;
  txtBtn?: string;
}

const InputViewModal = ({
  defaultValue,
  title,
  closeModal,
  cb,
  placeholder,
  icon,
  txtBtn,
}: TypeInputViewModal) => {
  console.log("defaultValuedefaultValue", defaultValue);
  const [text, setText] = React.useState(defaultValue);

  const _onPress = () => {
    if (cb) cb(text);
    closeModal();
  };
  if (icon) {
    return (
      <View style={styles.modalInner}>
        <IconSvg
          name={icon}
          color={palette.blue}
          size={96}
          style={styles.paddingIcon}
        />
        <Text style={styles.title}>{title}</Text>
        <View style={[CommonStyle.flexStart]}>
          <Input
            defaultValue={text}
            cb={setText}
            placeholder={placeholder}
            customStyle={{ flex: 1, width: "100%" }}
          />
        </View>
        <View style={[CommonStyle.flexStart, { marginTop: 32 }]}>
          <Button
            style={{ flex: 1 }}
            type={(text || "").length ? "primary" : "disabled"}
            text={txtBtn || translations.login.send}
            onPress={_onPress}
          />
        </View>
      </View>
    );
  }

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
          text={txtBtn || translations.login.send}
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
    ...CommonStyle.center,
  },
  title: {
    ...CommonStyle.hnSemiBold,
    fontSize: 18,
    color: palette.text,
    textAlign: "center",
    marginBottom: 12,
  },
  paddingIcon: { marginTop: 16, marginBottom: 32 },
});
