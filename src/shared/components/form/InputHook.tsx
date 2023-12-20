// Input.js

import React from "react";
import { View, Text, TextInput, ViewStyle } from "react-native";
import { Controller } from "react-hook-form";

import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";

interface InputPropsType {
  type: "text" | "number" | "email" | "password";
  defaultValue: string | number;
  placeholder: string;
}

interface InputHookProps {
  inputProps: InputPropsType;
  control: any;
  rules: any;
  customStyle: ViewStyle;
  errorTxt?: string;
  name: string;
}

// eslint-disable-next-line react/display-name
const InputHook: React.FC<InputHookProps> = ({
  inputProps,
  control,
  rules,
  errorTxt,
  customStyle,
  name,
}) => {
  return (
    <View style={styles.wrapper}>
      <Controller
        control={control}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <TextInput
            {...inputProps}
            onChangeText={(value) => onChange(value)}
            value={value}
            style={[styles.input, !!customStyle && customStyle]}
          />
        )}
        name={name}
      />

      {errorTxt && <Text style={styles.errorText}>{errorTxt}</Text>}
    </View>
  );
};
export default InputHook;

const styles = {
  wrapper: {
    // ...CommonStyle.mb10,
    ...CommonStyle.flex1,
  },
  input: {
    // ...CommonStyle.borderStyle,
    // ...CommonStyle.mb6,
  },
  errorText: {
    color: palette.danger,
  },
};
