import * as React from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import CS from "@theme/styles";
import AudioQuickFilter from "../components/audio.quick.filter";
import AudioView from "../audio-list/audio.view";
import AudioList from "../audio-list/audio.list";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { palette } from "@theme/themes";
import { useUserHook } from "@helpers/hooks/useUserHook";
import useStore from "@services/zustand/store";
import { useLastActiveTrack } from "../hook/useLastActiveTrack";
import { useActiveTrack } from "react-native-track-player";
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

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.audio.audioBook} />
      <ScrollView style={styles.viewContainer}>
        <AudioQuickFilter />
        {/* <AudioListContinue /> */}
        <AudioView />
        <AudioList />
      </ScrollView>
      {isLoggedIn() && userData?._id && (
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
          onPress={() => navigate(SCREENS.CREATE_AUDIO)}
        >
          <Icon
            name={"add-outline"}
            type={IconType.Ionicons}
            size={30}
            color={palette.white}
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default AudioBookScreen;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
});
