import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import PageScroll from "@shared-components/page-scroll/PageScroll";

import { getListReview } from "@services/api/course.api";
import { useListData } from "@helpers/hooks/useListData";
import { ICourseReview } from "models/course.model";
import { formatVNDate } from "@utils/date.utils";
import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import { palette } from "@theme/themes";
import StarRate from "@screens/course/components/star.rate";
import Avatar from "@shared-components/user/Avatar";
interface ListReviewCourseProps {
  _id: string;
  type: "full" | "top";
}

const ListReviewCourse = ({ _id, type }: ListReviewCourseProps) => {
  const { listData, isFirstLoading } = useListData<ICourseReview>(
    { limit: 8, course_id: _id },
    getListReview,
  );

  console.log("ls review....", listData);

  const _gotoFullReview = () => {};

  const ItemReview = ({ item }: { item: ICourseReview }) => {
    return (
      <View
        style={{
          marginRight: 28,
          width: WINDOW_WIDTH - 60,
          backgroundColor: palette.background2,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            sourceUri={{ uri: item.user_id.user_avatar_thumbnail }}
            style={{ width: 48, height: 48, borderRadius: 24 }}
          />
          <View style={{ marginLeft: 8, justifyContent: "space-between" }}>
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
        <Text style={styles.txtContentTitle}>{translations.course.rate}</Text>
        <View style={{ height: 200 }}>
          <PageScroll scrollEnabled={true} length={listData.slice(0, 3).length}>
            {listData.slice(0, 3).map((item: ICourseReview, index: number) => {
              return <ItemReview key={index} item={item} />;
            })}
          </PageScroll>
        </View>
        {listData.length > 0 && (
          <PressableBtn
            style={{
              backgroundColor: palette.background,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              ...CS.center,
              borderWidth: 1,
              borderColor: palette.primary,
              marginTop: 8,
            }}
            onPress={_gotoFullReview}
          >
            <Text style={styles.seeAll}>{translations.seeAll}</Text>
          </PressableBtn>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>ListReviewCourse</Text>

      {listData.map((item: ICourseReview, index: number) => {
        return <ItemReview key={index} item={item} />;
      })}
    </View>
  );
};

export default React.memo(ListReviewCourse);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  txtContentTitle: {
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
    ...CS.textCourse,
    lineHeight: 24,
  },
  seeAll: {
    ...CS.textCourse,
    color: palette.primary,
  },
});
