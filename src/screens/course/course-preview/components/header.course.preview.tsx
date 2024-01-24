import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";

import { ICourseItem } from "models/course.model";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import { formatPrice } from "@helpers/string.helper";
import { PlayVideo } from "@screens/course/detail-teacher/components/header.teacher.view";
import { formatVNDate } from "@utils/date.utils";
import StarRate from "@screens/course/components/star.rate";
import IconSvg from "assets/svg";

interface HeaderCourseProps {
  data?: ICourseItem;
}

const HeaderCourse = ({ data }: HeaderCourseProps) => {
  const _playVideo = () => {};

  const _gotoDetailTeacher = () => {};

  return (
    <View style={styles.container}>
      <View
        style={{
          height: 256,
          backgroundColor: "red",
          borderRadius: 10,
          ...CS.center,
        }}
      >
        <Image
          style={{ height: 256, width: "100%", borderRadius: 10 }}
          source={{ uri: data?.media_id.media_thumbnail }}
        />
        <PlayVideo onPress={_playVideo} />
      </View>
      <Text style={styles.textTitle}>{data?.title}</Text>
      <Text style={styles.textDescription}>{data?.description}</Text>
      <StarRate number={2.4} size={16} />
      <Text style={styles.textCreateBy}>
        {translations.course.teacher}:{" "}
        <Text onPress={_gotoDetailTeacher} style={styles.textAuthor}>
          {data?.user_id?.display_name || ""}
        </Text>
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <IconSvg name="icFormOfLearn" size={20} color={palette.textOpacity8} />
        <Text style={styles.txtUpdate}>{`${translations.course.formOfLearn} ${
          data?.formOfLearn || ""
        }`}</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <IconSvg
          name="icWarningCircle"
          size={20}
          color={palette.textOpacity8}
        />
        <Text style={styles.txtUpdate}>{`${
          translations.course.lastUpdate
        } ${formatVNDate(data?.updatedAt)}`}</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <IconSvg name="icLanguage" size={20} color={palette.textOpacity8} />
        <Text style={styles.txtUpdate}></Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <IconSvg name="icCC" size={20} color={palette.textOpacity8} />
        <Text style={styles.txtUpdate}>{data?.language}</Text>
      </View>
      {data?.promotion !== 0 ? (
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.textPrice}>{formatPrice(data?.price)}</Text>
        </View>
      ) : (
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.textPrice}>
            {formatPrice((data?.price * 80) / 100)}
          </Text>
          <Text style={styles.textPriceOld}>{formatPrice(data?.price)}</Text>
        </View>
      )}
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
  textDescription: {
    ...CS.textOpacity8,
    lineHeight: 24,
  },
  textCreateBy: {
    ...CS.hnMedium,
    color: palette.textOpacity8,
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
    marginLeft: 8,
    color: palette.textOpacity8,
  },
});
