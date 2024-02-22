import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { formatFullDate } from "@utils/date.utils";
import React, { useState } from "react";
import { Text, View, ViewStyle } from "react-native";
import DatePicker from "react-native-date-picker";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface DateTimePickerLocalProps {
  setTime: (time: Date) => void;
  placeholder: string;
  style: ViewStyle;
  timeDefault: string;
  txtWarning?: string;
}

const DateTimePickerLocal = ({
  setTime,
  placeholder,
  style,
  timeDefault,
  txtWarning,
}: DateTimePickerLocalProps) => {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  return (
    <>
      <PressableBtn
        style={[
          {
            height: 30,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          },
          style,
        ]}
        onPress={() => setOpen(true)}
      >
        <Text style={{ ...CS.hnRegular }}>{placeholder}</Text>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              ...CS.hnRegular,
              textAlign: "center",
              color:
                date || timeDefault !== ""
                  ? palette.mainColor2
                  : palette.placeholder,
            }}
          >
            {date
              ? formatFullDate(date)
              : timeDefault !== ""
              ? formatFullDate(timeDefault)
              : placeholder}
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
        mode="datetime"
        date={date || timeDefault !== "" ? new Date(timeDefault) : new Date()}
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
    </>
  );
};

export default DateTimePickerLocal;
