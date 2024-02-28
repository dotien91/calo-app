// Input.js

import React, { useRef, useState } from "react";
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
  label?: string;
  countLength?: boolean;
  textWarning?: string;
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
  label,
  countLength,
  textWarning,
}) => {
  const refInput = useRef<TextInput>(null);
  const _forcusInput = () => {
    if (setFocus) {
      setFocus(name);
    } else {
      refInput.current?.focus();
    }
  };
  const [length, setLength] = useState("");
  return (
    <View
      style={[
        styles.wrapper,
        showPlaceholder ? { minHeight: 76, marginTop: 8 } : {},
      ]}
    >
      {showPlaceholder && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <Text style={styles.textTitle}>{inputProps.placeholder}</Text>
        </View>
      )}
      {!!label && <Text style={styles.label}>{label}</Text>}

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
          render={({ field: { ref, onChange, value } }) => {
            setLength(value?.length || 0);
            return (
              <TextInput
                {...inputProps}
                ref={ref || refInput}
                multiline={multiline}
                onChangeText={(value) => {
                  onChange(value);
                }}
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
            );
          }}
          name={name}
        />
        {!!iconRight && iconRight}
      </Pressable>

      {errorTxt && <Text style={styles.errorText}>{errorTxt}</Text>}
      {textWarning && (
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.textCount}>{textWarning}</Text>
          {countLength && (
            <Text style={styles.textCount}>{`${length}/${maxLength}`}</Text>
          )}
        </View>
      )}
    </View>
  );
};
export default InputHook;

const styles = StyleSheet.create({
  wrapper: {
    // ...CommonStyle.mb10,
    // ...CommonStyle.flex1,
    minHeight: 48,
    width: "100%",
  },
  label: {
    fontSize: 16,
    ...CommonStyle.hnSemiBold,
    color: palette.text,
  },
  viewBorder: {
    marginTop: 8,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    height: 40,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 8,
    gap: 15,
    ...CommonStyle.borderStyle,
  },
  input: {
    ...CommonStyle.flex1,
    color: palette.text,
    paddingVertical: 0,
    // ...CommonStyle.mb6,
  },
  errorText: {
    color: palette.danger,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  textTitle: {
    ...CommonStyle.hnMedium,
  },
  textCount: {
    ...CommonStyle.hnRegular,
    fontSize: 12,
    color: palette.textOpacity6,
  },
});
