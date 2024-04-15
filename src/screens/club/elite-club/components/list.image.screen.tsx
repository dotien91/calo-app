import React from "react";
import { SafeAreaView, ScrollView } from "react-native";

import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import MessageMediaView from "@screens/chat/room-chat/components/message/message.media.view";

const ListImageScreen = () => {
  const _renderMediaClub = () => {
    const mediaClub = props.currentMessage.media_ids;
    if (!mediaClub?.length) return null;
    return (
      <MessageMediaView data={mediaClub} status={props.currentMessage.status} />
    );
  };
  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.club.imageClub} />
      <ScrollView>{_renderMediaClub}</ScrollView>
    </SafeAreaView>
  );
};

export default ListImageScreen;

// const styles = StyleSheet.create({});
