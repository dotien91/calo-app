import { View } from "react-native";
import React, { useEffect, useState } from "react";

import TextBase from "@shared-components/TextBase";
import { EnumColors } from "models";
import IconBtn from "@shared-components/button/IconBtn";
import { palette } from "@theme/themes";
import CS from "@theme/styles";

interface ITimmerView {
  duration_time: number;
}

const TimmerView = ({ duration_time }: ITimmerView) => {
  const _hours = Math.floor(duration_time / 3600) % 24;
  duration_time -= _hours * 3600;

  // calculate (and subtract) whole minutes
  const _mins = Math.floor(duration_time / 60) % 60;
  duration_time -= _mins * 60;

  // what's left is seconds
  const _secs = duration_time % 60;
  const [mins, setMins] = useState(_mins);
  const [secs, setSecs] = useState(_secs);
  const [hour, setHour] = useState(_hours);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (secs <= 0) {
        if (mins <= 0) {
          if (hour <= 0) {
            clearInterval(timerId);
            setHour(0);
            setMins(0);
            setSecs(0);
            //end
          } else {
            setHour((h) => h - 1);
            setMins(59);
          }
        } else {
          setMins((m) => m - 1);
          setSecs(59);
        }
      } else {
        setSecs((s) => s - 1);
      }
    }, 1000);
    return () => clearInterval(timerId);
  }, [secs, mins, hour]);

  return (
    <View style={{ ...CS.flexCenter }}>
      <IconBtn
        customStyle={{ marginRight: 4 }}
        name="clock"
        color={palette.textOpacity6}
      />
      <TextBase fontWeight="500" color={EnumColors.textOpacity6}>
        {hour}:{mins}:{secs < 10 && 0}
        {secs}
      </TextBase>
    </View>
  );
};

export default React.memo(TimmerView);
