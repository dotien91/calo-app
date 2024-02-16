// Input.js

import React, { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ViewStyle,
  StyleSheet,
  TextStyle,
  Pressable,
} from "react-native";
import { Controller } from "react-hook-form";

import { palette } from "@theme/themes";
import CommonStyle from "@theme/styles";

interface InputPropsType {
  type: "text" | "number" | "email" | "password";
  defaultValue: string | number;
  placeholder: string;
  keyboardType?: "default" | "numeric";
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
  multiline?: boolean;
  maxLength?: number;
  showPlaceholder?: boolean;
  setFocus?: any;
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
  multiline = false,
  maxLength = 500,
  showPlaceholder,
  setFocus,
}) => {
  const refInput = useRef<TextInput>(null);
  const _forcusInput = () => {
    if (setFocus) {
      setFocus(name);
    } else {
      refInput.current?.focus();
    }
  };
  return (
    <View
      style={[
        styles.wrapper,
        showPlaceholder ? { minHeight: 84, marginTop: 8 } : {},
      ]}
    >
      {showPlaceholder && (
        <Text style={styles.textTitle}>{inputProps.placeholder}</Text>
      )}
      <Pressable
        onPress={_forcusInput}
        style={[
          styles.viewBorder,
          !!viewStyle && viewStyle,
          errorTxt ? { borderColor: palette.danger } : {},
          !!noBorder && { borderWidth: 0 },
          multiline
            ? {
                height: 100,
                alignItems: "flex-start",
                justifyContent: "flex-start",
                paddingTop: 8,
              }
            : {},
        ]}
      >
        {!!iconLeft && iconLeft}
        <Controller
          control={control}
          rules={rules}
          render={({ field: { ref, onChange, value } }) => (
            <TextInput
              {...inputProps}
              ref={ref || refInput}
              multiline={multiline}
              onChangeText={(value) => onChange(value)}
              value={value}
              style={[
                styles.input,
                !!customStyle && customStyle,
                multiline && { flex: 1, textAlignVertical: "top" },
              ]}
              secureTextEntry={isPassword}
              placeholderTextColor={palette.placeholder}
              maxLength={maxLength}
            />
          )}
          name={name}
        />
        {!!iconRight && iconRight}
      </Pressable>

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
    marginTop: 8,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    height: 48,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.borderColor,
    gap: 15,
  },
  input: {
    ...CommonStyle.flex1,
    color: palette.text,

    // ...CommonStyle.mb6,
  },
  errorText: {
    color: palette.danger,
    paddingHorizontal: 40,
    marginTop: 4,
  },
  textTitle: {
    ...CommonStyle.hnMedium,
    marginHorizontal: 20,
  },
});
