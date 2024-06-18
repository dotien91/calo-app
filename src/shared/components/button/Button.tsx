import React, { useMemo } from "react";
import { Text, Pressable, ViewStyle, ColorValue } from "react-native";
import { useTheme } from "@react-navigation/native";
import createStyles from "./Button.style";
import { palette } from "@theme/themes";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import TextBase from "@shared-components/TextBase";

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
  type?: string;
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
  // const hasIcon = !!SvgSo || !!iconName;

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
      case "viewmore":
        return palette.primary;
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
          !subText && styles.viewButton,
          !!backgroundColor && { backgroundColor: backgroundColor },
          { opacity: pressed ? 0.8 : 1.0 },
          disabled && { backgroundColor: palette.borderColor },
          type == "primary" && styles.btnPrimary,
          type == "outline" && styles.btnOutline,
          type == "disabled" && styles.btnDisabled,
          type == "viewmore" && styles.btnViewmore,
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
          type == "primary" && styles.txtBtnPrimary,
          (type == "outline" || type == "viewmore") && styles.txtBtnOutline,
          type == "disabled" && styles.txtBtnDisabled,
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
          type == "primary" && styles.txtBtnPrimary,
          (type == "outline" || type == "viewmore") && styles.txtBtnOutline,
          type == "disabled" && styles.txtBtnDisabled,
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
