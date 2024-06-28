import React, { useState, useEffect } from "react";

import OneOneRtcView from "./components/OneOneRtcView";
import eventEmitter from "@services/event-emitter";
import { useRoute } from "@react-navigation/native";
import useStore from "@services/zustand/store";
import { emitSocket } from "@helpers/socket.helper";
import { EnumRole } from "constants/system.constant";
import { ActivityIndicator, SafeAreaView, View } from "react-native";
import CS from "@theme/styles";
import TextBase from "@shared-components/TextBase";
import { EnumColors } from "models";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import ClassOneOneRoomTopView from "@screens/call-class/components/call.oneone.class.top.view";

interface OneoneScreenProps {}

const OneoneScreen: React.FC<OneoneScreenProps> = () => {
  const [visible, setVisible] = useState(true);
  const userData = useStore((state) => state.userData);
  const route = useRoute<any>();
  const event = route.params?.event;
  const courseRoom = route.params?.courseRoom;
  const reloadOneOneView = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (!userData) return;
    if (!visible) {
      setTimeout(
        () => {
          userData?.user_role == EnumRole.Teacher &&
            emitSocket("clearAnswer", courseRoom?.roomId);

          setVisible(true);
        },
        userData?.user_role != EnumRole.Teacher ? 4000 : 0,
      );
    }
  }, [visible, userData]);

  useEffect(() => {
    emitSocket(
      userData?.user_role == EnumRole.Teacher ? "clearAnswer" : "clearOffer",
      courseRoom?.roomId,
    );
    if (!userData) return;
    emitSocket("joinOneone", event?.partner_id?._id);
    return () => {
      emitSocket("leaveOneone", event?.partner_id?._id);
    };
  }, [userData]);

  useEffect(() => {
    eventEmitter.on("reload_oneone_screen", reloadOneOneView);
    return () => {
      eventEmitter.off("reload_oneone_screen", reloadOneOneView);
    };
  }, []);

  const renderRoomLoading = () => {
    return (
      <SafeAreaView
        style={[CS.safeAreaView, { backgroundColor: palette.black }]}
      >
        <ClassOneOneRoomTopView data={event} />
        <View style={[CS.center, { flex: 1 }]}>
          <View
            style={{
              backgroundColor: palette.link,
              padding: 16,
              borderRadius: 12,
            }}
          >
            <TextBase
              marginBottom={12}
              color={EnumColors.white}
              title={
                event?.partner_id?.display_name + " " + translations.loadingRoom
              }
              fontSize={20}
            />
            <ActivityIndicator color={palette.white} />
          </View>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <>
      {visible && <OneOneRtcView />}
      {!visible && renderRoomLoading()}
    </>
  );
};

export default OneoneScreen;
