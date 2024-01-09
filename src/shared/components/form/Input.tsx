import React, { useState, useImperativeHandle } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { palette } from "@theme/themes";
import CommonStyle from "@theme/styles";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface customStyleType {
  input: object;
}

interface IconType {
  name: string;
  color?: string;
  size?: number;
}

interface InputPropsType {
  customStyle?: customStyleType;
  otherProps?: object;
  icon?: IconType;
}

// eslint-disable-next-line react/display-name
const Input = React.forwardRef(
  ({ customStyle, otherProps, icon }: InputPropsType, ref) => {
    const [value, setValue] = useState();

    useImperativeHandle(ref, () => {
      return {
        value,
        // error,
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
            name={"pencil-outline"}
            type={IconType.Ionicons}
            size={icon.size}
            style={[styles.icon, icon?.style && icon.style]}
          />
        )}
        <TextInput
          ref={ref}
          onChangeText={onChangeText}
          {...otherProps}
          style={[styles.input, customStyle, icon && { paddingLeft: 40 }]}
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
