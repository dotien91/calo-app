import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import lodash from "lodash";
// import { useTheme } from "@react-navigation/native";
// import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import CS from "@theme/styles";
import { palette } from "@theme/themes";

interface ICheckbox {
  name: string;
  id: string;
}
interface IMultiCheckbox {
  defaultValue: ICheckbox;
  onChange: () => void;
  items: ICheckbox[];
  value: string[];
}

export const MultiCheckBox = React.memo(
  ({ onChange, items, value }: IMultiCheckbox) => {
    const useFlexOne = items.length < 4;
    const onToggle = (item) => {
      const isActive = !!value.find((v) => lodash.isEqual(v, item.id));
      if (isActive) {
        onChange(value.filter((v) => !lodash.isEqual(v, item.id)));
      } else {
        onChange([...value, item.id]);
      }
    };

    const renderFilterBtn = (item) => {
      const isActive = !!value.find((v) => lodash.isEqual(v, item.id));
      // const isDisabled = !!defaultValue.find((v) => lodash.isEqual(v, item.id));
      return (
        <TouchableOpacity
          onPress={() => onToggle(item)}
          style={[
            styles.btnFilter,
            isActive && styles.btnFilterActive,
            useFlexOne && { flex: 1, ...CS.flexCenter },
            // isDisabled && { opacity: 0.5 },
          ]}
          // disabled={isDisabled}
        >
          <Text style={[styles.txtFilter, isActive && styles.txtFilterActive]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    };

    return <>{items.map((_item) => renderFilterBtn(_item))}</>;
  },
);

export const styles = StyleSheet.create({
  btnFilter: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 24,
    backgroundColor: palette.btnInactive,
    marginRight: 8,
    marginTop: 8,
  },
  txtFilter: {
    ...CS.hnMedium,
    fontSize: 16,
    color: palette.textOpacity6,
  },
  btnFilterActive: {
    backgroundColor: palette.primary,
  },
  txtFilterActive: {
    color: palette.white,
  },
});

export default MultiCheckBox;
