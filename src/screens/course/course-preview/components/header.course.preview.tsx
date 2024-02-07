import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { ICourseItem } from "models/course.model";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import { formatPrice } from "@helpers/string.helper";
import { PlayVideo } from "@screens/course/detail-teacher/components/header.teacher.view";
import { formatVNDate } from "@utils/date.utils";
import StarRate from "@screens/course/components/star.rate.view";
import IconSvg from "assets/svg";
import { SCREENS } from "constants";
import { WindowWidth } from "@freakycoder/react-native-helpers";

interface HeaderCourseProps {
  data?: ICourseItem;
}

const HeaderCourse = ({ data }: HeaderCourseProps) => {
  const _playVideo = () => {};

  const _gotoDetailTeacher = () => {
    NavigationService.navigate(SCREENS.TEACHER_DETAIL, {
      idTeacher: data?.user_id?._id,
    });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          height: (WindowWidth / 16) * 9,
          ...CS.center,
          marginHorizontal: -16,
          // marginTop: 20,
        }}
      >
        <Image
          style={{
            height: (WindowWidth / 16) * 9,
            width: "100%",
            marginHorizontal: -16,
          }}
          source={{
            uri:
              data?.media_id?.media_thumbnail || data?.avatar?.media_thumbnail,
          }}
        />
        {data?.media_id?.media_thumbnail && <PlayVideo onPress={_playVideo} />}
        <View
          style={{
            position: "absolute",
            height: 60,
            backgroundColor: palette.black,
            opacity: 0.6,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            paddingLeft: 33,
            ...CS.center,
          }}
        >
          <Text style={{ ...CS.hnMedium, color: palette.white }}>
            {translations.course.previewThisCourse}
          </Text>
        </View>
      </View>
      <Text style={styles.textTitle}>{data?.title}</Text>
      <Text style={styles.textDescription}>{data?.description}</Text>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}
      >
        <StarRate number={data?.rating || 0} size={16} />
        {data?.rating > 0 && (
          <Text style={[styles.txtcount, { marginTop: 0, marginLeft: 4 }]}>
            {data?.rating.toFixed(2)}
          </Text>
        )}
      </View>
      <View>
        <Text
          style={styles.txtcount}
        >{`${data?.user_id.rating_count} ${translations.course.rate}/${data?.user_id.member_count} ${translations.course.student}`}</Text>
      </View>
      <Text style={styles.textCreateBy}>
        {translations.course.teacher}:{" "}
        <Text onPress={_gotoDetailTeacher} style={styles.textAuthor}>
          {data?.user_id?.display_name || ""}
        </Text>
      </Text>
      <View style={styles.viewUpdate}>
        <IconSvg name="icFormOfLearn" size={20} color={palette.textOpacity8} />
        <Text style={styles.txtUpdate}>
          {translations.course.formOfLearn}{" "}
          <Text style={styles.txtUpdateBold}>{data?.type}</Text>
        </Text>
      </View>

      <View style={styles.viewUpdate}>
        <IconSvg
          name="icWarningCircle"
          size={20}
          color={palette.textOpacity8}
        />
        <Text style={styles.txtUpdate}>{`${
          translations.course.lastUpdate
        } ${formatVNDate(data?.updatedAt)}`}</Text>
      </View>

      <View style={styles.viewUpdate}>
        <IconSvg name="icLanguage" size={20} color={palette.textOpacity8} />
        <Text style={styles.txtUpdate}>{data?.country}</Text>
      </View>

      <View style={styles.viewUpdate}>
        <IconSvg name="icCC" size={20} color={palette.textOpacity8} />
        <Text style={styles.txtUpdate}>{data?.language}</Text>
      </View>
      {data?.promotion == 0 ? (
        <View style={styles.viewPrice}>
          <Text style={styles.textPrice}>{formatPrice(data?.price)}</Text>
        </View>
      ) : (
        <View style={styles.viewPrice}>
          <Text style={styles.textPrice}>
            {formatPrice(data?.price - (data?.price * data?.promotion) / 100)}
          </Text>
          <Text style={styles.textPriceOld}>{formatPrice(data?.price)}</Text>
        </View>
      )}
      {data?.promotion && data.promotion > 0 ? (
        <View style={{ flexDirection: "row" }}>
          <IconSvg name="icClock" size={20} color={palette.textOpacity8} />
          <Text style={styles.textPrice}>{`discount: ${data.promotion}`}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default React.memo(HeaderCourse);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  textTitle: {
    ...CS.hnRegular,
    fontSize: 28,
    lineHeight: 32,
    marginTop: 16,
  },
  viewUpdate: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  txtcount: {
    ...CS.hnRegular,
    fontSize: 12,
    lineHeight: 16,
    textAlignVertical: "center",
    marginTop: 8,
  },
  textDescription: {
    ...CS.hnMedium,
    marginTop: 8,
    lineHeight: 24,
  },
  textCreateBy: {
    ...CS.hnMedium,
    color: palette.textOpacity8,
    marginTop: 8,
  },
  textAuthor: {
    color: palette.primary,
  },
  textPrice: {
    ...CS.hnSemiBold,
    fontSize: 18,
    color: palette.primary,
  },
  textPriceOld: {
    ...CS.hnSemiBold,
    fontSize: 18,
    color: palette.textOpacity6,
    textDecorationLine: "line-through",
    marginLeft: 20,
  },
  txtUpdate: {
    ...CS.hnMedium,
    fontSize: 14,
    lineHeight: 22,
    textAlignVertical: "center",
    marginLeft: 8,
    color: palette.textOpacity8,
  },
  txtUpdateBold: {
    ...CS.hnBold,
    fontSize: 14,
    lineHeight: 22,
    textAlignVertical: "center",
    marginLeft: 8,
    color: palette.textOpacity8,
  },
  viewPrice: {
    flexDirection: "row",
    marginTop: 20,
  },
});
