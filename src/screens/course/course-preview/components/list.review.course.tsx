import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { getListReview } from "@services/api/course.api";
import { useListData } from "@helpers/hooks/useListData";
import { ICourseItem, ICourseReview } from "models/course.model";
import { formatVNDate } from "@utils/date.utils";
import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import { palette } from "@theme/themes";
import StarRate from "@screens/course/components/star.rate.view";
import Avatar from "@shared-components/user/Avatar";
import IconSvg from "assets/svg";
import { SCREENS } from "constants";
import eventEmitter from "@services/event-emitter";
import useStore from "@services/zustand/store";
import { ScrollView } from "react-native-gesture-handler";
interface ListReviewCourseProps {
  _id: string;
  type: "full" | "top";
  data?: ICourseItem;
}

const ListReviewCourse = ({ _id, type, data }: ListReviewCourseProps) => {
  const userData = useStore((stote) => stote.userData);
  const {
    listData,
    isFirstLoading,
    totalCount,
    _requestData,
    onEndReach,
    refreshControl,
    renderFooterComponent,
  } = useListData<ICourseReview>({ limit: 50, course_id: _id }, getListReview);

  const [reviewOfMe, setReviewOfMe] = useState<ICourseReview>();

  const _getReviewOfMe = () => {
    const param = {
      course_id: _id,
      user_id: userData?._id,
    };
    getListReview(param).then((res) => {
      if (!res.isError) {
        if (res.data.length == 1) {
          setReviewOfMe(res.data[0]);
        }
      }
    });
  };

  useEffect(() => {
    _getReviewOfMe();
  }, []);

  const onRefresh = () => {
    _requestData(false);
    _getReviewOfMe();
  };

  const _gotoFullReview = () => {
    NavigationService.navigate(SCREENS.COURSE_LIST_RATE, { courseId: _id });
  };
  const _gotoScreenReview = () => {
    NavigationService.navigate(SCREENS.COURSE_RATE, { courseId: _id });
  };

  useEffect(() => {
    eventEmitter.on("reload_data_preview", onRefresh);
    return () => {
      eventEmitter.off("reload_data_preview", onRefresh);
    };
  }, []);
  const _gotoEditReview = () => {
    NavigationService.navigate(SCREENS.COURSE_RATE, { item: reviewOfMe });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: ICourseReview;
    index: number;
  }) => {
    return <ItemReview key={index} item={item} isFull={type === "full"} />;
  };

  const ItemReview = ({
    item,
    isFull,
  }: {
    item: ICourseReview;
    isFull?: boolean;
  }) => {
    return (
      <View
        style={[
          styles.viewItemReview,
          {
            width: isFull ? WINDOW_WIDTH - 32 : WINDOW_WIDTH - 90,
            marginBottom: 8,
          },
          isFull && {
            marginLeft: 1,
            marginRight: 1,
          },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            sourceUri={{ uri: item.user_id.user_avatar_thumbnail }}
            style={{ width: 48, height: 48, borderRadius: 24 }}
          />
          <View
            style={{ flex: 1, marginLeft: 8, justifyContent: "space-between" }}
          >
            <Text style={styles.nameReview}>{item.user_id.display_name}</Text>
            <Text style={styles.txtDetail}>{formatVNDate(item.updatedAt)}</Text>
          </View>
        </View>

        <View style={{ marginVertical: 12 }}>
          <StarRate number={item.rating} size={16} />
        </View>
        <Text style={styles.txtDetail}>{item.review}</Text>
      </View>
    );
  };

  if (isFirstLoading) {
    return null;
  }

  if (type === "top") {
    return (
      <View style={styles.container}>
        <Text style={styles.txtContentTitle}>{translations.course.rate}</Text>
        <View
          style={[CS.flex1, { flexDirection: "row", gap: 8, marginTop: 12 }]}
        >
          <View style={styles.viewCountReview}>
            <View style={CS.flex1}>
              <Text style={styles.txtContentTitle}>{totalCount}</Text>
              <Text style={styles.txtDetail}>
                {translations.course.reviews}
              </Text>
            </View>
            <IconSvg size={24} name="icReviewComment" color={palette.text} />
          </View>
          <View style={styles.viewCountReview}>
            <View style={CS.flex1}>
              <Text style={styles.txtContentTitle}>
                {data?.rating.toFixed(2)}
              </Text>
              <Text style={styles.txtDetail}>{translations.course.rate}</Text>
            </View>
            <IconSvg size={24} name="icStar" color={palette.text} />
          </View>
        </View>
        {listData.length > 0 && (
          <View
            style={{
              height: 200,
              paddingVertical: 4,
              marginVertical: 4,
              // backgroundColor: "red",
            }}
          >
            <ScrollView
              horizontal
              scrollEnabled={true}
              showsHorizontalScrollIndicator={false}
            >
              {listData
                .slice(0, 3)
                .map((item: ICourseReview, index: number) => {
                  return <ItemReview key={index} item={item} />;
                })}
            </ScrollView>
          </View>
        )}
        {data?.is_join && !reviewOfMe ? (
          <PressableBtn style={styles.styleBtn} onPress={_gotoScreenReview}>
            <Text style={styles.seeAll}>{translations.course.rate}</Text>
          </PressableBtn>
        ) : null}
        {data?.is_join && reviewOfMe ? (
          <PressableBtn style={styles.styleBtn} onPress={_gotoEditReview}>
            <Text style={styles.seeAll}>
              {translations.course.updateReview}
            </Text>
          </PressableBtn>
        ) : null}
        {listData.length > 0 && (
          <PressableBtn style={styles.styleBtn} onPress={_gotoFullReview}>
            <Text style={styles.seeAll}>{translations.seeAll}</Text>
          </PressableBtn>
        )}
      </View>
    );
  }

  return (
    <View style={styles.containerFull}>
      <Text style={styles.txtContentTitleFull}>
        {translations.course.rate} , {totalCount}
      </Text>
      <FlatList
        data={listData}
        renderItem={renderItem}
        scrollEventThrottle={16}
        // contentContainerStyle={styles.viewCountReviewFull}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        // keyExtractor={(item) => item?._id + ""}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
      />
    </View>
  );
};

export default React.memo(ListReviewCourse);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    flex: 1,
  },
  viewItemReview: {
    marginRight: 8,
    backgroundColor: palette.background,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowOffset: { width: 1, height: 6 },
    shadowOpacity: 0.1,
    elevation: 1,
    shadowRadius: 4,
    shadowColor: "rgba(0,0,0,0.9)",
  },
  containerFull: {
    marginHorizontal: 16,
    marginTop: 8,
    flex: 1,
  },
  viewCountReview: {
    ...CS.flex1,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: palette.background2,
    borderRadius: 8,
  },
  txtContentTitle: {
    ...CS.hnSemiBold,
    fontSize: 24,
    lineHeight: 32,
  },
  txtContentTitleFull: {
    ...CS.hnSemiBold,
    fontSize: 24,
    lineHeight: 32,
  },
  txtDetail: {
    ...CS.hnRegular,
    fontSize: 14,
    lineHeight: 22,
    color: palette.textOpacity8,
  },
  nameReview: {
    ...CS.hnSemiBold,
    lineHeight: 24,
  },
  seeAll: {
    ...CS.hnSemiBold,
    color: palette.primary,
  },
  styleBtn: {
    backgroundColor: palette.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    ...CS.center,
    borderWidth: 1,
    borderColor: palette.primary,
    marginTop: 8,
  },
});
