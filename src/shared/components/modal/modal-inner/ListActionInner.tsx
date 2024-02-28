import React from "react";
import { View, StyleSheet } from "react-native";
/**
 * ? Local Imports
 */
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import ItemBottomSheet from "../components/ItemBottomSheet";

interface IItem {
  onPress: () => void;
  nameIcon: string;
  text: string;
}

interface ListActionProps {
  options: IItem[];
}

const ListActionInner = ({ options }: ListActionProps) => {
  return (
    <View style={styles.box}>
      {options.map((item: IItem, index: number) => (
        <ItemBottomSheet key={index} {...item} />
      ))}
    </View>
  );
};

export const styles = StyleSheet.create({
  item: {
    ...CS.flexRear,
    paddingVertical: 16,
    ...CS.borderBottomStyle,
    borderColor: palette.grey2,
  },
  box: {
    paddingBottom: 16,
  },
  checkBoxLabel: {
    ...CS.hnSemiBold,
    fontSize: 16,
    color: palette.textOpacity8,
    marginLeft: 8,
  },
  headerTitlte: {
    ...CS.hnSemiBold,
    fontSize: 20,
    flex: 1,
    textAlign: "center",
    marginBottom: 14,
    marginTop: 12,
  },
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

export default ListActionInner;
