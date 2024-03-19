import { useRoute } from "@react-navigation/native";
import useStore from "@services/zustand/store";
import React from "react";
import { StatusBar } from "react-native";


export const useClassRoom = () => {
  const userData = useStore(state => state.userData)
  const route = useRoute();
  const courseData = route.params?.["courseData"];

  React.useEffect(() => {
    StatusBar.setBackgroundColor("rgba(0,0,0,0)");
    StatusBar.setTranslucent(true);
    return () => {
    StatusBar.setBackgroundColor("white");

    }
  }, [])


  const isTeacher = React.useMemo(() => {
    return userData?._id == courseData.user_id?._id
  }, [userData, courseData])

  return {
    isTeacher
  }
};
