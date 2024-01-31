import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import FastImage from "react-native-fast-image";

// import * as NavigationService from "react-navigation-helpers";
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

interface CourseItemProps extends ICourseItem {
  isHorizontalStyle: boolean;
  isSliderItem: boolean;
}

const CourseItem = ({
  title,
  isSliderItem,
  price,
  rating,
  isHorizontalStyle,
  user_id,
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

  const renderInfo = () => {
    return (
      <>
        <Text style={styles.courseTitle}>{title}</Text>
        <Text style={styles.courseAuthorTxt}>{user_id?.display_name}</Text>
        <Text style={styles.coursePriceTxt}>{price || "Free"}</Text>
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
          uri: "https://unsplash.it/400/400?image=1",
          headers: { Authorization: "someAuthToken" },
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  };

  if (isHorizontalStyle)
    return (
      <View style={styles.courseItemHorizontal}>
        {renderImg()}
        <View style={[styles.boxContent, { flex: 1 }]}>{renderInfo()}</View>
      </View>
    );

  return (
    <View
      style={[
        styles.courseItem,
        isSliderItem && { padding: 0, width: widthImage, marginRight: 16 },
      ]}
    >
      {renderImg()}
      {renderInfo()}
    </View>
  );
};

export default React.memo(CourseItem);
