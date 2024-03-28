import * as React from "react";
import { View, FlatList } from "react-native";

import { useListData } from "@helpers/hooks/useListData";
import { translations } from "@localization";
import CourseItem from "@screens/course-tab/components/course.item";
import { getCourseSuggest } from "@services/api/course.api";
import useStore from "@services/zustand/store";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { ICourseItem } from "models/course.model";

const CourseRecommendScreen = () => {
  const userData = useStore((state) => state.userData);
  const { listData, renderFooterComponent, onEndReach } =
    useListData<ICourseItem>(
      {
        auth_id: userData?._id,
        order_by: "DESC",
        sort_by: "createdAt",
        limit: "5",
      },
      getCourseSuggest,
    );

  const renderItem = ({ item, index }) => {
    return <CourseItem data={item} key={index} />;
  };
  return (
    <View style={CS.safeAreaView}>
      <Header text={translations.recommendCourse} />
      <FlatList
        style={CS.flex1}
        showsHorizontalScrollIndicator={false}
        data={listData}
        renderItem={renderItem}
        scrollEventThrottle={16}
        initialNumToRender={2}
        onEndReachedThreshold={0}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item?._id + ""}
        ListFooterComponent={renderFooterComponent()}
        onEndReached={onEndReach}
      />
    </View>
  );
};

export default CourseRecommendScreen;
