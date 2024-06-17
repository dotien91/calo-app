import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
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
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import IconSvg from "assets/svg";
// import * as NavigationService from "react-navigation-helpers";
import IconBtn from "@shared-components/button/IconBtn";
import { IconType } from "react-native-dynamic-vector-icons";

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

  const Header = () => {
    return (
      <TouchableOpacity style={styles.viewHeader} onPress={onPressHide}>
        <IconBtn
          name={"chevron-down"}
          type={IconType.Feather}
          size={25}
          color={palette.white}
        />
      </TouchableOpacity>
    );
  };
  return (
    <>
      <ImageBackground
        style={{ flex: 1 }}
        blurRadius={100}
        source={{ uri: activeTrack?.artwork }}
      >
        <View style={styles.overlay} />
        <Pressable onPressIn={onPressHide} style={styles.viewBackdrop} />
        <View style={styles.container}>
          {/* <Header onPressLeft={onPressHide} /> */}
          <Header />
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
                minimumTrackTintColor={palette.white}
                maximumTrackTintColor={palette.grey6}
                onSlidingComplete={(value) => {
                  TrackPlayer.seekTo(value);
                }}
              />
            </View>
            <View style={styles.viewTime}>
              <View>
                <Text style={styles.txtTime}>
                  {formatTime(progress.position)}
                </Text>
              </View>
              <View>
                <Text style={styles.txtTime}>
                  {formatTime(progress.duration)}
                </Text>
              </View>
            </View>
            <View style={styles.viewAction}>
              {/* <IconSvgBtn
            name="icPreviousAudio"
            onPress={!isFirst ? previous : () => {}}
            color={isFirst ? palette.textOpacity4 : palette.textOpacity6}
            size={32}
          /> */}
              <TouchableOpacity
                style={styles.buttonContainer}
                onPressIn={backWard}
              >
                <IconSvg name="icBackward" color={palette.white} size={40} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPressIn={pause}
              >
                <IconSvg
                  name={!playing ? "icPlayAudio" : "icPauseAudio"}
                  color={palette.white}
                  size={64}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPressIn={forWard}
              >
                <IconSvg name="icForward" color={palette.white} size={40} />
              </TouchableOpacity>
              {/* <IconSvgBtn
            name="icNextAudio"
            onPress={!isLast ? next : () => {}}
            color={isLast ? palette.textOpacity4 : palette.textOpacity6}
            size={32}
          /> */}
            </View>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default ModalAudioPlayScreen;

const styles = StyleSheet.create({
  viewBackdrop: {
    flex: 1,
    // backgroundColor: palette.backgroundPayment,
  },
  container: {
    height: SCREEN_HEIGHT,

    // pointerEvents: "box-none",
  },
  viewAudio: {
    paddingHorizontal: 16,
    ...CS.center,
    height: (ScreenHeight * 411) / 812,
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
    color: palette.white,
  },
  txtAuthor: {
    ...CS.hnRegular,
    textAlign: "center",
    color: palette.white,
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
    // pointerEvents: "box-none",
  },
  progress: {
    width: ScreenWidth - 32,
    height: 24,
    // backgroundColor: palette.primary,
  },
  txtTime: {
    ...CS.hnRegular,
    color: palette.white,
  },
  // dragbarContainer: {
  //   width: "100%",
  //   height: 40,
  //   borderTopLeftRadius: 20,
  //   borderTopRightRadius: 20,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   // pointerEvents: "box-none",
  //   elevation: 2,
  //   backgroundColor: palette.background,
  // },
  // dragBar: {
  //   width: 80,
  //   height: 6,
  //   backgroundColor: palette.background2,
  //   borderRadius: 12,
  // },
  buttonContainer: {
    // pointerEvents: "box-none", // Đảm bảo button nhận sự kiện
  },
  viewHeader: {
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 12,
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    backgroundColor: "#484d49",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    opacity: 0.3,
  },
});
