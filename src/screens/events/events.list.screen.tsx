import React from "react";
import { SafeAreaView, ScrollView } from "react-native";

import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import * as NavigationService from "react-navigation-helpers";
import { translations } from "@localization";
import { SCREENS } from "constants";
import UpcomingEvent from "./components/upcoming.event";
import PastEvent from "./components/past.event";

const EventsListScreen = () => {
  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header
        text={translations.event.events}
        iconNameRight="plus"
        onPressRight={() => {
          NavigationService.navigate(SCREENS.CREATEEVENT);
        }}
      />
      <ScrollView>
        <UpcomingEvent />
        <PastEvent />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventsListScreen;
