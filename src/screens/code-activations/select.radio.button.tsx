import React from "react";
import { Text, View, StyleSheet } from "react-native";

import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { palette } from "@theme/themes";

interface SelectRadioButtonProps {
  data: any;
}

const SelectRadioButton = ({ data }: SelectRadioButtonProps) => {
  return (
    <View>
      <View style={styles.viewTitle}>
        <Text style={styles.textTitle}>{data?.title}</Text>
      </View>
      {data?.listAction &&
        data.listAction.map((item, index) => {
          return (
            <PressableBtn
              key={index}
              onPress={item.callbackAction}
              style={{ ...CS.row, height: 40 }}
            >
              <Text
                style={{
                  ...CS.hnRegular,
                  flex: 1,
                  color: palette.textOpacity8,
                }}
              >
                {item.label}
              </Text>
              <View style={styles.border}>
                {item.selected && <View style={styles.selected} />}
              </View>
            </PressableBtn>
          );
        })}
    </View>
  );
};

export default SelectRadioButton;

const styles = StyleSheet.create({
  border: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    ...CS.center,
    borderColor: palette.primary,
  },
  selected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: palette.primary,
  },
  viewTitle: {
    height: 40,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  textTitle: {
    ...CS.hnSemiBold,
    fontSize: 20,
    color: palette.text,
  },
});
