import React, { useState } from "react";
import { Text, ViewStyle } from "react-native";
import DatePicker from "react-native-date-picker";

import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { formatTimeHHMM } from "@utils/date.utils";

interface SelectTimeProps {
  setTime: (time: Date) => void;
  placeholder: string;
  style: ViewStyle;
}

const SelectTime = ({ setTime, placeholder, style }: SelectTimeProps) => {
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
          {date ? formatTimeHHMM(date) : placeholder}
        </Text>
      </PressableBtn>
      <DatePicker
        modal
        open={open}
        mode="time"
        date={date || new Date()}
        minuteInterval={30}
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

export default SelectTime;
