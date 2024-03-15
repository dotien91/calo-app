import React from "react";
import { StyleSheet, View } from "react-native";

import CS from "@theme/styles";
import { palette } from "@theme/themes";
import TextBase from "@shared-components/TextBase";
import PressableBtn from "@shared-components/button/PressableBtn";

interface CustomRadioProps {
  label?: string;
  isSelected: boolean;
  callback: () => void;
  disabled?: boolean;
}

// eslint-disable-next-line react/display-name
const CustomRadio = ({
  isSelected,
  label,
  callback,
  disabled,
}: CustomRadioProps) => {
  return (
    <PressableBtn disable={disabled} style={CS.flexStart} onPress={callback}>
      {!!label && (
        <TextBase style={{ marginRight: 4 }} fontWeight="600">
          {label}
        </TextBase>
      )}
      <View
        style={[
          styles.circle,
          disabled && { borderColor: palette.btnInactive },
        ]}
      >
        {isSelected && (
          <View
            style={[
              styles.dot,
              disabled && { backgroundColor: palette.btnInactive },
            ]}
          ></View>
        )}
      </View>
    </PressableBtn>
  );
};

export default CustomRadio;

const styles = StyleSheet.create({
  circle: {
    width: 24,
    height: 24,
    borderRadius: 99,
    ...CS.borderStyle,
    borderWidth: 2,
    borderColor: palette.primary,
    ...CS.flexCenter,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 99,
    backgroundColor: palette.primary,
  },
});
