import React from "react";
import { Switch } from "react-native";

import { palette } from "@theme/themes";

const RNSwitch = React.memo(
  ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => {
    const _onChange = () => {
      onChange(!value);
    };

    return (
      <Switch
        trackColor={{ false: "#767577", true: palette.primary }}
        thumbColor={value ? palette.white : "#f4f3f4"}
        onChange={_onChange}
        value={value}
      />
    );
  },
);

export default RNSwitch;
