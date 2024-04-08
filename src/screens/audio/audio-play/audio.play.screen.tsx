import * as React from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { GetPodCastDetail } from "@services/api/podcast.api";
import IconSvgBtn from "../components/IconSvgBtn";
import Slider from "@react-native-community/slider";
import TrackPlayer, {
  Event,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { formatTime } from "@utils/date.utils";

const AudioPlayScreen = () => {
  const [isPause, setIsPause] = React.useState(true);
  // const [podcast, setPodcast] = React.useState();
  const progress = useProgress();
  const [trackTitle, setTrackTitle] = React.useState("");
  const [trackAuthor, setTrackAuthor] = React.useState("");

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const { title, artist } = track || {};
      setTrackTitle(title);
      setTrackAuthor(artist);
    } else {
      const tracks = await TrackPlayer.getQueue();
      console.log("tracks...", tracks);
      setTrackTitle(tracks[0].title);
      setTrackAuthor(tracks[0].artist);
    }
  });

  React.useEffect(() => {
    _getDetailPodCast();
    setupPlayer();
  }, []);

  const _getDetailPodCast = () => {
    const _id = "661395c7d29bd7cb5f9bca4c";
    GetPodCastDetail(_id).then((res) => {
      console.log("res podcast", res);
    });
  };

  const setupPlayer = async () => {
    const track1 = {
      url: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3", // Load media from the network
      title: "Nóng giận là bản năng, tính lặng là bản lĩnh",
      artist: "Tống Mặc",
      album: "while(1<2)",
      genre: "Progressive House, Electro House",
      date: "2014-05-20T07:00:00+00:00", // RFC 3339
      artwork: "http://example.com/cover.png", // Load artwork from the network
    };
    console.log(1);
    // await TrackPlayer.setupPlayer();
    // await TrackPlayer.updateOptions({
    //   capabilities: [
    //     Capability.Play,
    //     Capability.Pause,
    //     Capability.SkipToNext,
    //     Capability.SkipToPrevious,
    //     Capability.Stop,
    //   ],

    //   // Capabilities that will show up when the notification is in the compact form on Android
    //   compactCapabilities: [Capability.Play, Capability.Pause],
    // });
    // TrackPlayer.setupPlayer()
    //   .then(() => {
    //     console.log("setup track player successfully");
    //     TrackPlayer.updateOptions({
    //       android: {
    //         appKilledPlaybackBehavior:
    //           AppKilledPlaybackBehavior.ContinuePlayback,
    //       },
    //       // This flag is now deprecated. Please use the above to define playback mode.
    //       // stoppingAppPausesPlayback: true,
    //       capabilities: [
    //         Capability.Play,
    //         Capability.Pause,
    //         Capability.SkipToNext,
    //         Capability.SkipToPrevious,
    //         Capability.SeekTo,
    //       ],
    //       compactCapabilities: [
    //         Capability.Play,
    //         Capability.Pause,
    //         Capability.SkipToNext,
    //       ],
    //       progressUpdateEventInterval: 2,
    //     }).catch(console.log);
    //   })
    //   .catch(console.log);
    console.log(2);
    await TrackPlayer.add(track1);
    console.log(3);
    await TrackPlayer.seekBy(0);
  };

  const next = () => {
    // next
    TrackPlayer.skipToNext();
  };

  const previous = () => {
    // previous
    TrackPlayer.skipToPrevious();
  };

  const pause = () => {
    // pause/play
    setIsPause(!isPause);
    if (isPause) {
      TrackPlayer.play();
    } else {
      TrackPlayer.pause();
    }
  };

  const forWard = async () => {
    if (progress.position + 10 < progress.duration) {
      await TrackPlayer.seekTo(progress.position + 10);
    } else {
      await TrackPlayer.seekTo(progress.duration - 5);
    }
  };

  const backWard = async () => {
    // -10s
    if (progress.position - 10 > 0) {
      await TrackPlayer.seekTo(progress.position - 10);
    } else {
      await TrackPlayer.seekTo(0);
    }
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header />
      <View style={styles.viewAudio}>
        <View style={styles.viewImage}></View>
        <View style={styles.viewTitle}>
          <Text style={styles.txtTitle}>{trackTitle}</Text>
          <Text style={styles.txtAuthor}>{trackAuthor}</Text>
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
            onSlidingComplete={async (value) => {
              await TrackPlayer.seekTo(value);
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
          <IconSvgBtn
            name="icPreviousAudio"
            onPress={previous}
            color={palette.textOpacity6}
            size={32}
          />
          <IconSvgBtn
            name="icBackward"
            onPress={backWard}
            color={palette.textOpacity6}
            size={32}
          />
          <IconSvgBtn
            name={isPause ? "icPlayAudio" : "icPauseAudio"}
            onPress={pause}
            color={palette.primary}
            size={64}
          />
          <IconSvgBtn
            name="icForward"
            onPress={forWard}
            color={palette.textOpacity6}
            size={32}
          />
          <IconSvgBtn
            name="icNextAudio"
            onPress={next}
            color={palette.textOpacity6}
            size={32}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AudioPlayScreen;

const styles = StyleSheet.create({
  viewAudio: {
    paddingHorizontal: 16,
    ...CS.center,
    height: (ScreenHeight * 411) / 812,
  },
  viewImage: {
    ...CS.center,
    height: (ScreenHeight * 311) / 812,
    width: (ScreenHeight * 195) / 812,
    backgroundColor: "red",
  },
  viewTitle: {
    marginTop: 16,
    height: (ScreenHeight * 84) / 812,
  },
  txtTitle: {
    ...CS.hnBold,
    fontSize: 20,
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
    justifyContent: "center",
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
    gap: 16,
    width: "100%",
  },
  progress: {
    width: ScreenWidth - 32,
    height: 24,
  },
  txtTime: {
    ...CS.hnRegular,
  },
});
