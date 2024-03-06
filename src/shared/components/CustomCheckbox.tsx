import React from "react";
import { StyleSheet, View } from "react-native";

import CS from "@theme/styles";
import { palette } from "@theme/themes";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface CustomCheckboxPropsType {
  label?: string;
  isSelected: boolean;
  callback?: () => void;
}

// eslint-disable-next-line react/display-name
const CustomCheckbox = ({ isSelected }: CustomCheckboxPropsType) => {
  return (
    <View style={isSelected ? styles.wrapCheckboxActive : styles.wrapCheckbox}>
      <Icon
        type={IconType.Feather}
        name={"check"}
        size={12}
        color={isSelected ? palette.white : palette.white}
      />
    </View>
  );
};

export default CustomCheckbox;

const styles = StyleSheet.create({
  wrapCheckboxActive: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: palette.primary,
    ...CS.center,
  },
  wrapCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    ...CS.borderStyle,
    borderWidth: 2,
  },
});
