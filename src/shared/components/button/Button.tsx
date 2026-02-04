import React, { useMemo } from "react";
import { Text, Pressable, ViewStyle, TextStyle, ColorValue } from "react-native";
import { useTheme } from "@react-navigation/native";
import createStyles from "./Button.style";
import { palette } from "@theme/themes";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import TextBase from "@shared-components/TextBase";

/** Các kiểu nút có sẵn: primary, outline, disabled, viewmore */
export type ButtonType = "primary" | "outline" | "disabled" | "viewmore";

interface ICustomStyle {
  button?: ViewStyle;
  text?: ViewStyle;
}

interface ButtonProps {
  onPress: () => void;
  text?: string;
  style?: ViewStyle;
  backgroundColor?: ColorValue;
  textColor?: ColorValue;
  SvgSo?: React.JSX.Element;
  disabled?: boolean;
  /** Kiểu nút: primary | outline | disabled | viewmore */
  type?: ButtonType;
  iconName?: string;
  isFullWidth?: boolean;
  showRightIcon?: boolean;
  isSmallButton?: boolean;
  isMiddleButton?: boolean;
  customStyle?: ICustomStyle;
  subText?: string;
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
  isFullWidth = true,
  showRightIcon = false,
  isSmallButton = false,
  isMiddleButton = false,
  customStyle,
  subText,
}: ButtonProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(), [theme]);

  const typeButtonStyle = useMemo((): Partial<Record<ButtonType, ViewStyle>> => ({
    primary: styles.btnPrimary,
    outline: styles.btnOutline,
    disabled: styles.btnDisabled,
    viewmore: styles.btnViewmore,
  }), [styles]);

  const typeTextStyle = useMemo((): Partial<Record<ButtonType, TextStyle>> => ({
    primary: styles.txtBtnPrimary,
    outline: styles.txtBtnOutline,
    disabled: styles.txtBtnDisabled,
    viewmore: styles.txtBtnOutline,
  }), [styles]);

  const iconColorByType: Partial<Record<ButtonType, string>> = {
    primary: palette.white,
    outline: palette.primary,
    disabled: palette.textOpacity4,
    viewmore: palette.primary,
  };
  const colorIcon = () => (type && iconColorByType[type]) ?? palette.text;

  const buttonStyleByType = type ? typeButtonStyle[type] : undefined;
  const textStyleByType = type ? typeTextStyle[type] : undefined;

  return (
    <Pressable
      disabled={disabled || type === "disabled"}
      style={({ pressed }) => {
        return [
          !subText && styles.viewButton,
          !!backgroundColor && { backgroundColor: backgroundColor },
          { opacity: pressed ? 0.8 : 1.0 },
          disabled && { backgroundColor: palette.borderColor },
          buttonStyleByType,
          isFullWidth
            ? { width: "100%" }
            : { width: "auto", alignSelf: "start" },
          isSmallButton ? styles.smallBtn : {},
          isMiddleButton ? styles.middleBtn : {},
          style && style,
          customStyle && customStyle?.button,
          !!subText && {
            borderRadius: 12,
          },
        ];
      }}
      onPress={onPress}
    >
      {!!SvgSo && SvgSo}
      {!showRightIcon && !!iconName && (
        <Icon
          type={IconType.Feather}
          name={iconName}
          size={isSmallButton ? 12 : 20}
          color={colorIcon()}
          style={{ marginRight: isSmallButton ? -4 : 6 }}
        />
      )}
      <Text
        style={[
          styles.textButton,
          !!textColor && { color: textColor },
          textStyleByType,
          isSmallButton && { fontSize: 13, fontWeight: "500" },
          isMiddleButton && styles.textMiddleButton,
          customStyle && customStyle?.text,
        ]}
      >
        {text}
      </Text>
      <TextBase
        title={subText}
        fontSize={14}
        style={[
          styles.textButton,
          !!textColor && { color: textColor },
          textStyleByType,
          isSmallButton && { fontSize: 13, fontWeight: "500" },
          isMiddleButton && styles.textMiddleButton,
          customStyle && customStyle?.text,
        ]}
      />
      {!!showRightIcon && !!iconName && (
        <Icon
          type={IconType.Feather}
          name={iconName}
          size={isSmallButton ? 12 : 20}
          color={colorIcon()}
          style={{ marginLeft: 6 }}
        />
      )}
    </Pressable>
  );
}
