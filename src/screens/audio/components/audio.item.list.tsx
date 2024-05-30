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

interface ItemListProps {
  isSliderItem: boolean;
  style?: ViewStyle;
  data: IAudioItem;
  listData: any[];
}

const widthImage = 111;
const heightImage = 140;

const ItemList = ({ isSliderItem, style, data, listData }: ItemListProps) => {
  const { title, user_id, view_number, post_avatar, podcast_category, _id } =
    data;
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const setListAudio = useStore((state) => state.setListAudio);

  const renderInfo = () => {
    return (
      <View style={CS.flex1}>
        <Text numberOfLines={2} style={styles.audioTitle}>
          {title}
        </Text>
        <Text style={styles.audioAuthorTxt}>{user_id?.display_name}</Text>
        <Text style={styles.txtContent} numberOfLines={2}>
          {podcast_category?.category_content}
        </Text>
        {view_number ? (
          <Text style={styles.audioRatingTxt}>
            {`${formatNumber(view_number) + " " || ""}`}
            <Text style={styles.textNoReview}>{translations.audio.listen}</Text>
          </Text>
        ) : (
          <Text style={styles.textNoReview}>{translations.audio.noListen}</Text>
        )}
        <Text style={styles.txtSlug}>#{podcast_category?.category_title}</Text>
      </View>
    );
  };

  const renderImg = () => {
    return (
      <FastImage
        style={{
          ...styles.courseImg,
          width: widthImage,
          height: heightImage,
          marginBottom: 16,
        }}
        source={{
          uri: post_avatar?.media_url,
          headers: { Authorization: "someAuthToken" },
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  };

  const openPreviewCourse = () => {
    setListAudio(listData);
    NavigationService.navigate(SCREENS.AUDIO_PREVIEW, { id: _id });
  };

  return (
    <PressableBtn
      onPress={openPreviewCourse}
      style={[
        styles.audioItem1,
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
