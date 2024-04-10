import React, { useMemo } from "react";
import { Text, View, ViewStyle } from "react-native";
import FastImage from "react-native-fast-image";

import CS from "@theme/styles";
import createStyles from "../audio.style";
import { useTheme } from "@react-navigation/native";
import { translations } from "@localization";
import { Device } from "@utils/device.ui.utils";
import { IAudioItem } from "models/audio.modal";
import PressableBtn from "@shared-components/button/PressableBtn";

interface ItemListProps {
  isSliderItem: boolean;
  style?: ViewStyle;
  data: IAudioItem;
}

const widthImage = 111;
const heightImage = 140;

const ItemList = ({ isSliderItem, style, data }: ItemListProps) => {
  const { title, user_id, view_number, post_avatar, podcast_category } = data;
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderInfo = () => {
    return (
      <View style={{ marginBottom: 10 }}>
        <Text numberOfLines={2} style={styles.audioTitle}>
          {title}
        </Text>
        <Text style={styles.audioAuthorTxt}>{user_id?.display_name}</Text>
        <Text style={styles.txtContent} numberOfLines={2}>
          {podcast_category?.category_content}
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
          uri: post_avatar?.media_thumbnail,
          headers: { Authorization: "someAuthToken" },
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  };

  const openPreviewCourse = () => {
    console.log("444444=========");
  };

  return (
    <PressableBtn
      onPress={openPreviewCourse}
      style={[
        styles.audioItem1,
        isSliderItem && {
          padding: 0,
          width: Device.width - 170,
          marginRight: 16,
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
