import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import TrackPlayer, { Track, useActiveTrack } from "react-native-track-player";
import Sound from "react-native-sound";

import { ScreenHeight } from "@freakycoder/react-native-helpers";
import { translations } from "@localization";
import TextViewCollapsed from "@screens/course/components/text.view.collapsed";
import { GetPodCastDetail } from "@services/api/podcast.api";
import useStore from "@services/zustand/store";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import { TypeTrackLocal } from "models/audio.modal";
import ListReviewView from "./list.review";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
  showWarningLogin,
} from "@helpers/super.modal.helper";
import Button from "@shared-components/button/Button";
import { useRoute } from "@react-navigation/native";
import { formatTimeDuration } from "@utils/date.utils";
import Header from "../components/Header";
import { shareAudio } from "@utils/share.utils";
import FastImage from "react-native-fast-image";
import { useUserHook } from "@helpers/hooks/useUserHook";
import { useLastActiveTrack } from "../hook/useLastActiveTrack";
import eventEmitter from "@services/event-emitter";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { getBottomSpace } from "react-native-iphone-screen-helper";

const HEIGHT_IMAGE = (ScreenHeight * 311) / 812;
const WIDTH_IMAGE = (HEIGHT_IMAGE * 114) / 140;

const AudioPreview = () => {
  const addAudio = useStore((store) => store.addAudio);
  const listAudioHistory = useStore((store) => store.listAudioHistory);
  const listAudio = useStore((store) => store.listAudio);
  const route = useRoute();
  const id = route?.params?.id || "";
  const data = route?.params?.data || {};
  const [track, setTrack] = React.useState<TypeTrackLocal>(data);
  const [duration, setDuration] = React.useState(0);
  const { isLoggedIn } = useUserHook();

  const activeTrack = useActiveTrack();
  const lastActiveTrack = useLastActiveTrack();

  const displayedTrack = activeTrack ?? lastActiveTrack;

  const getDataTrack = () => {
    if (data?.attach_files[0]?.media_url) {
      const whoosh = new Sound(data?.attach_files[0].media_url, "", (error) => {
        if (error) {
          console.log("failed to load the sound", error);
        } else {
          setDuration(Math.floor(whoosh.getDuration() || 0));
        }
      });
    } else {
      GetPodCastDetail(id).then((res) => {
        if (!res.isError) {
          setTrack(res.data);
          const whoosh = new Sound(
            res.data?.attach_files[0].media_url,
            "",
            (error) => {
              if (error) {
                console.log("failed to load the sound", error);
              } else {
                setDuration(Math.floor(whoosh.getDuration() || 0));
              }
            },
          );
        }
      });
    }
  };

  React.useEffect(() => {
    getDataTrack();
  }, []);
  const ItemCategory = ({ title, des }: { title: string; des: string }) => {
    return (
      <View style={styles.itemCategory}>
        <Text numberOfLines={1} style={styles.titleCategory}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.desCategory}>
          {des}
        </Text>
      </View>
    );
  };

  const renderCategory = () => {
    return (
      <View style={styles.categoryContainer}>
        <ItemCategory
          title={track?.podcast_category.category_title || " "}
          des={translations.podcast.category}
        />
        <ItemCategory
          title={duration ? formatTimeDuration(duration) : "-"}
          des={translations.podcast.audio}
        />
        <ItemCategory
          title={track?.country || " "}
          des={translations.podcast.language}
        />
      </View>
    );
  };

  const playTrack = async (track: Track) => {
    const item = listAudioHistory.filter((item) => item.url === track.url);
    // await TrackPlayer.skip(indexLocal);
    if (item.length > 0) {
      await TrackPlayer.seekBy(item[0].position || 0);
    }
    await TrackPlayer.play();
    closeSuperModal();
  };

  // const playAudio2 = async () => {
  //   NavigationService.navigate(SCREENS.AUDIO_PLAY);
  //   showSuperModal({
  //     contentModalType: EnumModalContentType.Loading,
  //     styleModalType: EnumStyleModalType.Middle,
  //   });
  //   await TrackPlayer.reset();
  //   const indexLocal = listAudio.findIndex((item) => item._id === id);
  //   if (indexLocal >= 0) {
  //     // const list = listAudio.slice(indexLocal, listAudio.length);
  //     let track;
  //     for (let i = 0; i < listAudio.length; i++) {
  //       const element = listAudio[i];
  //       const track1 = {
  //         url: element?.attach_files[0].media_url,
  //         title: element?.title,
  //         artist: element?.user_id.display_name,
  //         artwork: element?.post_avatar.media_url,
  //       };
  //       await TrackPlayer.add(track1);
  //       if (i == indexLocal) {
  //         track = track1;
  //       }
  //     }
  //     if (track) {
  //       await playTrack(track);
  //     }
  //   }
  //   // lưu vào store
  //   const track2 = {
  //     url: track?.attach_files[0].media_url,
  //     title: track?.title,
  //     artist: track?.user_id.display_name,
  //     artwork: track?.post_avatar.media_url,
  //   };
  //   addAudio(track2);
  //   // await TrackPlayer.seekBy(0);
  // };
  const playAudio = async () => {
    // NavigationService.navigate(SCREENS.AUDIO_PLAY);
    if (data?.attach_files.length == 0) {
      showToast({ type: "warning", message: translations.podcast.updating });
      return;
    }
    eventEmitter.emit("floating_play", { show: true });
    await TrackPlayer.reset();
    const track = {
      url: data?.attach_files[0].media_url,
      title: data?.title,
      artist: data?.user_id.display_name,
      artwork: data?.post_avatar.media_url,
    };
    await TrackPlayer.add(track);
    await playTrack(track);
    addAudio(track);
    setTimeout(async () => {
      for (let i = 0; i < listAudio.length; i++) {
        const element = listAudio[i];
        const track1 = {
          url: element?.attach_files[0].media_url,
          title: element?.title,
          artist: element?.user_id.display_name,
          artwork: element?.post_avatar.media_url,
        };
        if (track1.url === track.url) continue;
        await TrackPlayer.add(track1);
      }
    }, 1000);
  };

  const showWriteReview = () => {
    if (!isLoggedIn()) {
      showWarningLogin();
      return;
    }
    showSuperModal({
      contentModalType: EnumModalContentType.ReviewAudio,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        hideCloseIcon: true,
        id: id,
      },
    });
  };
  const onPressShare = () => {
    shareAudio("https://ikigaicoach.net");
  };
  const hide =
    !displayedTrack ||
    displayedTrack.url ===
      "https://ia801304.us.archive.org/32/items/SilentRingtone/silence.mp3";
  console.log(hide);

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header onPressRight={onPressShare} iconNameRight="share-2" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.viewAudio}>
          <View style={styles.viewImage}>
            <FastImage
              style={styles.viewImage}
              source={{ uri: track?.post_avatar.media_url }}
              borderRadius={8}
            />
          </View>
          <View style={styles.viewTitle}>
            <Text style={styles.txtTitle}>{track?.title}</Text>
            <Text style={styles.txtAuthor}>{track?.user_id.display_name}</Text>
          </View>
        </View>
        {renderCategory()}
        <View style={styles.viewBtn}>
          <TouchableOpacity style={styles.btnPlay} onPress={playAudio}>
            <IconSvg name="icHeadphone" size={20} color={palette.white} />
            <Text style={styles.txtListen}>
              {translations.podcast.listenNow}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.viewDes}>
          <Text style={CS.hnBold}>{translations.podcast.description}</Text>
          <TextViewCollapsed
            text={track?.content || ""}
            styleText={styles.des}
          />
        </View>

        <ListReviewView id={id} />
        <Button
          onPress={showWriteReview}
          text={translations.podcast.writeAReview}
          style={{ ...styles.btnReview, marginBottom: displayedTrack ? 60 : 8 }}
          type="primary"
        />
      </ScrollView>
      {!hide && (
        <View
          style={{
            height: getBottomSpace() + 60,
            width: SCREEN_WIDTH,
            position: "absolute",
            zIndex: 1,
            backgroundColor: palette.background,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default AudioPreview;

const styles = StyleSheet.create({
  btnReview: {
    marginTop: 8,
    height: 32,
    paddingVertical: 0,
    marginBottom: 8,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  viewDes: {
    marginTop: 8,
    marginBottom: 8,
  },
  des: {
    marginTop: 8,
    ...CS.hnRegular,
    color: palette.textOpacity8,
  },
  viewBtn: {
    width: "100%",
    ...CS.center,
    marginTop: 16,
  },
  btnPlay: {
    paddingVertical: 9,
    ...CS.row,
    gap: 8,
    backgroundColor: palette.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  txtListen: {
    ...CS.hnMedium,
    fontSize: 14,
    color: palette.white,
  },
  categoryContainer: {
    ...CS.row,
    gap: 8,
  },
  itemCategory: {
    ...CS.flex1,
    ...CS.center,
  },
  titleCategory: {
    ...CS.hnBold,
    fontSize: 20,
  },
  desCategory: {
    ...CS.hnRegular,
    color: palette.textOpacity8,
  },
  viewAudio: {
    ...CS.center,
    marginTop: 10,
    minHeight: (ScreenHeight * 411) / 812,
  },
  viewImage: {
    ...CS.center,
    height: HEIGHT_IMAGE,
    width: WIDTH_IMAGE,
  },
  viewTitle: {
    marginTop: 16,
    minHeight: (ScreenHeight * 84) / 812,
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
});
