import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import TrackPlayer, { Track } from "react-native-track-player";
import * as NavigationService from "react-navigation-helpers";
import Sound from "react-native-sound";

import { ScreenHeight } from "@freakycoder/react-native-helpers";
import { translations } from "@localization";
import TextViewCollapsed from "@screens/course/components/text.view.collapsed";
import { GetPodCastDetail } from "@services/api/podcast.api";
import useStore from "@services/zustand/store";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import { SCREENS } from "constants";
import { TypeTrackLocal } from "models/audio.modal";
import ListReviewView from "./list.review";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import Button from "@shared-components/button/Button";
import { useRoute } from "@react-navigation/native";
import { formatTimeDuration } from "@utils/date.utils";
import LoadingList from "@shared-components/loading.list.component";
import Header from "../components/Header";
import { shareAudio } from "@utils/share.utils";

const AudioPreview = () => {
  const [track, setTrack] = React.useState<TypeTrackLocal>();
  const addAudio = useStore((store) => store.addAudio);
  const listAudioHistory = useStore((store) => store.listAudioHistory);
  const listAudio = useStore((store) => store.listAudio);
  const route = useRoute();
  const id = route?.params?.id || "";
  const [duration, setDuration] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  const getDataTrack = () => {
    GetPodCastDetail(id).then((res) => {
      if (!res.isError) {
        console.log(res);
        setTrack(res.data);
        const whoosh = new Sound(
          res.data?.attach_files[0].media_url,
          "",
          (error) => {
            if (error) {
              console.log("failed to load the sound", error);
              setIsLoading(false);
            } else {
              setDuration(Math.floor(whoosh.getDuration() || 0));
              setIsLoading(false);
            }
          },
        );
      }
    });
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
          title={formatTimeDuration(duration) || " "}
          des={translations.podcast.audio}
        />
        <ItemCategory
          title={track?.country || " "}
          des={translations.podcast.language}
        />
      </View>
    );
  };

  const playTrack = async (track: Track, indexLocal: number) => {
    const item = listAudioHistory.filter((item) => item.url === track.url);
    if (item.length > 0) {
      await TrackPlayer.skip(indexLocal);
      await TrackPlayer.seekBy(item[0].position || 0);
    }
    await TrackPlayer.play();
  };

  const playAudio = async () => {
    await TrackPlayer.reset();
    const indexLocal = listAudio.findIndex((item) => item._id === track?._id);
    if (indexLocal >= 0) {
      // const list = listAudio.slice(indexLocal, listAudio.length);
      for (let i = 0; i < listAudio.length; i++) {
        const element = listAudio[i];
        const track1 = {
          url: element?.attach_files[0].media_url,
          title: element?.title,
          artist: element?.user_id.display_name,
          artwork: element?.post_avatar.media_url,
        };
        await TrackPlayer.add(track1);
        if (i == indexLocal) {
          await playTrack(track1, indexLocal);
        }
      }
      NavigationService.navigate(SCREENS.AUDIO_PLAY);
    }
    const track2 = {
      url: track?.attach_files[0].media_url,
      title: track?.title,
      artist: track?.user_id.display_name,
      artwork: track?.post_avatar.media_url,
    };
    addAudio(track2);

    // await TrackPlayer.seekBy(0);
  };

  const showWriteReview = () => {
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
    shareAudio("https://ikigai.vn");
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header onPressRight={onPressShare} iconNameRight="share-2" />
      {isLoading ? (
        <LoadingList numberItem={3} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          <View style={styles.viewAudio}>
            <View style={styles.viewImage}>
              <Image
                style={styles.viewImage}
                source={{ uri: track?.post_avatar.media_url }}
                borderRadius={8}
              />
            </View>
            <View style={styles.viewTitle}>
              <Text style={styles.txtTitle}>{track?.title}</Text>
              <Text style={styles.txtAuthor}>
                {track?.user_id.display_name}
              </Text>
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
            style={styles.btnReview}
            type="primary"
          />
        </ScrollView>
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
    ...CS.flex1,
    paddingHorizontal: 16,
  },
  viewDes: {
    marginTop: 8,
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
});
