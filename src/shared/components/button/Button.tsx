import React, { useMemo } from "react";
import { View, Text, Pressable, ViewStyle, ColorValue } from "react-native";
import { useTheme } from "@react-navigation/native";
import createStyles from "./Button.style";
import { palette } from "@theme/themes";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface ButtonProps {
  onPress: () => void;
  text?: string;
  style?: ViewStyle;
  backgroundColor?: ColorValue;
  textColor?: ColorValue;
  SvgSo?: React.JSX.Element;
  disabled: boolean;
  type?: string;
  iconName?: string;
  isFullWidth: boolean;
}

export default function Button({
  text,
  onPress,
  style,
  backgroundColor,
  textColor,
  SvgSo,
  iconName,
  disabled,
  type,
  isFullWidth,
}: ButtonProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(), [theme]);
  const hasIcon = !!SvgSo || !!iconName;

  const colorIcon = () => {
    switch (type) {
      case "primary":
        return palette.white;
        break;
      case "outline":
        return palette.primary;
        break;
      case "disabled":
        return palette.textOpacity4;
        break;
      default:
        return palette.text;
        break;
    }
  };

  return (
    <Pressable
      disabled={disabled || type == "disabled"}
      style={({ pressed }) => {
        return [
          styles.viewButton,
          !!backgroundColor && { backgroundColor: backgroundColor },
          { opacity: pressed ? 0.8 : 1.0 },
          disabled && { backgroundColor: palette.borderColor },
          type == "primary" && styles.btnPrimary,
          type == "outline" && styles.btnOutline,
          type == "disabled" && styles.btnDisabled,
          isFullWidth && { width: "100%" },
          style && style,
        ];
      }}
      onPress={onPress}
    >
      {!!SvgSo && SvgSo}
      {!!iconName && (
        <Icon
          type={IconType.Feather}
          name={iconName}
          size={20}
          color={colorIcon()}
        />
      )}
      {hasIcon && !!text && <View style={{ width: 8 }} />}
      <Text
        style={[
          styles.textButton,
          !!textColor && { color: textColor },
          type == "primary" && styles.txtBtnPrimary,
          type == "outline" && styles.txtBtnOutline,
          type == "disabled" && styles.txtBtnDisabled,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}
