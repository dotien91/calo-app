import * as React from "react";
import { SafeAreaView } from "react-native";

import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import CS from "@theme/styles";
import AudioList from "../audio-list/audio.list";

const AudioBookScreen = () => {
  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.audio.audioBook} />
      <AudioList />
    </SafeAreaView>
  );
};

export default AudioBookScreen;
