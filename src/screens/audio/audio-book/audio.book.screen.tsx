import * as React from "react";
import { StyleSheet, SafeAreaView, ScrollView } from "react-native";

import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import CS from "@theme/styles";
import AudioQuickFilter from "../components/audio.quick.filter";
import AudioView from "../audio-list/audio.view";
import AudioList from "../audio-list/audio.list";

const AudioBookScreen = () => {
  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.audio.audioBook} />
      <ScrollView style={styles.viewContainer}>
        <AudioQuickFilter />
        <AudioView />
        <AudioList />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AudioBookScreen;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
});
