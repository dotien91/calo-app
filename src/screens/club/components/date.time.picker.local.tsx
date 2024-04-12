import { palette } from "@theme/themes";
import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import DatePicker from "react-native-date-picker";
import { formatFullDate } from "@utils/date.utils";

interface DateTimePickerLocalProps {
  setTime: (time: Date) => void;
  placeholder: string;
  style: ViewStyle;
  iconRight?: React.JSX.Element;
  timeDefault: string;
  warning?: boolean;
  label?: string;
}

const DateTimePickerLocal = ({
  setTime,
  placeholder,
  style,
  iconRight,
  timeDefault = "",
  warning,
  label,
}: DateTimePickerLocalProps) => {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <PressableBtn
        style={[
          {
            height: 42,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderWidth: 1,
            borderColor: warning ? palette.primary : palette.borderColor,
            marginTop: 8,
            borderRadius: 8,
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
            ? formatFullDate(date)
            : timeDefault !== ""
            ? formatFullDate(timeDefault)
            : placeholder}
        </Text>
        <View style={{ marginRight: 12 }}>{!!iconRight && iconRight}</View>
      </PressableBtn>
      <DatePicker
        modal
        open={open}
        mode="date"
        date={date || timeDefault ? new Date(date || timeDefault) : new Date()}
        minimumDate={new Date()}
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
          setTime(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

export default DateTimePickerLocal;

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  label: {
    ...CS.hnSemiBold,
    color: palette.text,
  },
  input: {
    ...CS.flex1,
    color: palette.text,
    paddingVertical: 0,
    marginHorizontal: 12,
  },
});
