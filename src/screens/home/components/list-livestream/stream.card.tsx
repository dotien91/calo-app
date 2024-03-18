import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import CS from "@theme/styles";
import { SCREENS } from "constants";
import { IStreamItem } from "models/stream.model";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import IconSvg from "assets/svg";
import PressableBtn from "@shared-components/button/PressableBtn";

// const { width } = Dimensions.get("screen");

// const PADDING_HORIZONTAL = 8;
// const SIZE_AVATAR = 20;
// const PADDING_LEFT = 8;

const StreamCard = ({ data }: { data: IStreamItem }) => {
  const IconText = ({ nameIcon, text }: { nameIcon: string; text: string }) => {
    return (
      <View style={{ ...CS.center, flexDirection: "row" }}>
        <IconSvg name={nameIcon} size={16} color={palette.white} />
        <Text style={[styles.txtLive, { marginHorizontal: 4 }]}>{text}</Text>
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
      <PressableBtn onPress={goToViewStream} style={styles.styleItemLiveStream}>
        <Image
          style={styles.styleCover}
          source={{ uri: data?.user_id?.user_avatar_thumbnail }}
        />
        <View style={styles.viewAction}>
          <Text style={styles.styleTxtTitle1}>{translations.titleLive}</Text>
          <View style={styles.viewLive}>
            <View style={styles.btnLive}>
              <Text style={styles.txtLive}>LIVE</Text>
            </View>
            <View style={styles.viewEye}>
              <IconText nameIcon="icEyeStream" text="123" />
            </View>
          </View>
        </View>
      </PressableBtn>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingBottom: 4,
  },
  styleItemLiveStream: {
    flexDirection: "row",
    gap: 4,
    left: 1,
    top: 1,
  },
  styleCover: {
    height: 178,
    width: 328,
    marginBottom: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  viewAction: {
    flexDirection: "column",
    position: "absolute",
    zIndex: 2,
    gap: 10,
  },
  styleTxtTitle1: {
    ...CS.textTitleStream,
  },
  viewLive: {
    height: 24,
    width: 100,
    flexDirection: "row",
    gap: 4,
  },
  btnLive: {
    ...CS.center,
    width: 40,
    backgroundColor: palette.primary,
    borderRadius: 4,
  },
  txtLive: {
    ...CS.textLive,
  },
  viewEye: {
    ...CS.center,
    backgroundColor: palette.textOpacity6,
    borderRadius: 4,
    width: 60,
  },
});

export default React.memo(StreamCard);
