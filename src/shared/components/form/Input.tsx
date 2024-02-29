import React, { useState, useImperativeHandle } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
  TextInputProps,
} from "react-native";
import { palette } from "@theme/themes";
import CommonStyle from "@theme/styles";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import PressableBtn from "@shared-components/button/PressableBtn";

interface IconType {
  name: string;
  color?: string;
  size?: number;
  defaultValue?: string;
}

interface InputPropsType extends TextInputProps {
  customStyle?: ViewStyle;
  icon?: IconType;
  disabled?: boolean;
  cb: (e: string) => void;
}

// eslint-disable-next-line react/display-name
const Input = React.forwardRef(
  (
    {
      customStyle,
      icon,
      disabled = false,
      cb,
      defaultValue,
      ...res
    }: InputPropsType,
    ref,
  ) => {
    const [value, setValue] = useState(defaultValue || "");

    useImperativeHandle(ref, () => {
      return {
        value,
        setValue,
      };
    });

    const onChangeText = (e: string) => {
      setValue(e);
      cb && cb(e);
    };

    const clearInput = () => {
      setValue("");
    };

    return (
      <View style={styles.wrapInput}>
        {!!icon?.name && (
          <Icon
            name={icon.name}
            type={IconType.Ionicons}
            size={icon.size || 20}
            style={[styles.icon, !!icon?.style && icon.style]}
          />
        )}
        <TextInput
          {...res}
          editable={!disabled}
          ref={ref}
          onChangeText={onChangeText}
          style={[
            styles.input,
            !!customStyle && customStyle,
            icon && { paddingLeft: 40 },
            !!disabled && {
              backgroundColor: palette.btnInactive,
              borderWidth: 0,
            },
          ]}
          value={value}
        />
        {!!value && (
          <PressableBtn style={styles.iconClose} onPress={clearInput}>
            <Icon type={IconType.Feather} name={"x-circle"} />
          </PressableBtn>
        )}
      </View>
    );
  },
);

export default Input;

const styles = StyleSheet.create({
  input: {
    minHeight: 40,
    ...CommonStyle.hnRegular,
    borderRadius: 8,
    color: palette.mainColor2,
    width: "100%",
    paddingVertical: 0,
    paddingHorizontal: 12,
    ...CommonStyle.borderStyle,
  },
  icon: {
    position: "absolute",
    left: 10,
    top: 12,
    zIndex: 1,
  },
  wrapInput: {
    flex: 1,
  },
  iconClose: {
    position: "absolute",
    right: 10,
    top: 10,
    color: palette.mainColor2,
  },
});
