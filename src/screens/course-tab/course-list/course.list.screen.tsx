import React, { useCallback, useEffect } from "react";
import {
  FlatList,
  View,
  // useWindowDimensions,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
// import { TabView, SceneMap } from "react-native-tab-view";
import * as NavigationService from "react-navigation-helpers";
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
import CourseToolbar from "../components/course.toolbar";
import CourseCategoryItem from "./course.category.item";
import CourseQuickFilter from "../components/course.quick.filter";
import { useUserHook } from "@helpers/hooks/useUserHook";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { useTheme, useFocusEffect } from "@react-navigation/native";
import { SCREENS } from "constants";
import LoadingItem from "@shared-components/loading.item";
import { palette } from "@theme/themes";
import eventEmitter from "@services/event-emitter";
import { translations } from "@localization";
import CS from "@theme/styles";
import EmptyResultView from "@shared-components/empty.data.component";
import CourseView from "@screens/home/components/list-course/list.course";

interface CourseListScreenProps {}

const CourseListScreen: React.FC<CourseListScreenProps> = () => {
  // const courseCurrentType = useStore((state) => state.courseCurrentType);
  // const layout = useWindowDimensions();
  const userData = useStore((state) => state.userData);
  const setCourseCurrentType = useStore((state) => state.setCourseCurrentType);
  // const [index, setIndex] = React.useState(0);
  // const [routes] = React.useState([{ key: "first" }, { key: "second" }]);

  useFocusEffect(
    // const newIndex = courseCurrentType.id != EnumCourseType.tutor ? 0 : 1;
    // if (newIndex == index) return;
    // setIndex(courseCurrentType.id != EnumCourseType.tutor ? 0 : 1);
    useCallback(() => {
      setCourseCurrentType({ id: EnumCourseType.course, name: "Course" });
    }, []),
  );

  // const renderTabBar = () => <View />;
  const { isLoggedIn } = useUserHook();
  const theme = useTheme();
  const { colors } = theme;
  return (
    <View style={{ flex: 1, paddingTop: getStatusBarHeight() }}>
      <CourseToolbar />
      {/* <TabView
        swipeEnabled={false}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      /> */}
      <ListCourse isTabCourse={true} />
      {isLoggedIn() &&
        (userData?.user_role === "teacher" ||
          userData?.user_role === "admin") && (
          <TouchableOpacity
            style={styles.btnAdd}
            onPress={() => NavigationService.push(SCREENS.COURSE_CREATE)}
          >
            <Icon
              name={"add-outline"}
              type={IconType.Ionicons}
              size={30}
              color={colors.white}
            />
          </TouchableOpacity>
        )}
    </View>
  );
};

export const ListCourse = React.memo(
  ({ isTabCourse }: { isTabCourse: boolean }) => {
    const {
      isLoading,
      listData,
      onEndReach,
      renderFooterComponent,
      _requestData,
    } = useListData<ICourseItem>(
      !isTabCourse
        ? { limit: "10", sort_by: "createdAt", order_by: "DESC" }
        : {
            limit: "10",
            sort_by: "createdAt",
            order_by: "DESC",
            public_status: "active",
            types: ["Call group", "Self-learning"],
          },
      !isTabCourse ? getListTutor : getCourseList,
    );
    const reloadListCourse = () => {
      _requestData(false);
    };

    useEffect(() => {
      eventEmitter.on("reload_list_course", reloadListCourse);
      return () => {
        eventEmitter.off("reload_list_course", reloadListCourse);
      };
    }, []);

    const renderItem = ({ item }: { item: ICourseItem }, index: number) => {
      if (isTabCourse) return <CourseItem data={item} key={index} />;
      return <TutorItem {...item} key={index} />;
    };

    const renderHeader = React.useCallback(() => {
      return (
        <View style={{ flex: 1 }}>
          {isTabCourse && <CourseCategoryItem />}
          <CourseQuickFilter isTabCourse={isTabCourse} />
          <CourseView />
          <Text
            style={{
              ...CS.txtTitle,
              paddingHorizontal: 18,
              marginBottom: 10,
            }}
          >
            {isTabCourse
              ? translations.course.allCourse
              : translations.course.allTutor}
          </Text>
        </View>
      );
    }, [isTabCourse]);

    const _renderEmptyComponent = React.useCallback(() => {
      if (!listData?.length && !isLoading)
        return <EmptyResultView desc={translations.emptyList} />;
      return null;
    }, [listData, isLoading]);

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={renderHeader}
          data={listData}
          renderItem={renderItem}
          onEndReachedThreshold={0}
          onEndReached={onEndReach}
          removeClippedSubviews={true}
          keyExtractor={(item) => item?._id + ""}
          ListFooterComponent={renderFooterComponent()}
          ListEmptyComponent={_renderEmptyComponent}
        />

        {isLoading && <LoadingItem numberItem={3} />}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  btnAdd: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: palette.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    bottom: 10,
    right: 10,
    zIndex: 1,
  },
});

export default CourseListScreen;
