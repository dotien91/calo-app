import React, { useMemo } from "react";
import { View, StyleSheet, TextInput, Text } from "react-native";
// import { useTheme } from "@react-navigation/native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
// import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { Device } from "@utils/device.ui.utils";
import { numberWithCommas } from "@utils/string.utils";
// import { numberWithCommas } from "@utils/string.utils";

interface SliderWithInputType {
  defaultValue: number[];
  onChange: () => void;
  value: string[];
  clearErrors: () => void;
  setError: () => void;
}

const SliderWithInput = React.memo(
  ({
    defaultValue,
    onChange,
    value,
    setError,
    clearErrors,
  }: SliderWithInputType) => {
    const onChangeSlider = (e) => {
      onChange([e[0] + "", e[1] + ""]);
    };

    // const onChangeText = useCallback(
    //   (v, type) => {
    //     if (type == "min") {
    //       onChange([v, value[1]]);
    //     } else {
    //       onChange([value[0], v]);
    //     }
    //   },
    //   [value],
    // );

    const errotTxt = useMemo(() => {
      const max = Number(value[1]);
      const min = Number(value[0]);
      if (isNaN(min)) {
        setError("price", true);
        return "Giá trị phải là số";
      }
      if (min >= max) {
        setError("price", true);
        return "Giá trị min phải nhỏ hơn";
      }
      clearErrors("price");
      return false;
    }, [value]);

    return (
      <View style={{ flex: 1 }}>
        <MultiSlider
          max={1e8}
          min={0}
          step={1e4}
          enabledTwo
          values={[Number(value[0]) || 0, Number(value[1]) || 1e8]}
          containerStyle={{ marginHorizontal: 16, marginBottom: 8 }}
          onValuesChangeFinish={onChangeSlider}
          trackStyle={{ backgroundColor: "rgba(246, 248, 250, 1)" }}
          sliderLength={Device.width - 60}
          selectedStyle={{ backgroundColor: palette.primary }}
          markerStyle={{
            ...CS.borderStyle,
            borderWidth: 2,
            width: 20,
            height: 20,
            backgroundColor: palette.white,
            borderColor: palette.primary,
          }}
        />
        <View style={{ ...CS.flexRear }}>
          <TextInput
            defaultValue={defaultValue[0] + " đ"}
            style={styles.input}
            placeholderTextColor={palette.placeholder}
            placeholder="Minimum"
            keyboardType="numeric"
            value={numberWithCommas(value[0])}
            // onChangeText={(v) => onChangeText(v, "min")}
          />
          <View style={{ width: 16 }} />
          <TextInput
            defaultValue={defaultValue[1] + " đ"}
            placeholderTextColor={palette.placeholder}
            style={styles.input}
            placeholder="Maximum"
            keyboardType="numeric"
            value={numberWithCommas(value[1])}
            // onChangeText={(v) => onChangeText(v, "max")}
          />
        </View>
        {errotTxt && (
          <Text style={{ ...CS.hnRegular, fontSize: 14, color: palette.red }}>
            {errotTxt}
          </Text>
        )}
      </View>
    );
  },
);

export const styles = StyleSheet.create({
  input: {
    height: 32,
    paddingVertical: 0,
    paddingHorizontal: 16,
    ...CS.borderStyle,
    borderRadius: 4,
    flex: 1,
  },
});

export default SliderWithInput;
