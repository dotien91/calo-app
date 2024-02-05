import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { formatVNDate } from "@utils/date.utils";
import React, { useState } from "react";
import { Text, ViewStyle } from "react-native";
import DatePicker from "react-native-date-picker";

interface SelectDateTimeProps {
  setTime: (time: Date) => void;
  placeholder: string;
  style: ViewStyle;
}

const SelectDateTime = ({
  setTime,
  placeholder,
  style,
}: SelectDateTimeProps) => {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  return (
    <>
      <PressableBtn
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
          style,
        ]}
        onPress={() => setOpen(true)}
      >
        <Text
          style={{
            ...CS.hnRegular,
            color: date ? palette.mainColor2 : palette.placeholder,
          }}
        >
          {date ? formatVNDate(date) : placeholder}
        </Text>
      </PressableBtn>
      <DatePicker
        modal
        open={open}
        mode="date"
        date={date || new Date()}
        minimumDate={new Date()}
        onConfirm={(date) => {
          console.log("date..", date);
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

export default SelectDateTime;
