import { useUserHook } from "@helpers/hooks/useUserHook";
import CS from "@theme/styles";
import React from "react";
import { View, TouchableOpacity } from "react-native";
import ListPostNew from "./new.list.post";
import { palette } from "@theme/themes";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { navigate } from "@helpers/navigation.helper";
import { SCREENS } from "constants";
import { useActiveTrack } from "react-native-track-player";
import { useLastActiveTrack } from "@screens/audio/hook/useLastActiveTrack";
import { emitSocket } from "@helpers/socket.helper";
import useStore from "@services/zustand/store";
import { closeSuperModal, showLoading } from "@helpers/super.modal.helper";
// import { EnumModalContentType, EnumStyleModalType, showSuperModal } from "@helpers/super.modal.helper";

const NewHomeScreen = () => {
  const { isLoggedIn } = useUserHook();
  const activeTrack = useActiveTrack();
  const lastActiveTrack = useLastActiveTrack();

  const displayedTrack = activeTrack ?? lastActiveTrack;
  const hide =
    !displayedTrack ||
    displayedTrack.url ===
    "https://ia801304.us.archive.org/32/items/SilentRingtone/silence.mp3";

  // const _showSuperModalCourse = () => {
  //   showSuperModal({
  //     styleModalType: EnumStyleModalType.Bottom,
  //     contentModalType: EnumModalContentType.Schedule
  //   })
  // };
  const userData = useStore(state => state.userData)
  return (
    <View style={CS.flex1}>
      {/* <StatusBar backgroundColor="transparent" barStyle="dark-content" /> */}
      <View style={{ flex: 1 }}>
        <ListPostNew />
      </View>
      {isLoggedIn() && (
        <TouchableOpacity
          style={{
            position: "absolute",
            width: 50,
            height: 50,
            backgroundColor: palette.primary,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 25,
            bottom: !hide ? 80 : 10,
            right: 10,
            zIndex: 1,
          }}
          // onPress={_showSuperModalCourse}
          // onPress={() => NavigationService.navigate(SCREENS.AUDIO_PLAY)}
          onPress={() => {
            const id = userData?.user_role == "teacher" ? "666ffe3f715cee894e6f0a71" : "666c162294f133507f9c87da"
            // if (userData?.user_role == "teacher") {
            //   showLoading()
            //   emitSocket("joinOneone", id);
            //   setTimeout(() => {
            //     navigate(SCREENS.ONEONE_SCREEN)
            //     setTimeout(() => {
            //       closeSuperModal()
            //     }, 500)
            //   }, 3000)
            //   return
            // } else {
              navigate(SCREENS.ONEONE_SCREEN)
            // }
            // navigate(SCREENS.ONEONE_SCREEN)
            // navigate(SCREENS.POST_SCREEN)


          }}
        // onPress={() => navigate(SCREENS.MANAGE_CERTIFICATE)}
        >
          <Icon
            name={"add-outline"}
            type={IconType.Ionicons}
            size={30}
            color={palette.white}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NewHomeScreen;
