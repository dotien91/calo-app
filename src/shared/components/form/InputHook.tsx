// Input.js

import React from "react";
import {
  View,
  Text,
  TextInput,
  ViewStyle,
  StyleSheet,
  TextStyle,
} from "react-native";
import { Controller } from "react-hook-form";

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
  customStyle: TextStyle;
  errorTxt?: string;
  name: string;
  isPassword?: boolean;
  iconLeft?: React.JSX.Element;
  iconRight?: React.JSX.Element;
  viewStyle?: ViewStyle;
  noBorder?: boolean;
}

// eslint-disable-next-line react/display-name
const InputHook: React.FC<InputHookProps> = ({
  inputProps,
  control,
  rules,
  errorTxt,
  customStyle,
  name,
  isPassword = false,
  iconLeft,
  iconRight,
  viewStyle,
  noBorder,
}) => {
  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.viewBorder,
          !!viewStyle && viewStyle,
          errorTxt != "" ? { borderColor: palette.danger } : {},
          !!noBorder && { borderWidth: 0 },
        ]}
      >
        {!!iconLeft && iconLeft}
        <Controller
          control={control}
          rules={rules}
          render={({ field: { onChange, value } }) => (
            <TextInput
              {...inputProps}
              onChangeText={(value) => onChange(value)}
              value={value}
              style={[styles.input, !!customStyle && customStyle]}
              secureTextEntry={isPassword}
            />
          )}
          name={name}
        />
        {!!iconRight && iconRight}
      </View>

      {errorTxt && <Text style={styles.errorText}>{errorTxt}</Text>}
    </View>
  );
};
export default InputHook;

const styles = StyleSheet.create({
  wrapper: {
    // ...CommonStyle.mb10,
    // ...CommonStyle.flex1,
    minHeight: 60,
    width: "100%",
  },
  viewBorder: {
    marginTop: 16,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    height: 48,
    paddingVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: palette.mainColor2,
    gap: 15,
  },
  input: {
    // ...CommonStyle.borderStyle,
    flex: 1,
    // ...CommonStyle.mb6,
  },
  errorText: {
    color: palette.danger,
    paddingHorizontal: 40,
    marginTop: 4,
  },
});
