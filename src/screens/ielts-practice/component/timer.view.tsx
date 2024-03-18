import { View } from "react-native";
import React, { useEffect, useState } from "react";

import TextBase from "@shared-components/TextBase";
import { EnumColors } from "models";
import IconBtn from "@shared-components/button/IconBtn";
import { palette } from "@theme/themes";
import CS from "@theme/styles";
import { showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";

interface ITimmerView {
  duration_time: number;
  setFinishedTime: (v: number) => void;
  setIsTimeout: (v: boolean) => void;
}

const TimmerView = ({
  duration_time,
  setFinishedTime,
  setIsTimeout,
}: ITimmerView) => {
  const durationTimeBySeconds = React.useRef(duration_time / 1000);
  const _hours = Math.floor(durationTimeBySeconds.current / 3600);
  durationTimeBySeconds.current -= _hours * 3600;

  // calculate (and subtract) whole minutes
  const _mins = Math.floor(durationTimeBySeconds.current / 60);
  durationTimeBySeconds.current -= _mins * 60;

  // what's left is seconds
  const _secs = durationTimeBySeconds.current % 60;
  const [mins, setMins] = useState(_mins);
  const [secs, setSecs] = useState(_secs);
  const [hour, setHour] = useState(_hours);

  useEffect(() => {
    setFinishedTime(hour * 3600 + mins * 60 + secs);
    const timerId = setInterval(() => {
      if (secs <= 0) {
        if (mins <= 0) {
          if (hour <= 0) {
            clearInterval(timerId);
            setIsTimeout(true);
            showToast({
              type: "warning",
              message: translations.ieltsPractice.timeout,
            });
            setHour(0);
            setMins(0);
            setSecs(0);
            //end
          } else {
            setHour((h) => h - 1);
            setSecs(59);
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
    <View
      style={{
        ...CS.flexCenter,
        alignSelf: "center",
        position: "absolute",
        bottom: 0,
        left: 100,
        right: 100,
      }}
    >
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
