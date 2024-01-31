import React, { useEffect } from "react";
import { FlatList, View, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
// import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import { EnumCourseType, ICourseItem } from "models/course.model";
import { useListData } from "@helpers/hooks/useListData";
import CourseItem from "../components/course.item";
import { getCourseList, getListTutor } from "@services/api/course.api";
import useStore from "@services/zustand/store";
import TutorItem from "../components/tutor.item";
import { getStatusBarHeight } from "react-native-safearea-height";
import LoadingList from "@shared-components/loading.list.component";
import CourseToolbar from "../components/course.toolbar";
import CourseCategoryItem from "./course.category.item";
import CourseQuickFilter from "../components/course.quick.filter";
interface CourseListScreenProps {}

const renderScene = SceneMap({
  first: () => <ListCourse isTabCourse={true} />,
  second: () => <ListCourse isTabCourse={false} />,
});

const CourseListScreen: React.FC<CourseListScreenProps> = () => {
  const courseCurrentType = useStore((state) => state.courseCurrentType);
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([{ key: "first" }, { key: "second" }]);

  useEffect(() => {
    const newIndex = courseCurrentType.id != EnumCourseType.tutor ? 0 : 1;
    if (newIndex == index) return;
    setIndex(courseCurrentType.id != EnumCourseType.tutor ? 0 : 1);
  }, [courseCurrentType, index]);

  const renderTabBar = () => <View />;

  return (
    <View style={{ flex: 1, paddingTop: getStatusBarHeight() }}>
      <CourseToolbar />
      <TabView
        swipeEnabled={false}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
};

const ListCourse = React.memo(({ isTabCourse }: { isTabCourse: boolean }) => {
  const { isLoading, listData, onEndReach, renderFooterComponent } =
    useListData<ICourseItem>(
      { limit: "4" },
      !isTabCourse ? getListTutor : getCourseList,
    );

  const renderItem = ({ item }: { item: ICourseItem }, index: number) => {
    if (isTabCourse) return <CourseItem {...item} key={index} />;
    return <TutorItem {...item} key={index} />;
  };

  const renderHeader = React.useMemo(() => {
    return (
      <>
        {isTabCourse && <CourseCategoryItem />}
        <CourseQuickFilter isTabCourse={isTabCourse} />
      </>
    );
  }, [isTabCourse]);

  return (
    <>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={listData}
        renderItem={renderItem}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        ListFooterComponent={renderFooterComponent()}
      />
      {isLoading && <LoadingList />}
    </>
  );
});

export default CourseListScreen;
