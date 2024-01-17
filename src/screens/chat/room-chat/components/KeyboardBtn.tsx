import React, { useMemo } from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "../room.chat.screen.style";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface KeyboardBtnProps {
  icon: string;
  callback: () => void;
  customStyle?: ViewStyle;
  color?: string;
}

const KeyboardBtn: React.FC<KeyboardBtnProps> = ({
  customStyle,
  icon,
  callback,
  color,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      onPress={callback}
      style={[styles.btnAction, customStyle && customStyle]}
    >
      <Icon
        size={16}
        type={IconType.Feather}
        name={icon}
        color={color || colors.black}
      />
    </TouchableOpacity>
  );
};

export default React.memo(KeyboardBtn);
