import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import CS from "@theme/styles";
import { SCREENS } from "constants";
import { IStreamItem } from "models/stream.model";
import LiveBadge from "@screens/stream/components/LiveBadge";
import VideoPlayer from "@shared-components/video.player.component";
import { palette } from "@theme/themes";
import { translations } from "@localization";

const StreamCard = ({ data }: { data: IStreamItem }) => {
  const renderVideoLive = () => {
    return (
      <View style={styles.styleItemLiveStream}>
        <View style={styles.viewVideo}>
          <VideoPlayer
            mediaThumbail={data?.user_id?.user_avatar_thumbnail}
            resizeMode="cover"
            width={styles.styleCover.width}
            height={styles.styleCover.height}
            autoPlay={false}
            onPress={goToViewStream}
          />
        </View>
        <View style={styles.viewAction}>
          <Text style={styles.styleTxtTitle1}>{translations.titleLive}</Text>
          <LiveBadge
            customStyle={{
              top: 80,
            }}
          />
        </View>
      </View>
    );
  };
  const goToViewStream = () => {
    NavigationService.navigate(SCREENS.VIEW_LIVE_STREAM, {
      liveStreamId: data._id,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.styleListLiveStream}>
        <Pressable onPress={goToViewStream}>{renderVideoLive()}</Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 2,
    backgroundColor: palette.background,
    paddingTop: 14,
    paddingBottom: 4,
    borderRadius: 8,
  },
  styleListLiveStream: {
    height: 120,
    borderRadius: 8,
  },
  styleItemLiveStream: {
    flexDirection: "row",
    gap: 10,
    borderRadius: 8,
  },
  viewVideo: {
    bottom: 80,
  },
  viewAction: {
    flexDirection: "column",
    position: "absolute",
    zIndex: 2,
    gap: 10,
  },
  styleTxtTitle1: {
    ...CS.textTitleStream,
    top: 60,
    left: 10,
  },
});

export default React.memo(StreamCard);
