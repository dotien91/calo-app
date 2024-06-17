import * as React from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { useActiveTrack } from "react-native-track-player";

import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import CS from "@theme/styles";
import AudioList from "../audio-list/audio.list";
import { palette } from "@theme/themes";
import { useUserHook } from "@helpers/hooks/useUserHook";
import useStore from "@services/zustand/store";
import { useLastActiveTrack } from "../hook/useLastActiveTrack";
import { navigate } from "@helpers/navigation.helper";
import { SCREENS } from "constants";
// import AudioListContinue from "../audio-list/audio.list.continue";

const AudioBookScreen = () => {
  const userData = useStore((state) => state.userData);
  const activeTrack = useActiveTrack();
  const lastActiveTrack = useLastActiveTrack();

  const displayedTrack = activeTrack ?? lastActiveTrack;
  const { isLoggedIn } = useUserHook();
  const hide =
    !displayedTrack ||
    displayedTrack.url ===
      "https://ia801304.us.archive.org/32/items/SilentRingtone/silence.mp3";

  const [showMore, setShowMore] = React.useState(false);

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.audio.audioBook} />
      <AudioList />
      {isLoggedIn() && userData?._id && (
        <>
          <TouchableOpacity
            style={{
              ...styles.btn,
              bottom: !hide ? 80 : 10,
            }}
            onPress={() => setShowMore(!showMore)}
          >
            <Icon
              name={"add-outline"}
              type={IconType.Ionicons}
              size={30}
              color={palette.white}
            />
          </TouchableOpacity>
          {showMore && (
            <TouchableOpacity
              style={{
                ...styles.btn2,
                bottom: !hide ? 140 : 70,
              }}
              onPress={() => navigate(SCREENS.CREATE_AUDIO)}
            >
              <Icon
                name={"list-circle-outline"}
                type={IconType.Ionicons}
                size={30}
                color={palette.white}
              />
            </TouchableOpacity>
          )}
          {showMore && (
            <TouchableOpacity
              style={{
                ...styles.btn2,
                bottom: !hide ? 200 : 130,
              }}
              onPress={() => navigate(SCREENS.CREATE_AUDIO, { isChild: true })}
            >
              <Icon
                name={"headset-outline"}
                type={IconType.Ionicons}
                size={30}
                color={palette.white}
              />
            </TouchableOpacity>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btn: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: palette.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    right: 10,
    zIndex: 1,
  },
  btn2: {
    position: "absolute",
    width: 40,
    height: 40,
    backgroundColor: palette.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    right: 10,
    zIndex: 1,
  },
});

export default AudioBookScreen;
