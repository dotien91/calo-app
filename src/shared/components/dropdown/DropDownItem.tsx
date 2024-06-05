import { ViewStyle } from "react-native";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { palette } from "@theme/themes";

type ItemType = {
  label: string;
  value: string;
};

type Dispatch<A> = (value: A) => void;
type SetStateCallback<S> = (prevState: S) => S;

interface DropDownItemProps {
  value: string;
  setValue: Dispatch<SetStateCallback<string>>;
  items: ItemType[];
  customStyle: ViewStyle;
}

export default function DropDownItem({
  value,
  setValue,
  items,
  customStyle,
  ...res
}: DropDownItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      multiple={false}
      {...res}
      style={[
        { borderColor: palette.borderColor },
        !!customStyle && customStyle,
      ]}
      containerStyle={{ margin: 0, padding: 0 }}
    />
  );
}
