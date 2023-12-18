import { View } from "react-native";
import React, { useMemo, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { useTheme } from "@react-navigation/native";
import createStyles from "./DropDownItem.style";

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
  setItems: Dispatch<SetStateCallback<ItemType[]>>;
}

export default function DropDownItem({
  value,
  setValue,
  items,
  setItems,
}: DropDownItemProps) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        multiple={false}
      />
    </View>
  );
}
