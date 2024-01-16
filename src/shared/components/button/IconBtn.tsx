import React from "react";
import { StyleSheet, ViewStyle, TouchableOpacity } from "react-native";
import CommonStyle from "@theme/styles";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface IconType {
  name: string;
  color?: string;
  size?: number;
  customStyle: ViewStyle;
  onPress: () => void;
}

// eslint-disable-next-line react/display-name
const IconBtn = React.forwardRef(
  ({ name, color, size, customStyle, onPress }: IconType) => {
    if (!name) return null;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.wrapIcon, customStyle]}
      >
        {!!name && (
          <Icon
            name={name}
            type={IconType.MaterialCommunityIcons}
            size={size}
            style={{ color }}
          />
        )}
      </TouchableOpacity>
    );
  },
);

export default IconBtn;

const styles = StyleSheet.create({
  wrapIcon: {
    width: 40,
    height: 40,
    borderRadius: 99,
    ...CommonStyle.flexCenter,
  },
});
