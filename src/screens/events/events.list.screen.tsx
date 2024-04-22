import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";

import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import * as NavigationService from "react-navigation-helpers";
import { translations } from "@localization";
import { SCREENS } from "constants";
import UpcomingEvent from "./components/upcoming.event";
// import PastEvent from "./components/past.event";

const EventsListScreen = () => {
  const route = useRoute();
  const group_id = route.params?.club_id || "";
  const tier = route.params?.tier || "1";

  const addEvent = () => {
    NavigationService.navigate(SCREENS.CREATEEVENT, {
      group_id: group_id,
    });
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header
        text={translations.event.events}
        iconNameRight={tier != 1 ? "plus" : ""}
        onPressRight={addEvent}
      />
      <ScrollView>
        <UpcomingEvent club_id={group_id} />
        {/* <PastEvent club_id={group_id} /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventsListScreen;
