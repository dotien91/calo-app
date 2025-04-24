import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import CS from "@theme/styles";
import { palette } from "@theme/themes";
import TextBase from "@shared-components/TextBase";
import PressableBtn from "@shared-components/button/PressableBtn";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface CustomRadioProps {
  label?: string;
  isSelected: boolean;
  callback: () => void;
  disabled?: boolean;
  customStyle?: ViewStyle;
  labelStyle?: ViewStyle;
  isRadio?: boolean;
  answer: string;
}

// eslint-disable-next-line react/display-name
const CustomRadio = ({
  isSelected,
  label,
  content,
  callback,
  disabled,
  customStyle,
  labelStyle,
  isRadio,
  answer,
}: CustomRadioProps) => {
  return (
    <PressableBtn
      style={[CS.flexStart, customStyle ? customStyle : {}]}
      disable={disabled}
      onPress={callback}
    >
      {!!label && (
        <TextBase
          style={[{ marginRight: 4, width: 20 }, labelStyle && labelStyle]}
          fontWeight="600"
        >
          {label}
        </TextBase>
      )}
      <View
        style={[
          styles.circle,
          disabled && { borderColor: palette.btnInactive },
          !isRadio && { borderRadius: 2 },
        ]}
      >
        {isSelected && (
          <>
            {isRadio ? (
              <View
                style={[
                  styles.dot,
                  disabled && { backgroundColor: palette.btnInactive },
                ]}
              ></View>
            ) : (
              <Icon
                name="check"
                type={IconType.Feather}
                size={20}
                color={palette.primary}
              />
            )}
          </>
        )}
      </View>
      {!!answer && (
        <TextBase style={{ marginRight: 4, flex: 1 }} fontWeight="450">
          {answer}
        </TextBase>
      )}
      {!!content && (
        <TextBase style={{ marginRight: 4, flex: 1 }} fontWeight="600">
          {content}
        </TextBase>
      )}
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
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 99,
    backgroundColor: palette.primary,
  },
});
