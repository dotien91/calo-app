import React from "react";
import { FlatList, View } from "react-native";

// import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import { ICourseItem } from "models/course.model";
import { useListData } from "@helpers/hooks/useListData";
import CourseItem from "../components/course.item";
import { getCourseList } from "@services/api/course.api";
import LoadingItem from "@shared-components/loading.item";
import CourseCategoryTitle from "./course.category.title";

interface CourseCategoryItemProps {}

const CourseCategoryItem: React.FC<CourseCategoryItemProps> = () => {
  const { listData, isLoading, renderFooterComponent } =
    useListData<ICourseItem>({ limit: "5" }, getCourseList);

  const renderItem = (item: ICourseItem, index: number) => {
    return <CourseItem isSliderItem data={item.item} key={index} />;
  };
  // return null;
  return (
    <View>
      <CourseCategoryTitle title={"Recommend"} onPress={() => {}} />
      {isLoading && <LoadingItem />}
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={listData}
        horizontal={true}
        renderItem={renderItem}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingLeft: 16,
          paddingBottom: 16,
        }}
        onEndReachedThreshold={0}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        ListFooterComponent={renderFooterComponent()}
      />
    </View>
  );
};

export default React.memo(CourseCategoryItem);
