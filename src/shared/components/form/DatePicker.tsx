import { palette } from "@theme/themes";
import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
// Removed: datepicker package removed
// import DatePicker from "react-native-date-picker";
import { formatFullDate } from "@utils/date.utils";

interface DateTimePickerLocalProps {
  setTime: (time: Date) => void;
  placeholder: string;
  style: ViewStyle;
  iconRight?: React.JSX.Element;
  timeDefault: string;
  warning?: boolean;
  label?: string;
  functionFormatTime: () => void;
  minimumDate?: string;
}

const DateTimePicker = ({
  setTime,
  placeholder,
  style,
  iconRight,
  timeDefault = "",
  warning,
  label,
  functionFormatTime,
  minimumDate,
}: DateTimePickerLocalProps) => {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  const fnFormatTime = functionFormatTime ? functionFormatTime : formatFullDate;

  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <PressableBtn
        style={[
          {
            ...CS.flexRear,
            borderWidth: 1,
            borderColor: warning ? palette.primary : palette.borderColor,
            borderRadius: 8,
            height: 50,
          },
          style,
        ]}
        onPress={() => setOpen(true)}
      >
        <Text
          style={[
            styles.input,
            {
              color:
                date || timeDefault !== ""
                  ? palette.mainColor2
                  : palette.placeholder,
            },
          ]}
        >
          {date
            ? fnFormatTime(date)
            : timeDefault !== ""
            ? fnFormatTime(timeDefault)
            : placeholder}
        </Text>
        <View style={{ marginRight: 12 }}>{!!iconRight && iconRight}</View>
      </PressableBtn>
      {/* Removed: datepicker package removed */}
      {/* <DatePicker
        modal
        open={open}
        mode="datetime"
        date={date || timeDefault ? new Date(date || timeDefault) : new Date()}
        minimumDate={minimumDate}
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
          setTime(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      /> */}
      {open && console.warn("DatePicker functionality removed - datepicker packages were removed")}
    </View>
  );
};

export default DateTimePicker;

const styles = StyleSheet.create({
  container: { marginTop: 8, marginHorizontal: 4, flex: 1 },
  label: {
    ...CS.hnSemiBold,
    color: palette.text,
    marginBottom: 8,
  },
  input: {
    ...CS.flex1,
    color: palette.text,
    paddingVertical: 0,
    paddingHorizontal: 16,
  },
});
