import React, { useMemo, useRef, useState, useEffect } from "react";

interface OneoneScreenProps {}

import OneOneRtcView from "./components/OneOneRtcView";
import eventEmitter from "@services/event-emitter";
import { closeSuperModal, showLoading } from "@helpers/super.modal.helper";
import { useRoute } from "@react-navigation/native";
import useStore from "@services/zustand/store";
import { emitSocket } from "@helpers/socket.helper";

const OneoneScreen: React.FC<OneoneScreenProps> = () => {

  const [visible, setVisible] = useState(true)
  const userData = useStore(state => state.userData)

  const reloadOneOneView = () => {
    setVisible(false)
    showLoading()
  }
  const route = useRoute<any>();
  const noEmit = route.params?.noEmit

  useEffect(() => {
    if (!userData) return

    if (!visible) {
      setTimeout(() => {
        setVisible(true)
      }, userData?.user_role != "teacher" ? 4000 : 200)
    } else {
      closeSuperModal()
    }
  }, [visible, userData])

  useEffect(() => {
    if (!userData) return
    const id = userData?.user_role == "teacher" ? "666ffe3f715cee894e6f0a71" : "666c162294f133507f9c87da" 
    // if (userData?.user_role !== "teacher") {
      setTimeout(() => {
        emitSocket("joinOneone", id);

      },  userData?.user_role !== "teacher" ? 0 : 3000)

    // }
    // if (!noEmit) {
    //   alert("join")
    //   emitSocket("joinOneone", id);

    // }
    return () => {
      emitSocket("leaveOneone", id);
    }
  }, [userData])
  
  

  useEffect(() => {
    eventEmitter.on("reload_oneone_screen", reloadOneOneView)
    return () => {
    eventEmitter.emit("reload_oneone_screen", reloadOneOneView)
    }
  }, [])
  

  return (
   <>
    {visible && <OneOneRtcView />}
   </>
  );
};

export default OneoneScreen;
