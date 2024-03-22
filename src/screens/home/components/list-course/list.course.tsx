import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import { SCREENS } from "constants";
import CourseItem from "@screens/course-tab/components/course.item";
import { useListData } from "@helpers/hooks/useListData";
import { ICourseItem } from "models/course.model";
import useStore from "@services/zustand/store";
import { getCourseList } from "@services/api/course.api";
import CourseCategoryTitle from "@screens/course-tab/course-list/course.category.title";

const CourseView = () => {
  const userData = useStore((state) => state.userData);
  const { listData } = useListData<ICourseItem>(
    {
      auth_id: userData?._id,
      order_by: "DESC",
      sort_by: "createdAt",
    },
    getCourseList,
  );

  const data = React.useMemo(() => {
    return listData.slice(0, 10);
  }, [listData]);

  const onSeeAll = () => {
    NavigationService.navigate(SCREENS.COURSE_LIST);
  };

  const renderItem = (item: ICourseItem, index: number) => {
    return (
      <>
        <CourseItem isSliderItem data={item.item} key={index} />
      </>
    );
  };

  if (!listData.length) return null;

  return (
    <View style={styles.container}>
      <CourseCategoryTitle
        hideViewAll={false}
        title={translations.recommendCourse}
        onPress={onSeeAll}
      />
      <FlatList
        horizontal
        data={data}
        renderItem={renderItem}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingLeft: 16,
          paddingBottom: 16,
        }}
        initialNumToRender={2}
        onEndReachedThreshold={0}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
      />
    </View>
  );
};

export default CourseView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
});
