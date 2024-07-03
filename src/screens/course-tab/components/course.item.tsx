import React, { useMemo } from "react";
import { View, Text, ViewStyle, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import createStyles from "./course.component.style";
import { EnumClassType, ICourseItem } from "models/course.model";
import { Device } from "@utils/device.ui.utils";
import CS from "@theme/styles";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { palette } from "@theme/themes";
import Badge from "./Badge";
import { SCREENS } from "constants";
import { translations } from "@localization";
import CourseProgressBar from "./course.progress.bar";
import PressableBtn from "@shared-components/button/PressableBtn";
import { formatPriceCourse } from "@helpers/string.helper";
import { listSkill } from "constants/course.constant";
import useStore from "@services/zustand/store";
import { shareCourse } from "@utils/share.utils";
import IconSvg from "assets/svg";

interface CourseItemProps {
  isHorizontalStyle?: boolean;
  isSliderItem?: boolean;
  style?: ViewStyle;
  data: ICourseItem;
  fromHome?: boolean;
}

const CourseItem = ({
  isSliderItem,
  isHorizontalStyle,
  style,
  data,
  fromHome
}: CourseItemProps) => {
  const {
    _id,
    title,
    rating,
    user_id,
    // media_id,
    avatar,
    is_join,
    type,
    skills,
    public_status,
  } = data;
  const userData = useStore((state) => state.userData);
  let widthImage = fromHome ? Device.width - 20 : Device.width - 32;
  if (isHorizontalStyle) {
    widthImage = widthImage / 1.5;
  }
  if (isSliderItem) {
    widthImage = widthImage - 40;
  }
  const heightImage = widthImage / 1.7777;
  const theme = useTheme();
  // const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const isCourseVideo = EnumClassType.SelfLearning == type;
  const openPreviewCourse = () => {
    if (is_join && data.type == EnumClassType.SelfLearning) {
      NavigationService.navigate(SCREENS.COURSE_LEARN_VIDEO_SCREEN, {
        course_id: _id,
        courseData: data,
      });
      return;
    }
    NavigationService.navigate(SCREENS.COURSE_DETAIL, {
      course_id: _id,
      dataCourse: data,
    });
  };
  const priceCourse = formatPriceCourse(data);

  const moduleViewedData = {
    module_child_count: data?.module_child_count,
    module_view_count: data?.module_view?.length,
  };

  // const avatarUrl = () => {};

  const renderInfo = () => {
    if (is_join)
      return (
        <>
          <View style={isSliderItem ? { height: 50 } : {}}>
            <Text numberOfLines={2} style={styles.courseTitle}>
              {title}
            </Text>
          </View>
          <Text style={styles.courseAuthorTxt}>{user_id?.display_name}</Text>
          {isCourseVideo && (
            <CourseProgressBar
              dataFromApi={moduleViewedData}
              isSliderItem={isSliderItem}
              id={_id}
            />
          )}
        </>
      );

    return (
      <>
        <View style={isSliderItem ? { height: 50 } : {}}>
          <Text numberOfLines={2} style={styles.courseTitle}>
            {title}
          </Text>
        </View>
        <Text style={styles.courseAuthorTxt}>{user_id?.display_name}</Text>
        <View style={styles.viewPrice}>
          <Text style={styles.coursePriceTxt}>
            {priceCourse.newPrice || priceCourse.oldPrice}
          </Text>
          {priceCourse.newPrice != "" && (
            <Text
              style={
                priceCourse.newPrice == ""
                  ? styles.coursePriceTxt
                  : styles.coursePriceTxtOld
              }
            >
              {priceCourse.oldPrice}
            </Text>
          )}
        </View>
        {rating ? (
          <View style={[CS.flexStart, { height: 30 }]}>
            <Icon
              name="star"
              type={IconType.Ionicons}
              size={16}
              color={palette.gold}
              style={{ marginRight: 3 }}
            />
            <Text style={styles.courseRatingTxt}>
              {`${(rating + "" || "").slice(0, 3)}`}
            </Text>
          </View>
        ) : (
          <View style={[CS.flexStart, { height: 30 }]}>
            <Text style={styles.textNoReview}>
              {translations.course.noreview}
            </Text>
          </View>
        )}
        <View style={{ marginTop: 6, flexDirection: "row", gap: 8 }}>
          <Badge title="Best-seller" />
          {public_status !== "active" && <Badge title={public_status} />}
          {skills.map((item, index) => {
            const txt = listSkill.filter((i) => i.id === item);
            return <Badge key={index} title={txt?.[0]?.value} />;
          })}
        </View>
        <View
          style={{
            flexDirection: "row",
            height: 40,
            justifyContent: "space-between",
            gap: 16,
            marginTop: 8,
          }}
        >
          <TouchableOpacity
            style={
            fromHome ?{
              width: widthImage,
              backgroundColor: palette.yellow20,
              ...CS.center,
              borderRadius: 8,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }: {
              flex: 1,
              backgroundColor: palette.yellow20,
              ...CS.center,
              borderRadius: 8,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
            onPress={() => shareCourse(userData?.invitation_code, data.title)}
          >
            <IconSvg name="icDollar" size={16} />
            <Text style={CS.hnSemiBold}>
              {`${translations.affiliate.commission}: ${priceCourse.commition}`}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={openPreviewCourse}
            style={{
              backgroundColor: palette.primary,
              ...CS.center,
              borderRadius: 8,
              paddingHorizontal: 16,
            }}
          >
            <Text style={[CS.hnBold, { color: palette.white }]}>
              {translations.course.buyNow}
            </Text>
          </TouchableOpacity> */}
        </View>
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
          uri: avatar?.media_thumbnail || avatar?.media_url,
          headers: { Authorization: "someAuthToken" },
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  };

  if (isHorizontalStyle)
    return (
      <PressableBtn
        onPress={openPreviewCourse}
        style={styles.courseItemHorizontal}
      >
        {renderImg()}
        <View style={[styles.boxContent, { flex: 1 }]}>{renderInfo()}</View>
      </PressableBtn>
    );

  return (
    <PressableBtn
      onPress={openPreviewCourse}
      style={[
        styles.courseItem,
        isSliderItem && !fromHome && { padding: 0, width: widthImage, marginRight: 16 },
        style ? style : {},
      ]}
    >
      {renderImg()}
      {renderInfo()}
    </PressableBtn>
  );
};

export default React.memo(CourseItem);
