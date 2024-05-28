import * as React from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvgBtn from "../components/IconSvgBtn";
import Slider from "@react-native-community/slider";
import TrackPlayer, {
  useProgress,
  useIsPlaying,
  useActiveTrack,
} from "react-native-track-player";
import FastImage from "react-native-fast-image";

import { formatTime } from "@utils/date.utils";
import eventEmitter from "@services/event-emitter";
import { useActionTrack } from "../hook/useActionTrack";
import { FloatingPlayer } from "./FloatingPlayer";

const HEIGHT_IMAGE = (ScreenHeight * 311) / 812;
const WIDTH_IMAGE = (HEIGHT_IMAGE * 114) / 140;
interface ModalProps {
  type: "full" | "bottom";
  onPressHide: () => void;
  onPressShow: () => void;
}

const ModalAudioPlayScreen = ({
  type,
  onPressHide,
  onPressShow,
}: ModalProps) => {
  // const [podcast, setPodcast] = React.useState();
  const progress = useProgress();
  const { playing } = useIsPlaying();
  const activeTrack = useActiveTrack();

  React.useEffect(() => {
    // _getDetailPodCast();
    eventEmitter.emit("floating_play", { show: false });
    return () => {
      eventEmitter.emit("floating_play", { show: true });
    };
  }, []);

  const { pause, forWard, backWard } = useActionTrack();
  if (type === "bottom") {
    return (
      <View>
        <FloatingPlayer onPressShow={onPressShow} />
      </View>
    );
  }

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header onPressLeft={onPressHide} />
      <View style={styles.viewAudio}>
        <View style={styles.viewImage}>
          <FastImage
            style={styles.viewImage}
            source={{ uri: activeTrack?.artwork }}
            borderRadius={8}
          />
        </View>
        <View style={styles.viewTitle}>
          <Text
            numberOfLines={2}
            style={[
              styles.txtTitle,
              activeTrack?.title.length > 60 && { textAlign: "auto" },
            ]}
          >
            {activeTrack?.title}
          </Text>
          <Text numberOfLines={1} style={styles.txtAuthor}>
            {activeTrack?.artist}
          </Text>
        </View>
      </View>
      <View style={styles.viewChild}>
        <View style={styles.viewDuration}>
          <Slider
            style={styles.progress}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor={palette.grey5}
            minimumTrackTintColor={palette.primary}
            maximumTrackTintColor={palette.grey6}
            onSlidingComplete={(value) => {
              TrackPlayer.seekTo(value);
            }}
          />
        </View>
        <View style={styles.viewTime}>
          <View>
            <Text style={styles.txtTime}>{formatTime(progress.position)}</Text>
          </View>
          <View>
            <Text style={styles.txtTime}>{formatTime(progress.duration)}</Text>
          </View>
        </View>
        <View style={styles.viewAction}>
          {/* <IconSvgBtn
            name="icPreviousAudio"
            onPress={!isFirst ? previous : () => {}}
            color={isFirst ? palette.textOpacity4 : palette.textOpacity6}
            size={32}
          /> */}
          <IconSvgBtn
            name="icBackward"
            onPress={backWard}
            color={palette.textOpacity6}
            size={40}
          />
          <IconSvgBtn
            name={!playing ? "icPlayAudio" : "icPauseAudio"}
            onPress={pause}
            color={palette.primary}
            size={64}
          />
          <IconSvgBtn
            name="icForward"
            onPress={forWard}
            color={palette.textOpacity6}
            size={40}
          />
          {/* <IconSvgBtn
            name="icNextAudio"
            onPress={!isLast ? next : () => {}}
            color={isLast ? palette.textOpacity4 : palette.textOpacity6}
            size={32}
          /> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ModalAudioPlayScreen;

const styles = StyleSheet.create({
  viewAudio: {
    paddingHorizontal: 16,
    ...CS.center,
    height: (ScreenHeight * 411) / 812,
    backgroundColor: palette.background,
  },
  viewImage: {
    ...CS.center,
    height: HEIGHT_IMAGE,
    width: WIDTH_IMAGE,
  },
  viewTitle: {
    marginTop: 16,
    height: (ScreenHeight * 84) / 812,
    width: ScreenWidth,
  },
  txtTitle: {
    ...CS.hnBold,
    fontSize: 20,
    paddingHorizontal: 16,
    textAlign: "center",
  },
  txtAuthor: {
    ...CS.hnRegular,
    textAlign: "center",
    color: palette.textOpacity6,
  },
  viewChild: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "flex-start",
  },
  viewDuration: {
    height: 24,
  },
  viewTime: {
    ...CS.row,
    justifyContent: "space-between",
    marginTop: 12,
  },
  viewAction: {
    marginTop: 16,
    height: 64,
    ...CS.row,
    ...CS.center,
    gap: 20,
    width: "100%",
  },
  progress: {
    width: ScreenWidth - 32,
    height: 24,
    // backgroundColor: palette.primary,
  },
  txtTime: {
    ...CS.hnRegular,
  },
});
