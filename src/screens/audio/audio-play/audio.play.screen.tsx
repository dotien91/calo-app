import * as React from "react";

import { View, StyleSheet, SafeAreaView, Text, Image } from "react-native";
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
import { formatTime } from "@utils/date.utils";
import eventEmitter from "@services/event-emitter";
import { useActionTrack } from "../hook/useActionTrack";

const AudioPlayScreen = () => {
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

  // const _getDetailPodCast = () => {
  //   const _id = "661395c7d29bd7cb5f9bca4c";
  //   GetPodCastDetail(_id).then((res) => {
  //     console.log("res podcast", res);
  //   });
  // };

  //check audio trong store nếu đã có, có postion thì phát tại thời điểm position đấy
  // const playTrack = async (track: Track) => {
  //   const item = listAudioHistory.filter((item) => item.url === track.url);
  //   if (item.length > 0) {
  //     await TrackPlayer.seekBy(item[0].position || 0);
  //   }
  //   await TrackPlayer.play();
  // };

  // const addTrack1 = async () => {
  //   await TrackPlayer.reset();
  //   const track1 = {
  //     url: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3", // Load media from the network
  //     title: "Nóng giận là bản năng, tính lặng là bản lĩnh",
  //     artist: "Tống Mặc",
  //     artwork:
  //       "https://files.exam24h.com/upload/2024/04/05_1712286066220/660f690336fba2cad28c28cb-1712286066220-thumbnail-178D768A-5D86-4518-BE09-792644A0331D.jpg", // Load artwork from the network
  //   };
  //   await TrackPlayer.add(track1);
  //   playTrack(track1);

  //   // await TrackPlayer.seekBy(0);
  //   addAudio(track1);
  // };
  // const addTrack2 = async () => {
  //   const track2 = {
  //     url: "https://files.exam24h.com/upload/2024/04/09_1712648931272/661390fed29bd7cb5f9bc88c/Free_Test_Data_1MB_MP3.mp3", // Load media from the network
  //     title: "Nóng giận là bản năng",
  //     artist: "Tống",
  //     artwork:
  //       "https://files.exam24h.com/upload/2024/04/05_1712281673269/65eff9ab90b6b0c22ac991d5-1712281673269-thumbnail-DALL%C3%82%C2%B7E%202024-04-05%2008.42.32%20-%20A%20student%20standing%20in%20front%20of%20a%20famous%20Australian%20university%2C%20showcasing%20modern%20buildings%20and%20lush%20campus%20grounds%2C%20with%20the%20Great%20Barrier%20Reef%20in%20the.webp", // Load artwork from the network
  //   };
  //   await TrackPlayer.add(track2);
  //   // await TrackPlayer.seekBy(0);
  //   addAudio(track2);
  // };

  const { pause, forWard, next, previous, backWard } = useActionTrack();

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header />
      <View style={styles.viewAudio}>

        <View style={styles.viewImage}>
          <Image
            style={styles.viewImage}
            source={{ uri: activeTrack?.artwork }}
            borderRadius={8}
          />
        </View>
        <View style={styles.viewTitle}>
          <Text style={styles.txtTitle}>{activeTrack?.title}</Text>
          <Text style={styles.txtAuthor}>{activeTrack?.artist}</Text>
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
            name={!playing ? "icPlayAudio" : "icPauseAudio"}
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
          {/* Fake add audio */}
          {/* <IconSvgBtn
            name="icNextAudio"
            onPress={addTrack1}
            color={palette.textOpacity6}
            size={32}
          />
          <IconSvgBtn
            name="icNextAudio"
            onPress={stop}
            color={palette.textOpacity6}
            size={32}
          /> */}
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
