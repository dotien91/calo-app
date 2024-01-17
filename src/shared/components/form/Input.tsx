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

interface IconType {
  name: string;
  color?: string;
  size?: number;
}

interface InputPropsType extends TextInputProps {
  customStyle?: ViewStyle;
  icon?: IconType;
}

// eslint-disable-next-line react/display-name
const Input = React.forwardRef(
  ({ customStyle, icon, ...res }: InputPropsType, ref) => {
    const [value, setValue] = useState();

    useImperativeHandle(ref, () => {
      return {
        value,
        setValue,
      };
    });

    const onChangeText = (e: string) => {
      setValue(e);
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
          ref={ref}
          onChangeText={onChangeText}
          style={[
            styles.input,
            !!customStyle && customStyle,
            icon && { paddingLeft: 40 },
          ]}
          value={value}
        />
      </View>
    );
  },
);

export default Input;

const styles = StyleSheet.create({
  input: {
    height: 40,
    ...CommonStyle.hnRegular,
    borderRadius: 6,
    color: palette.mainColor2,
    width: "100%",
    paddingVertical: 4,
    flex: 1,
    paddingHorizontal: 12,
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
});
