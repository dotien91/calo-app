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
import useStore from "@services/zustand/store";
import { formatNumber } from "react-native-currency-input";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import TrackPlayer, { Track } from "react-native-track-player";
import eventEmitter from "@services/event-emitter";
import TextBase from "@shared-components/TextBase";
import useUserHelper from "@helpers/hooks/useUserHelper";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { GetPodCastDetailv2 } from "@services/api/podcast.api";

interface ItemListProps {
  isSliderItem: boolean;
  style?: ViewStyle;
  data: IAudioItem;
  listData?: any[];
  colorText?: string;
  styleInfo?: ViewStyle;
  isParent?: boolean;
}
const widthImage = 111;
const heightImage = 140;

const ItemList = ({
  isSliderItem,
  style,
  data,
  listData,
  styleInfo,
  colorText,
  isParent,
}: ItemListProps) => {
  const {
    title,
    user_id,
    view_number,
    post_avatar,
    podcast_category,
    _id,
    content,
    // subscription_id,
    is_premium,
  } = data;
  const addAudio = useStore((store) => store.addAudio);
  const listAudioHistory = useStore((store) => store.listAudioHistory);
  const listAudioWatched = useStore((store) => store.listAudioWatched);

  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const setListAudio = useStore((state) => state.setListAudio);
  const { isActiveSubscription } = useUserHelper();

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
    if (is_premium && !isActiveSubscription) {
      showSuperModal({
        styleModalType: EnumStyleModalType.Middle,
        contentModalType: EnumModalContentType.SubscriptionView,
      });
      return;
    }
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
    GetPodCastDetailv2(_id);
  };

  const isWatched = useMemo(
    () => listAudioWatched.filter((item) => item.id === _id),
    [listAudioWatched, _id],
  );

  const renderInfo = () => {
    return (
      <View style={[styles.viewInfo, styleInfo]}>
        <Text
          numberOfLines={2}
          style={[styles.audioTitle, colorText ? { color: colorText } : {}]}
        >
          {title}
        </Text>
        <Text
          style={[styles.audioAuthorTxt, colorText ? { color: colorText } : {}]}
        >
          {user_id?.display_name}
        </Text>
        <Text
          style={[styles.txtContent, colorText ? { color: colorText } : {}]}
          numberOfLines={2}
        >
          {content}
        </Text>
        {view_number ? (
          <Text
            style={[
              styles.audioRatingTxt,
              colorText ? { color: colorText } : {},
            ]}
          >
            {`${formatNumber(view_number) + " " || ""}`}
            {parseInt(formatNumber(view_number)) > 1 ? (
              <Text style={styles.textNoReview}>
                {translations.audio.listens}
              </Text>
            ) : (
              <Text style={styles.textNoReview}>
                {translations.audio.listen}
              </Text>
            )}
          </Text>
        ) : (
          <Text
            style={[styles.textNoReview, colorText ? { color: colorText } : {}]}
          >
            {translations.audio.noListen}
          </Text>
        )}
        <View style={styles.viewHastag}>
          {data?.attach_files.length > 0 && (
            <PressableBtn
              style={[
                styles.btnPlay,
                // borderColorPlay ? { borderColor: borderColorPlay } : {},
                isParent ? { backgroundColor: palette.white } : {},
              ]}
              onPress={playAudio}
            >
              <View style={styles.viewIconPlay}>
                <IconSvg name="icPlay" color={palette.white} size={8} />
              </View>
              <Text style={[styles.txtPlay]}>{translations.audio.play}</Text>
            </PressableBtn>
          )}
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
            // marginBottom: 16,
          }}
          source={{
            uri: post_avatar?.media_thumbnail || post_avatar?.media_url,
            headers: { Authorization: "someAuthToken" },
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        {isWatched.length > 0 && (
          <View style={styles.viewIsWatched}>
            <TextBase fontSize={12} fontWeight="600" color={"white"}>
              {translations.audio.listened}
            </TextBase>
          </View>
        )}
        {is_premium && (
          <IconSvg
            name="icKing"
            size={24}
            style={{
              position: "absolute",
              top: 4,
              left: 4,
              zIndex: 1000,
            }}
          />
        )}
      </View>
    );
  };

  const openPreviewCourse = () => {
    if (is_premium && !isActiveSubscription) {
      showSuperModal({
        styleModalType: EnumStyleModalType.Bottom,
        contentModalType: EnumModalContentType.SubscriptionView,
        data: {
          hideCloseIcon: true,
        },
      });
      return;
    }
    setListAudio(listData);
    NavigationService.push(SCREENS.AUDIO_PREVIEW, { id: _id, data: data });
  };

  return (
    <PressableBtn
      onPress={openPreviewCourse}
      style={[
        styles.audioItem1,
        { marginVertical: 4, marginBottom: 16 },
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
