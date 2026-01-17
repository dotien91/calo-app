import React, { useState } from "react";
import { View, Text, ViewStyle, StyleSheet, Pressable } from "react-native";
import { Controller } from "react-hook-form";

import { palette } from "@theme/themes";
import { formatVNDate } from "@utils/date.utils";
import CS from "@theme/styles";
// Removed: datepicker package removed
// import DatePicker from "react-native-date-picker";

interface DatePickerHookProps {
  control: any;
  rules: any;
  errorTxt?: string;
  name: string;
  iconLeft?: React.JSX.Element;
  iconRight?: React.JSX.Element;
  viewStyle?: ViewStyle;
  placeholder: string;
}

// eslint-disable-next-line react/display-name
const DatePickerHook: React.FC<DatePickerHookProps> = ({
  control,
  rules,
  errorTxt,
  name,
  iconLeft,
  iconRight,
  viewStyle,
  placeholder,
}) => {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          {
            height: 48,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: palette.borderColor,
            marginTop: 8,
            borderRadius: 8,
          },
          viewStyle,
        ]}
      >
        {!!iconLeft && iconLeft}
        <Controller
          control={control}
          rules={rules}
          render={({ field: { onChange } }) => (
            <View>
              <Text
                style={{
                  ...CS.hnRegular,
                  color: date ? palette.mainColor2 : palette.placeholder,
                }}
              >
                {date ? formatVNDate(date) : placeholder}
              </Text>
              {/* Removed: datepicker package removed */}
              {/* <DatePicker
                modal
                open={open}
                mode="date"
                date={date || new Date()}
                minimumDate={new Date()}
                onConfirm={(date) => {
                  //   console.log("date..", date);
                  setOpen(false);
                  setDate(date);
                  onChange(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              /> */}
              {open && console.warn("DatePicker functionality removed - datepicker packages were removed")}
            </View>
          )}
          name={name}
        />
        {!!iconRight && iconRight}
      </Pressable>

      {errorTxt && <Text style={styles.errorText}>{errorTxt}</Text>}
    </View>
  );
};
export default DatePickerHook;

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 60,
    width: "100%",
  },

  errorText: {
    color: palette.danger,
    paddingHorizontal: 40,
    marginTop: 4,
  },
});
