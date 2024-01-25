import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import PageScroll from "@shared-components/page-scroll/PageScroll";
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
  } = useListData<ICourseReview>({ limit: 8, course_id: _id }, getListReview);

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
    // console.log("index", index, item);
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
        style={{
          marginRight: 28,
          width: isFull ? WINDOW_WIDTH - 32 : WINDOW_WIDTH - 60,
          backgroundColor: palette.background2,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginBottom: isFull ? 8 : 0,
        }}
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
            <Text>{formatVNDate(item.updatedAt)}</Text>
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
        <Text style={styles.txtContentTitle}>{translations.course.rate},</Text>
        <View style={[CS.flex1, { flexDirection: "row", gap: 8 }]}>
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
            <IconSvg size={24} name="icStarFull" color={palette.text} />
          </View>
        </View>
        <View style={{ height: 200, marginTop: 8 }}>
          <PageScroll scrollEnabled={true} length={listData.slice(0, 3).length}>
            {listData.slice(0, 3).map((item: ICourseReview, index: number) => {
              return <ItemReview key={index} item={item} />;
            })}
          </PageScroll>
        </View>
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
    ...CS.hnBold,
    fontSize: 24,
    lineHeight: 32,
  },
  txtContentTitleFull: {
    ...CS.hnBold,
    fontSize: 24,
    lineHeight: 32,
  },
  txtDetail: {
    ...CS.hnRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  nameReview: {
    ...CS.hnBold,
    lineHeight: 24,
  },
  seeAll: {
    ...CS.textCourse,
    color: palette.primary,
  },
  styleBtn: {
    backgroundColor: palette.background,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...CS.center,
    borderWidth: 1,
    borderColor: palette.primary,
    marginTop: 8,
  },
});
