import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import createStyles from "./course.component.style";
import { ICourseItem } from "models/course.model";
import { Device } from "@utils/device.ui.utils";
import CS from "@theme/styles";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { palette } from "@theme/themes";
import Badge from "./Badge";
import { SCREENS } from "constants";
import { numberWithCommas } from "@utils/string.utils";

interface CourseItemProps extends ICourseItem {
  isHorizontalStyle: boolean;
  isSliderItem: boolean;
}

const CourseItem = ({
  _id,
  title,
  isSliderItem,
  price,
  rating,
  isHorizontalStyle,
  user_id,
  media_id,
}: CourseItemProps) => {
  let widthImage = Device.width - 32;
  if (isHorizontalStyle) {
    widthImage = widthImage / 1.5;
  }
  if (isSliderItem) {
    widthImage = widthImage - 40;
  }
  const heightImage = widthImage / 2.4;
  const theme = useTheme();
  // const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const openPreviewCourse = () => {
    NavigationService.navigate(SCREENS.COURSE_DETAIL, { course_id: _id });
  };

  // const avatarUrl = () => {};

  const renderInfo = () => {
    return (
      <>
        <Text style={styles.courseTitle}>{title}</Text>
        <Text style={styles.courseAuthorTxt}>{user_id?.display_name}</Text>
        <Text style={styles.coursePriceTxt}>
          {price ? numberWithCommas(price) + "đ" : "Free"}
        </Text>
        <View style={[CS.flexStart, { marginBottom: 6 }]}>
          <Icon
            name="star"
            type={IconType.Feather}
            size={16}
            color={palette.gold}
            style={{ marginRight: 3 }}
          />
          <Text style={styles.courseRatingTxt}>{rating}</Text>
        </View>
        <Badge title="best-seller" />
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
        // source={{
        //   uri: media_thumbnail,
        // }}
        source={{
          uri: media_id?.media_thumbnail,
          headers: { Authorization: "someAuthToken" },
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  };

  if (isHorizontalStyle)
    return (
      <TouchableOpacity
        onPress={openPreviewCourse}
        style={styles.courseItemHorizontal}
      >
        {renderImg()}
        <View style={[styles.boxContent, { flex: 1 }]}>{renderInfo()}</View>
      </TouchableOpacity>
    );

  return (
    <TouchableOpacity
      onPress={openPreviewCourse}
      style={[
        styles.courseItem,
        isSliderItem && { padding: 0, width: widthImage, marginRight: 16 },
      ]}
    >
      {renderImg()}
      {renderInfo()}
    </TouchableOpacity>
  );
};

export default React.memo(CourseItem);
