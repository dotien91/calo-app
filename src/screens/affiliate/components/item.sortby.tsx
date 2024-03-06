import TextBase from "@shared-components/TextBase";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { EnumColors } from "models";

interface ItemSortByProps {
  onPress: () => void;
  textPlaceholder: string;
  text?: string;
  badge?: number | string;
}

const ItemSortBy = ({
  onPress,
  textPlaceholder,
  text,
  badge,
}: ItemSortByProps) => {
  const isSelected = text !== "" || badge > 0;
  return (
    <PressableBtn
      onPress={onPress}
      style={isSelected ? styles.containerSelected : styles.container}
    >
      {badge > 0 && (
        <View style={styles.viewBadge}>
          <Text style={styles.textBadge}>{badge}</Text>
        </View>
      )}
      <TextBase
        color={isSelected ? EnumColors.primary : EnumColors.textOpacity6}
        fontWeight="500"
      >
        {text !== "" ? text : textPlaceholder}
      </TextBase>
      <Icon
        name="chevron-down"
        size={20}
        type={IconType.Ionicons}
        color={isSelected ? palette.primary : palette.textOpacity6}
      />
    </PressableBtn>
  );
};

export default ItemSortBy;

const styles = StyleSheet.create({
  container: {
    ...CS.center,
    ...CS.row,
    backgroundColor: palette.btnInactive,
    height: 30,
    borderRadius: 24,
    gap: 8,
    paddingHorizontal: 12,
  },
  containerSelected: {
    ...CS.center,
    ...CS.row,
    borderColor: palette.primary,
    borderWidth: 1,
    height: 30,
    borderRadius: 24,
    gap: 8,
    paddingHorizontal: 12,
  },
  viewBadge: {
    height: 16,
    paddingHorizontal: 5,
    borderRadius: 8,
    minWidth: 16,
    backgroundColor: palette.primary,
    ...CS.center,
  },
  textBadge: {
    fontWeight: "400",
    fontSize: 14,
    color: palette.white,
  },
});
