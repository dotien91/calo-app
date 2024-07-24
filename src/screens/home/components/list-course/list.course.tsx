import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import { SCREENS } from "constants";
import CourseItem from "@screens/course-tab/components/course.item";
import { useListData } from "@helpers/hooks/useListData";
import { ICourseItem } from "models/course.model";
import useStore from "@services/zustand/store";
import { getCourseSuggest } from "@services/api/course.api";
import CourseCategoryTitle from "@screens/course-tab/course-list/course.category.title";
import LoadingItem from "@shared-components/loading.item";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";

const CourseView = () => {
  const userData = useStore((state) => state.userData);
  const { listData, isLoading } = useListData<ICourseItem>(
    {
      auth_id: userData?._id,
      order_by: "DESC",
      sort_by: "createdAt",
      public_status: "active",
      types: ["Call group", "Self-learning"],
    },
    getCourseSuggest,
  );

  const data = React.useMemo(() => {
    return listData.slice(0, 10);
  }, [listData]);

  const snap = React.useMemo(() => {
    const prevCount = 1;
    const widthItem = SCREEN_WIDTH / (prevCount + 0.165);
    const startScroll = widthItem * 0.94;
    return data.map((x, i) => i * widthItem + startScroll);
  }, [listData]);

  const onSeeAll = () => {
    NavigationService.navigate(SCREENS.COURSE_RECOMMEND);
  };

  const renderItem = (item: ICourseItem, index: number) => {
    if (item.item?.is_join) {
      return null;
    } else {
      return (
        <>
          <CourseItem fromHome isSliderItem data={item.item} key={index} />
        </>
      );
    }
  };

  if (!listData.length && !isLoading) return null;

  // console.log(snap)
  return (
    <View style={styles.container}>
      <CourseCategoryTitle
        hideViewAll={false}
        title={translations.recommendCourse}
        onPress={onSeeAll}
      />
      {isLoading && <LoadingItem />}
      <FlatList
        pagingEnabled={true}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingLeft: 16,
          paddingBottom: 16,
        }}
        snapToOffsets={snap}
        initialNumToRender={2}
        onEndReachedThreshold={0}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item?._id + ""}
      />
    </View>
  );
};

export default React.memo(CourseView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
});
