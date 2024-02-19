import React, { useRef } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
/**
 * ? Local Imports
 */
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { closeSuperModal } from "@helpers/super.modal.helper";

interface IItem {
  name: string;
  id: string;
  _id?: string;
  order_by?: string;
  iconImg: string;
}

interface SelectBoxProps {
  defaultItem: IItem;
  options: IItem[];
  title: string;
  callback?: () => void;
}

const SelectBox = ({
  options,
  defaultItem,
  title,
  callback,
}: SelectBoxProps) => {
  const _itemSelected = useRef(defaultItem);
  const [itemSelected, setItemSelected] = React.useState<IItem>(defaultItem);

  const _onPress = (item: IItem) => {
    _itemSelected.current = item;
    setItemSelected(item);
    closeSuperModal();
    if (callback!) callback(_itemSelected.current);
  };

  const renderItem = (item: IItem, index: number) => {
    const isActive = item.id == itemSelected?.id;
    const isLastitem = index == options.length - 1;

    return (
      <TouchableOpacity
        key={index}
        onPress={() => _onPress(item)}
        style={[styles.item, isLastitem && { borderBottomWidth: 0 }]}
      >
        <View style={CS.flexStart}>
          {item.iconImg && (
            <Image
              source={item.iconImg}
              style={{ height: 30, width: 30 }}
            ></Image>
          )}
          {!!item.icon && (
            <Icon
              name={item.icon}
              type={IconType.Feather}
              size={24}
              style={{ color: palette.text }}
            />
          )}
          <Text style={styles.checkBoxLabel}>{item.name}</Text>
        </View>
        <View style={styles.circle}>
          {isActive && <View style={styles.dot}></View>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.box}>
      <Text style={styles.headerTitlte}>{title}</Text>
      {options.map((item: IItem, index: number) => renderItem(item, index))}
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

export default SelectBox;
