import { View } from "react-native";
import React, { useMemo, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { useTheme } from "@react-navigation/native";
import createStyles from "./DropDownItem.style";
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
}

export default function DropDownItem({
  value,
  setValue,
  items,
  ...res
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
        multiple={false}
        {...res}
        style={{ borderColor: palette.borderColor1 }}
      />
    </View>
  );
}
