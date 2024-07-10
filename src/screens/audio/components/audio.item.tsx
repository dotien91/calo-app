import React, { useMemo } from "react";
import { Text, View, ViewStyle } from "react-native";
import FastImage from "react-native-fast-image";
import * as NavigationService from "react-navigation-helpers";
import { useTheme } from "@react-navigation/native";

import createStyles from "../audio.style";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import { Device } from "@utils/device.ui.utils";
import { IAudioItem } from "models/audio.modal";
import { SCREENS } from "constants";
import useStore from "@services/zustand/store";
import { formatNumber } from "react-native-currency-input";
import useUserHelper from "@helpers/hooks/useUserHelper";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import IconSvg from "assets/svg";

interface AudioItemProps {
  isSliderItem: boolean;
  isHorizontalStyle?: boolean;
  style?: ViewStyle;
  data: IAudioItem;
  listData: any;
}
const widthImage = Device.width / 3;

const heightImage = (widthImage / 114) * 140;

const AudioItem = ({
  isSliderItem,
  isHorizontalStyle,
  style,
  data,
  listData,
}: AudioItemProps) => {
  const {
    title,
    user_id,
    view_number,
    post_avatar,
    podcast_category,
    _id,
    subscription_id,
    is_premium,
  } = data;
  const setListAudio = useStore((state) => state.setListAudio);
  const { isActiveSubscription } = useUserHelper();

  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const renderInfo = () => {
    return (
      <>
        <Text numberOfLines={2} style={styles.audioTitle}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.audioAuthorTxt}>
          {user_id?.display_name}
        </Text>
        {view_number ? (
          <Text style={styles.audioRatingTxt}>
            {`${formatNumber(view_number) + " " || ""}`}
            {parseInt(formatNumber(view_number)) > 0 
            ? <Text style={styles.textNoReview}>{`${translations.audio.listen}s`}</Text>
            : <Text style={styles.textNoReview}>{translations.audio.listen}</Text>
            }
          </Text>
        ) : (
          <Text style={styles.textNoReview}>{translations.audio.noListen}</Text>
        )}
        <Text style={styles.txtSlug}>#{podcast_category?.category_title}</Text>
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
          uri: post_avatar?.media_thumbnail || post_avatar?.media_url,
          headers: { Authorization: "someAuthToken" },
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  };

  const openPreviewCourse = () => {
    console.log("subscription_id", subscription_id, isActiveSubscription);
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
    if (listData) {
      console.log("list...", listData);
      setListAudio(listData);
    }
    NavigationService.push(SCREENS.AUDIO_PREVIEW, { id: _id, data: data });
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
      <View>
        {renderImg()}
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
      {renderInfo()}
    </PressableBtn>
  );
};

export default React.memo(AudioItem);
