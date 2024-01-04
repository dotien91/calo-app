import React, { useState, useImperativeHandle } from "react";
import { StyleSheet, TextInput } from "react-native";
import { palette } from "@theme/themes";
import CommonStyle from "@theme/styles";

interface customStyleType {
  input: object;
}

interface InputPropsType {
  customStyle?: customStyleType;
  otherProps?: object;
}

// eslint-disable-next-line react/display-name
const Input = React.forwardRef(
  ({ customStyle, otherProps }: InputPropsType, ref) => {
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
      <TextInput
        ref={ref}
        onChangeText={onChangeText}
        {...otherProps}
        style={[styles.input, customStyle]}
        value={value}
      />
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
});
