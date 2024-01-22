import React from "react";
import { StyleSheet, View } from "react-native";
import MultiSlider, {
  MultiSliderProps,
} from "@ptomasroos/react-native-multi-slider";

const Slider = React.forwardRef(({ values, ...res }: MultiSliderProps, ref) => {
  const [value, setValue] = React.useState(values);

  React.useImperativeHandle(ref, () => {
    return {
      value,
      setValue,
    };
  });

  const onSlide = (e: number[]) => {
    setValue(e);
  };

  return (
    <View style={styles.box}>
      <MultiSlider
        ref={ref}
        enabledTwo={true}
        values={values}
        {...res}
        onValuesChangeFinish={onSlide}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  box: {
    paddingHorizontal: 12,
  },
});

export default React.memo(Slider);
