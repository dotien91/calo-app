import React, { useMemo } from "react";
import { Text, View, ViewStyle } from "react-native";
import FastImage from "react-native-fast-image";
import * as NavigationService from "react-navigation-helpers";
import { useTheme } from "@react-navigation/native";

import CS from "@theme/styles";
import createStyles from "../audio.style";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import { Device } from "@utils/device.ui.utils";
import { IAudioItem } from "models/audio.modal";
import { SCREENS } from "constants";

interface AudioItemProps {
  isSliderItem: boolean;
  isHorizontalStyle?: boolean;
  style?: ViewStyle;
  data: IAudioItem;
}
const widthImage = Device.width / 3;

const heightImage = (widthImage / 114) * 140;

const AudioItem = ({
  isSliderItem,
  isHorizontalStyle,
  style,
  data,
}: AudioItemProps) => {
  const {
    title,
    user_id,
    view_number,
    post_avatar,
    podcast_category,
    is_join,
    _id,
  } = data;
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const renderInfo = () => {
    if (is_join)
      return (
        <>
          {/* <Text style={styles.audioTitle}>{title}</Text>
          <Text style={styles.audioAuthorTxt}>{user_id?.display_name}</Text>
          {isCourseVideo && (
            <CourseProgressBar
              dataFromApi={moduleViewedData}
              isSliderItem={isSliderItem}
              id={_id}
            />
          )} */}
        </>
      );

    return (
      <>
        <Text numberOfLines={2} style={styles.audioTitle}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.audioAuthorTxt}>
          {user_id?.display_name}
        </Text>
        {view_number ? (
          <View style={[CS.flexStart, { marginBottom: 6 }]}>
            <Text style={styles.audioRatingTxt}>
              {`${(view_number + "" || "").slice(0, 3)}`}
            </Text>
            <Text style={styles.textNoReview}>{translations.audio.listen}</Text>
          </View>
        ) : (
          <Text style={styles.textNoReview}>{translations.audio.noListen}</Text>
        )}
        <Text style={styles.txtSlug}>#{podcast_category?.category_slug}</Text>
      </>
    );
  };

  const renderImg = () => {
    return (
      <FastImage
        style={{
          ...styles.courseImg,
          width: widthImage / (isHorizontalStyle ? 2 : 1),
          height: heightImage / (isHorizontalStyle ? 1.2 : 1),
          marginBottom: 16,
        }}
        source={{
          uri: post_avatar?.media_thumbnail,
          headers: { Authorization: "someAuthToken" },
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  };

  const openPreviewCourse = () => {
    NavigationService.navigate(SCREENS.AUDIO_PREVIEW, { id: _id });
  };

  return (
    <PressableBtn
      onPress={openPreviewCourse}
      style={[
        styles.audioItem,
        isSliderItem && { padding: 0, width: widthImage, marginRight: 16 },
        style ? style : {},
      ]}
    >
      {renderImg()}
      {renderInfo()}
    </PressableBtn>
  );
};

export default React.memo(AudioItem);
