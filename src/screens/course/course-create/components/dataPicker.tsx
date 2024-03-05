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
  timeDefault: string;
  warning?: boolean;
}

const SelectDateTime = ({
  setTime,
  placeholder,
  style,
  timeDefault,
  warning,
}: SelectDateTimeProps) => {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  console.log("...", timeDefault);

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
            borderColor: warning ? palette.primary : palette.borderColor,
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
            color:
              date || timeDefault !== ""
                ? palette.mainColor2
                : palette.placeholder,
          }}
        >
          {date
            ? formatVNDate(date)
            : timeDefault !== ""
            ? formatVNDate(timeDefault)
            : placeholder}
        </Text>
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
    </>
  );
};

export default SelectDateTime;
