import { useTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";
import * as React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface ItemBottomSheetProps {
  onPress: () => void;
  nameIcon: string;
  text: string;
}

const ItemBottomSheet = ({ onPress, nameIcon, text }: ItemBottomSheetProps) => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Pressable onPress={onPress} style={styles.buttonFlag}>
      <Icon
        size={24}
        name={nameIcon}
        type={IconType.Ionicons}
        color={colors.text}
      />
      <Text style={[styles.textButton, { color: colors.text }]}>{text}</Text>
    </Pressable>
  );
};

export default ItemBottomSheet;

const styles = StyleSheet.create({
  buttonFlag: {
    height: 25,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  textButton: {
    ...CommonStyle.hnRegular,
    fontSize: 16,
    paddingLeft: 18,
    flex: 1,
  },
});
