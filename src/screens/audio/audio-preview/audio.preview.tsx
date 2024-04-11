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

import { ScreenHeight } from "@freakycoder/react-native-helpers";
import { translations } from "@localization";
import TextViewCollapsed from "@screens/course/components/text.view.collapsed";
import { GetPodCastDetail } from "@services/api/podcast.api";
import useStore from "@services/zustand/store";
import Header from "@shared-components/header/Header";
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

const AudioPreview = () => {
  const [track, setTrack] = React.useState<TypeTrackLocal>();
  const addAudio = useStore((store) => store.addAudio);
  const listAudioHistory = useStore((store) => store.listAudioHistory);
  const id = "661395c7d29bd7cb5f9bca4c";

  const getDataTrack = () => {
    GetPodCastDetail(id).then((res) => {
      console.log("resDetail....", res);
      if (!res.isError) {
        setTrack(res.data);
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
        <ItemCategory title={" "} des={translations.podcast.audio} />
        <ItemCategory
          title={track?.country || " "}
          des={translations.podcast.language}
        />
      </View>
    );
  };

  const playTrack = async (track: Track) => {
    const item = listAudioHistory.filter((item) => item.url === track.url);
    if (item.length > 0) {
      await TrackPlayer.seekBy(item[0].position || 0);
    }
    await TrackPlayer.play();
  };

  const playAudio = async () => {
    await TrackPlayer.reset();
    const track1 = {
      url: track?.attach_files[0].media_url,
      title: track?.title,
      artist: track?.user_id.display_name,
      artwork: track?.post_avatar.media_url,
    };
    await TrackPlayer.add(track1);
    await playTrack(track1);
    addAudio(track1);
    NavigationService.navigate(SCREENS.AUDIO_PLAY);

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

  const showAllReview = () => {
    NavigationService.navigate(SCREENS.SHOW_ALL_REVIEW);
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
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

        <View style={styles.viewReview}>
          <Text style={CS.hnBold}>{`${translations.podcast.countReview(
            track?.comment_number || 0,
          )}`}</Text>
        </View>
        <ListReviewView id={id} />

        <TouchableOpacity onPress={showAllReview} style={styles.viewShowAll}>
          <Text style={styles.txtShowAll}>
            {translations.podcast.showAllReview}
          </Text>
        </TouchableOpacity>
        <Button
          onPress={showWriteReview}
          text={translations.podcast.writeAReview}
          style={styles.btnReview}
          type="primary"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AudioPreview;

const styles = StyleSheet.create({
  btnReview: {
    marginTop: 8,
    height: 32,
    paddingVertical: 0,
  },
  txtShowAll: {
    ...CS.hnBold,
    color: palette.primary,
  },
  container: {
    ...CS.flex1,
    paddingHorizontal: 16,
  },
  viewShowAll: {
    marginTop: 8,
    ...CS.center,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.primary,
  },
  viewReview: {
    marginTop: 8,
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
