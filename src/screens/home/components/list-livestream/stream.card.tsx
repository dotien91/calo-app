import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import * as NavigationService from "react-navigation-helpers";

import CS from "@theme/styles";
import { SCREENS } from "constants";
import { IStreamItem } from "models/stream.model";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import IconSvg from "assets/svg";
import PressableBtn from "@shared-components/button/PressableBtn";
import { WindowWidth } from "@freakycoder/react-native-helpers";

const StreamCard = ({ data }: { data: IStreamItem }) => {
  const IconText = ({ nameIcon, text }: { nameIcon: string; text: string }) => {
    return (
      <View style={styles.iconText}>
        <IconSvg name={nameIcon} size={16} color={palette.white} />
        <Text style={[styles.txtLive]}>{text}</Text>
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
        <FastImage
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
    marginHorizontal: 4,
    width: WindowWidth - 40,
  },
  iconText: {
    ...CS.center,
    flexDirection: "row",
  },
  styleItemLiveStream: {
    flexDirection: "row",
    gap: 4,
    left: 1,
    top: 1,
  },
  styleCover: {
    height: ((WindowWidth - 40) / 19) * 10,
    width: WindowWidth - 40,
    // marginBottom: 16,
    borderRadius: 4,
    // overflow: "hidden",
  },
  viewAction: {
    flexDirection: "column",
    position: "absolute",
    zIndex: 2,
    gap: 10,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
