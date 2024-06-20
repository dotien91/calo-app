import React, { useState } from "react";
import { StyleSheet, Switch, View } from "react-native";

import TextBase from "@shared-components/TextBase";
import SelectDateTime from "./dataPicker";
import { EnumColors } from "models";
import CS from "@theme/styles";
import { palette } from "@theme/themes";

interface useSelectTimeProps {
  title: string;
  time?: string;
}

const useSelectTime = ({ title, time }: useSelectTimeProps) => {
  const [date, setDate] = useState(time || new Date().toISOString());
  const [isSwitch, setIsSwitch] = useState(false);

  const renderSelect = () => {
    return (
      <View style={styles.container}>
        <View style={styles.viewTitle}>
          <TextBase
            fontSize={16}
            fontWeight="500"
            color={EnumColors.text}
            style={{
              flex: 1,
            }}
          >
            {title}
          </TextBase>
          <Switch
            trackColor={{ false: palette.btnInactive, true: palette.lightBlue }}
            value={isSwitch}
            onChange={() => {
              setIsSwitch(!isSwitch);
            }}
          />
        </View>
        {isSwitch && (
          <SelectDateTime
            placeholder={title || ""}
            setTime={(time) => {
              setDate(time.toISOString());
            }}
            timeDefault={date}
          />
        )}
      </View>
    );
  };
  return {
    renderSelect,
    date,
    setDate,
    isSwitch,
    setIsSwitch,
  };
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  viewTitle: { ...CS.row, marginTop: 8 },
});

export default useSelectTime;
