import { useRoute } from "@react-navigation/native";
import useStore from "@services/zustand/store";
import React from "react";
import { StatusBar } from "react-native";
import KeepAwake from "react-native-keep-awake";
import inCallManager from "react-native-incall-manager";
import RNSwitchAudioOutput from 'react-native-switch-audio-output';

export const useClassRoom = () => {
  const userData = useStore((state) => state.userData);
  const route = useRoute();
  const courseData = route.params?.["courseData"];
  const setIsMutedAll = useStore((state) => state.setIsMutedAll);

  React.useEffect(() => {
    StatusBar.setBackgroundColor("rgba(0,0,0,0)");
    StatusBar.setBarStyle("light-content");
    StatusBar.setTranslucent(true);
    KeepAwake.activate();
    if (!!RNSwitchAudioOutput && RNSwitchAudioOutput?.selectAudioOutput) {
      RNSwitchAudioOutput.selectAudioOutput(RNSwitchAudioOutput.AUDIO_SPEAKER)
    }
    return () => {
      inCallManager.stop()
      StatusBar.setBackgroundColor("white");
      StatusBar.setBarStyle("dark-content");
      KeepAwake.deactivate();
    };
  }, []);

  const isTeacher = React.useMemo(() => {
    return userData?._id == courseData.user_id?._id;
  }, [userData, courseData]);

  return {
    isTeacher,
  };
};
