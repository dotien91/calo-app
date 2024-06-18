import React, { useMemo } from "react";
import { Text, View, ViewStyle } from "react-native";
import FastImage from "react-native-fast-image";
import * as NavigationService from "react-navigation-helpers";

import createStyles from "../audio.style";
import { useTheme } from "@react-navigation/native";
import { translations } from "@localization";
import { Device } from "@utils/device.ui.utils";
import { IAudioItem } from "models/audio.modal";
import PressableBtn from "@shared-components/button/PressableBtn";
import { SCREENS } from "constants";
import CS from "@theme/styles";
import useStore from "@services/zustand/store";
import { formatNumber } from "react-native-currency-input";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import TrackPlayer, { Track } from "react-native-track-player";
import eventEmitter from "@services/event-emitter";
import TextBase from "@shared-components/TextBase";

interface ItemListProps {
  isSliderItem: boolean;
  style?: ViewStyle;
  data: IAudioItem;
  listData: any[];
}
const widthImage = 111;
const heightImage = 140;

const ItemList = ({ isSliderItem, style, data, listData }: ItemListProps) => {
  const {
    title,
    user_id,
    view_number,
    post_avatar,
    podcast_category,
    _id,
    content,
  } = data;
  const addAudio = useStore((store) => store.addAudio);
  const listAudioHistory = useStore((store) => store.listAudioHistory);
  const listAudioWatched = useStore((store) => store.listAudioWatched);

  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const setListAudio = useStore((state) => state.setListAudio);
  const playTrack = async (track: Track) => {
    const item = listAudioHistory.filter((item) => item.url === track.url);
    // await TrackPlayer.skip(indexLocal);
    if (item.length > 0) {
      await TrackPlayer.seekBy(item[0].position || 0);
    }
    await TrackPlayer.play();
  };
  const playAudio = async () => {
    // NavigationService.navigate(SCREENS.AUDIO_PLAY);
    eventEmitter.emit("floating_play", { show: true });
    await TrackPlayer.reset();
    const track = {
      url: data?.attach_files[0].media_url,
      title: data?.title,
      artist: data?.user_id.display_name,
      artwork: data?.post_avatar.media_url,
      id: data?._id,
    };
    await TrackPlayer.add(track);
    await playTrack(track);
    addAudio(track);
  };

  const isWatched = useMemo(
    () => listAudioWatched.includes(_id),
    [listAudioWatched],
  );

  const renderInfo = () => {
    return (
      <View style={CS.flex1}>
        <Text numberOfLines={2} style={styles.audioTitle}>
          {title}
        </Text>
        <Text style={styles.audioAuthorTxt}>{user_id?.display_name}</Text>
        <Text style={styles.txtContent} numberOfLines={2}>
          {content}
        </Text>
        {view_number ? (
          <Text style={styles.audioRatingTxt}>
            {`${formatNumber(view_number) + " " || ""}`}
            <Text style={styles.textNoReview}>{translations.audio.listen}</Text>
          </Text>
        ) : (
          <Text style={styles.textNoReview}>{translations.audio.noListen}</Text>
        )}
        <View style={styles.viewHastag}>
          <PressableBtn style={styles.btnPlay} onPress={playAudio}>
            <View style={styles.viewIconPlay}>
              <IconSvg name="icPlay" color={palette.white} size={8} />
            </View>
            <Text style={styles.txtPlay}>{translations.audio.play}</Text>
          </PressableBtn>
          <Text style={styles.txtSlug}>
            #{podcast_category?.category_title}
          </Text>
        </View>
      </View>
    );
  };
  const renderImg = () => {
    return (
      <View>
        <FastImage
          style={{
            ...styles.courseImg,
            width: widthImage,
            height: heightImage,
            marginBottom: 16,
          }}
          source={{
            uri: post_avatar?.media_thumbnail || post_avatar?.media_url,
            headers: { Authorization: "someAuthToken" },
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        {isWatched && (
          <View style={styles.viewIsWatched}>
            <TextBase fontSize={13} fontWeight="600" color={"white"}>
              {translations.audio.listened}
            </TextBase>
          </View>
        )}
      </View>
    );
  };

  const openPreviewCourse = () => {
    setListAudio(listData);
    NavigationService.navigate(SCREENS.AUDIO_PREVIEW, { id: _id, data: data });
  };

  return (
    <PressableBtn
      onPress={openPreviewCourse}
      style={[
        styles.audioItem1,
        { marginVertical: 4 },
        isSliderItem && {
          padding: 0,
          width: Device.width - 32,
          // marginRight: 16,
        },
        style ? style : {},
      ]}
    >
      <View style={styles.viewItem}>
        {renderImg()}
        {renderInfo()}
      </View>
    </PressableBtn>
  );
};

export default React.memo(ItemList);
