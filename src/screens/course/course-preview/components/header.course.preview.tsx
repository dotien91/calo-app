import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { ICourseItem } from "models/course.model";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import { formatPrice } from "@helpers/string.helper";
import { PlayVideo } from "@screens/course/detail-teacher/components/header.teacher.view";
import { formatFullDate, formatVNDate } from "@utils/date.utils";
import StarRate from "@screens/course/components/star.rate.view";
import IconSvg from "assets/svg";
import { SCREENS } from "constants";
import { WindowWidth } from "@freakycoder/react-native-helpers";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { formatLanguage } from "@utils/string.utils";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";

interface HeaderCourseProps {
  data?: ICourseItem;
}

const HeaderCourse = ({ data }: HeaderCourseProps) => {
  // const userData = useStore((state) => state.userData);
  // const isMine = React.useMemo(() => {
  //   return data?.user_id?._id == userData?._id;
  // }, [userData, data]);
  const _playVideo = () => {
    if (data?.media_id) {
      showSuperModal({
        contentModalType: EnumModalContentType.Library,
        styleModalType: EnumStyleModalType.Middle,
        data: {
          listMedia: [data?.media_id],
          index: 0,
        },
      });
    } else {
      if (data?.avatar) {
        showSuperModal({
          contentModalType: EnumModalContentType.Library,
          styleModalType: EnumStyleModalType.Middle,
          data: {
            listMedia: [data?.avatar],
            index: 0,
          },
        });
      }
    }
  };

  const _gotoDetailTeacher = () => {
    NavigationService.push(SCREENS.TEACHER_DETAIL, {
      _id: data?.user_id?._id,
    });
  };

  // const onReport = () => {
  //   showSuperModal({
  //     contentModalType: EnumModalContentType.Report,
  //     styleModalType: EnumStyleModalType.Bottom,
  //     data: {
  //       report_type: "course",
  //       partner_id: data?.avatar._id,
  //     },
  //   });
  // };

  // const viewClasses = () => {
  //   const classes = (data?.classes || []).map((_item) => ({
  //     courseData: data,
  //     ..._item,
  //     title: data?.title,
  //     type: data?.type,
  //   }));
  //   showSuperModal({
  //     contentModalType: EnumModalContentType.TeacherClass,
  //     styleModalType: EnumStyleModalType.Bottom,
  //     data: {
  //       listData: classes,
  //       hideCloseIcon: true,
  //     },
  //   });
  // };
  const isVideo =
    data?.media_id?.media_mime_type &&
    !data?.media_id?.media_mime_type.startsWith("image");

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
        <FastImage
          style={{
            height: (WindowWidth / 16) * 9,
            width: "100%",
            marginHorizontal: -16,
          }}
          source={{
            uri: data?.avatar?.media_thumbnail,
          }}
        />
        {isVideo && <PlayVideo onPress={_playVideo} />}
        {isVideo && (
          <LinearGradient
            colors={[
              palette.textOpacity0,
              palette.textOpacity24,
              palette.textOpacity5,
              palette.text,
            ]}
            style={{
              position: "absolute",
              height: 60,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1,
              paddingLeft: 0,
              ...CS.center,
            }}
          >
            <Text style={{ ...CS.hnMedium, color: palette.white }}>
              {translations.course.watchIntro}
            </Text>
          </LinearGradient>
        )}
        {!data?.media_id && (
          <Pressable
            onPress={_playVideo}
            style={{
              ...CS.fillParent,
              ...CS.center,
            }}
          ></Pressable>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.textTitle}>{data?.title}</Text>

        {/* {isMine && (
          <TouchableOpacity onPress={viewClasses}>
            <Icon
              name="more-vertical"
              type={IconType.Feather}
              size={25}
              color={palette.text}
            ></Icon>
          </TouchableOpacity>
        )} */}
      </View>
      {/* <TouchableOpacity style={CS.flexStart} onPress={onReport}>
        <Icon
          name="flag"
          type={IconType.Feather}
          size={18}
          color={palette.text}
          style={{ marginRight: 4 }}
        ></Icon>
        <TextBase fontSize={14}>{translations.report}</TextBase>
      </TouchableOpacity> */}
      {(data?.public_status === "draft" ||
        data?.public_status === "pending") && (
        <Text style={{ ...CS.hnRegular, fontSize: 12 }}>
          {data?.public_status !== "draft" ? `(${translations.course.public})`: `(${translations.course.draft})`}
        </Text>
      )}

      <Text style={styles.textDescription}>{data?.description}</Text>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}
      >
        {data?.rating > 0 ? (
          <StarRate number={data?.rating} size={16} />
        ) : (
          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: palette.textOpacity8,
            }}
          >
            {translations.course.noreview}
          </Text>
        )}
        {data?.rating > 0 && (
          <Text style={[styles.txtcount, { marginTop: 0, marginLeft: 4 }]}>
            {data?.rating.toFixed(2)}
          </Text>
        )}
      </View>
      <View>
        <Text style={styles.txtcount}>{`${data?.review_count || 0} ${
          translations.course.rate
        }/${data?.join_number || 0} ${
          translations.course[data?.join_number > 1 ? "students" : "student"]
        }`}</Text>
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

      {!!data?.lang && (
        <View style={styles.viewUpdate}>
          <IconSvg name="icLanguage" size={20} color={palette.textOpacity8} />
          <Text style={styles.txtUpdate}>{data.lang.toUpperCase()}</Text>
        </View>
      )}

      {!!data?.lang && (
        <View style={styles.viewUpdate}>
          <IconSvg name="icCC" size={20} color={palette.textOpacity8} />
          <Text style={styles.txtUpdate}>{formatLanguage(data.lang)}</Text>
        </View>
      )}
      {data?.coupon_id == null ||
      (data?.coupon_id?.availableAt &&
        new Date(data?.coupon_id?.availableAt) > new Date()) ||
      (data?.type === "Self-learning" || data?.type === "Call group" ? (
        <Text style={styles.textPrice}>{formatPrice(data?.price)}</Text>
      ) : (
        data?.coupon_id?.availableAt &&
        new Date(data?.coupon_id?.expired) < new Date()
      )) ? (
        <View>
          <Text style={styles.textPrice}>{formatPrice(data?.price)}</Text>
          {data?.coupon_id?.availableAt &&
            new Date(data?.coupon_id?.availableAt) > new Date() && (
              <Text
                style={[
                  styles.txtUpdate,
                  { color: palette.primary, marginLeft: 0 },
                ]}
              >
                <Text
                  style={{ ...CS.hnBold, fontSize: 14, color: palette.primary }}
                >
                  {translations.course.flashSale}
                </Text>
                {` ${translations.course.discountEntry.toLocaleLowerCase()} ${formatFullDate(
                  new Date(data?.coupon_id.availableAt),
                )}`}
              </Text>
            )}
        </View>
      ) : (
        <View>
          <View style={styles.viewPrice}>
            <Text style={styles.textPrice}>
              {data?.coupon_id?.promotion_type === "percentage"
                ? formatPrice(
                    data?.price -
                      (data?.price * data?.coupon_id?.promotion) / 100,
                  )
                : formatPrice(data?.price - data?.coupon_id?.promotion)}
            </Text>
            <Text style={styles.textPriceOld}>{formatPrice(data?.price)}</Text>
          </View>
          {data?.coupon_id?.expired &&
            new Date(data?.coupon_id?.expired) > new Date() && (
              <Text
                style={[
                  styles.txtUpdate,
                  { color: palette.primary, marginLeft: 0 },
                ]}
              >
                <Text
                  style={{ ...CS.hnBold, fontSize: 14, color: palette.primary }}
                >
                  {translations.course.flashSale}
                </Text>
                {` ${translations.course.endAt.toLocaleLowerCase()} ${formatFullDate(
                  new Date(data?.coupon_id.expired),
                )}`}
              </Text>
            )}
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
    minHeight: 32,
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
    minHeight: 16,
  },
  textDescription: {
    ...CS.hnMedium,
    marginTop: 8,
    lineHeight: 24,
    minHeight: 24,
  },
  textCreateBy: {
    ...CS.hnMedium,
    color: palette.textOpacity8,
    marginTop: 8,
    minHeight: 20,
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
    alignItems: "flex-end",
  },
});
