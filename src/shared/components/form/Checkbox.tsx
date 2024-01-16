import React, { useState, useImperativeHandle } from "react";
import { StyleSheet, View, Text } from "react-native";
import CheckBox from "@react-native-community/checkbox";

import cmStyles from "@theme/styles";
import { palette } from "@theme/themes";

interface CheckboxPropsType {
  label?: string;
  defaultValue?: boolean;
  callback: () => void;
}

// eslint-disable-next-line react/display-name
const Checkbox = React.forwardRef(
  ({ label, defaultValue, callback }: CheckboxPropsType, ref) => {
    const [value, setValue] = useState(!!defaultValue);

    useImperativeHandle(ref, () => {
      return {
        value,
        setValue,
        toggleValue,
      };
    });

    const _onValueChage = (value) => {
      if (callback) callback(value);
    };

    const toggleValue = () => {
      setValue((old) => !old);
    };

    return (
      <View style={styles.inputWrap}>
        <CheckBox
          // style={{
          //   transform: [{ scale: 0.6 }],
          // }}
          disabled={false}
          value={value}
          onValueChange={_onValueChage}
        />
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    );
  },
);

export default Checkbox;

const styles = StyleSheet.create({
  inputWrap: {
    ...cmStyles.flexStart,
  },
  label: {
    fontSize: cmStyles.hnRegular,
    fontSize: 14,
    color: palette.text,
    marginLeft: 8,
  },
});
