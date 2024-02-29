import React from "react";
import { View, StyleSheet } from "react-native";
/**
 * ? Local Imports
 */
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
  box: {
    paddingBottom: 16,
  },
});

export default ListActionInner;
