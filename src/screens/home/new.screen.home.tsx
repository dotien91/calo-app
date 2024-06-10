import { useUserHook } from "@helpers/hooks/useUserHook";
import CS from "@theme/styles";
import React from "react";
import { View, TouchableOpacity } from "react-native";
import ListPostNew from "./new.list.post";
import useStore from "@services/zustand/store";
import { palette } from "@theme/themes";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { navigate } from "@helpers/navigation.helper";
import { SCREENS } from "constants";
import { useActiveTrack } from "react-native-track-player";
import { useLastActiveTrack } from "@screens/audio/hook/useLastActiveTrack";
// import { EnumModalContentType, EnumStyleModalType, showSuperModal } from "@helpers/super.modal.helper";

const NewHomeScreen = () => {
  const userData = useStore((state) => state.userData);

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
          onPress={() => navigate(SCREENS.POST_SCREEN)}
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
