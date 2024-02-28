import TextBase from "@shared-components/TextBase";
import React from "react";
import { StyleSheet } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { EnumColors } from "models";

interface ItemSortByProps {
  onPress: () => void;
  text: string;
}

const ItemSortBy = ({ onPress, text }: ItemSortByProps) => {
  return (
    <PressableBtn onPress={onPress} style={styles.container}>
      <TextBase color={EnumColors.textOpacity6} fontWeight="500">
        {text}
      </TextBase>
      <Icon
        name="chevron-down"
        size={20}
        type={IconType.Ionicons}
        color={palette.textOpacity6}
      />
    </PressableBtn>
  );
};

export default ItemSortBy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...CS.center,
    ...CS.row,
    backgroundColor: palette.btnInactive,
    height: 30,
    borderRadius: 24,
    gap: 8,
  },
});
