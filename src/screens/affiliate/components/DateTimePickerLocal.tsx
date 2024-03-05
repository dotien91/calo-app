import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import DatePicker from "react-native-date-picker";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { formatDate } from "@utils/date.utils";

interface DateTimePickerLocalProps {
  setTime: (time: Date) => void;
  placeholder: string;
  style: ViewStyle;
  timeDefault: string | Date;
  txtWarning?: string;
}

const DateTimePickerLocal = ({
  setTime,
  placeholder,
  style,
  timeDefault,
}: DateTimePickerLocalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PressableBtn
        style={[styles.viewDateTime, style]}
        onPress={() => setOpen(true)}
      >
        <Text style={{ ...CS.hnRegular }}>{placeholder}</Text>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={
              timeDefault !== "" ? styles.txtDate : styles.txtDatePlaceholder
            }
          >
            {timeDefault !== "" ? formatDate(timeDefault) : placeholder}
          </Text>
          <Icon
            name="chevron-forward-outline"
            type={IconType.Ionicons}
            size={20}
          />
        </View>
      </PressableBtn>
      <DatePicker
        modal
        open={open}
        mode="date"
        date={timeDefault !== "" ? new Date(timeDefault) : new Date()}
        onConfirm={(date) => {
          setOpen(false);
          setTime(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

export default DateTimePickerLocal;

const styles = StyleSheet.create({
  viewDateTime: {
    height: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  txtDate: {
    ...CS.hnRegular,
    textAlign: "center",
    color: palette.textOpacity6,
  },
  txtDatePlaceholder: {
    ...CS.hnRegular,
    textAlign: "center",
    color: palette.placeholder,
  },
});
