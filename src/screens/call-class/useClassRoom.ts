import { useRoute } from "@react-navigation/native";
import useStore from "@services/zustand/store";
import React from "react";
import { StatusBar } from "react-native";
import KeepAwake from "react-native-keep-awake";
import InCallManager from "react-native-incall-manager";

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
    InCallManager.setSpeakerphoneOn(true);
    return () => {
      StatusBar.setBackgroundColor("white");
      StatusBar.setBarStyle("dark-content");
      KeepAwake.deactivate();
      setIsMutedAll(false);
    };
  }, []);

  const isTeacher = React.useMemo(() => {
    return userData?._id == courseData.user_id?._id;
  }, [userData, courseData]);

  return {
    isTeacher,
  };
};
