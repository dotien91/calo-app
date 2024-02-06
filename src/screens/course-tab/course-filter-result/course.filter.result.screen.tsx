import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, useRoute } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
// import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import createStyles from "../course.style";
import {
  EnumCourseType,
  EnumSearchType,
  ICourseItem,
} from "models/course.model";
import CourseItem from "../components/course.item";
import { getCourseList, getListTutor } from "@services/api/course.api";
import LoadingList from "@shared-components/loading.list.component";
import EmptyResultView from "@shared-components/empty.data.component";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import CS from "@theme/styles";
import IconBtn from "@shared-components/button/IconBtn";
import {
  sortCourseSelectData,
  sortTutorSelectData,
} from "constants/course.constant";
import { useListSearch } from "@helpers/hooks/useListSearch";
import lotieNoResult from "assets/lotties/no-result.json";

import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { countNumberFilter } from "../course.helper";
import TutorItem from "../components/tutor.item";
import SearchInputWithFilter from "@shared-components/search-input-with-filter.tsx/search.input.with.filter";
import { getListPost } from "@services/api/post";
import ItemPost from "@screens/post/components/post-item/post.detail.item";
import { getListUser } from "@services/api/user.api";
import UserItem from "../components/user.item";

const FirstRoute = () => <ListSearch type={EnumSearchType.course} />;
const SecondRoute = () => <ListSearch type={EnumSearchType.tutor} />;
const ThirdRoute = () => <ListSearch type={EnumSearchType.post} />;
const FourRoute = () => <ListSearch type={EnumSearchType.user} />;

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
  four: FourRoute,
});

interface CourseFilterResultScreenProps {}

const CourseFilterResultScreen: React.FC<
  CourseFilterResultScreenProps
> = () => {
  const theme = useTheme();
  const { colors } = theme;
  // const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute();
  const defaultParams = route.params?.["defaultParams"] || {};
  const layout = useWindowDimensions();

  const courseCurrentType = useStore((state) => state.courseCurrentType);
  const setListCourseFilterParams = useStore(
    (state) => state.setListCourseFilterParams,
  );
  const listCourseFilterParams = useStore(
    (state) => state.listCourseFilterParams,
  );
  const setCourseCurrentSort = useStore((state) => state.setCourseCurrentSort);

  const defaultIndex = courseCurrentType.id == EnumCourseType.course ? 0 : 1;
  const [index, setIndex] = React.useState(defaultIndex);
  const _index = React.useRef(index);
  const [routes] = React.useState([
    { key: "first", title: "Course" },
    { key: "second", title: "Teacher" },
    { key: "third", title: "Post" },
    { key: "four", title: "User" },
  ]);

  //clear params after unmount
  React.useEffect(() => {
    return () => {
      setCourseCurrentSort({});
      setListCourseFilterParams({});
    };
  }, []);

  //reset params after change tab
  React.useEffect(() => {
    if (index != _index.current) {
      _index.current = index;
      setListCourseFilterParams(defaultParams);
    }
  }, [index]);

  React.useEffect(() => {
    const params = { ...defaultParams };
    delete params.title;
  }, [defaultParams]);

  const countFilters = useMemo(
    () => countNumberFilter(listCourseFilterParams),
    [listCourseFilterParams],
  );

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.primary,
      }}
      renderLabel={({ route, focused }) => (
        <Text
          style={{
            ...CS.hnBold,
            fontSize: 16,
            color: focused ? colors.primary : colors.text,
            margin: 8,
          }}
        >
          {route.title}
        </Text>
      )}
      style={{
        backgroundColor: colors.background,
        shadowColor: "rgba(0,0,0,0.8)",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        elevation: 1,
        shadowRadius: 5,
        marginBottom: 4,
      }}
    />
  );

  const openFilterCourseModal = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.FilterListCourse,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        courseType: index == 0 ? EnumCourseType.course : EnumCourseType.tutor,
        params: defaultParams,
      },
    });
  };

  const _onSubmitEditing = () => {};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SearchInputWithFilter
        onSubmitEditing={_onSubmitEditing}
        showBackBtn={true}
        // setTxtSearch={setTxtSearch}
        onPressFilter={openFilterCourseModal}
        showFilter={index == 0 || index == 1}
        badge={countFilters}
      />

      {/* </Header> */}
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </SafeAreaView>
  );
};

const ListSearch = React.memo(({ type }: { type: string }) => {
  const route = useRoute();
  const defaultParams = route.params?.["defaultParams"] || {};
  const courseSearchHistory = useStore((state) => state.courseSearchHistory);

  const theme = useTheme();
  // const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const courseCurrentSort = useStore((state) => state.courseCurrentSort);
  const listCourseFilterParams = useStore(
    (state) => state.listCourseFilterParams,
  );

  const setCourseCurrentSort = useStore((state) => state.setCourseCurrentSort);

  const paramRequest = React.useMemo(() => {
    return {
      ...courseCurrentSort,
      ...defaultParams,
      ...listCourseFilterParams,
      limit: "5",
      search: courseSearchHistory,
    };
  }, [courseCurrentSort, listCourseFilterParams, courseSearchHistory]);

  let requestData = getCourseList;
  if (type == EnumSearchType.tutor) requestData = getListTutor;
  if (type == EnumSearchType.post) requestData = getListPost;
  if (type == EnumSearchType.user) requestData = getListUser;

  const { listData, isLoading, totalCount, onEndReach, renderFooterComponent } =
    useListSearch<ICourseItem>(paramRequest, requestData);

  const openSortModal = useCallback(() => {
    showSuperModal({
      contentModalType: EnumModalContentType.FilterTypeCourse,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        options:
          type == EnumSearchType.tutor
            ? sortTutorSelectData
            : sortCourseSelectData,
        defaultItem: courseCurrentSort,
        title:
          type == EnumSearchType.tutor ? "Sort tutor by" : "Sort course by",
        callback: setCourseCurrentSort,
      },
    });
  }, [courseCurrentSort]);

  if (type == EnumSearchType.post) {
    console.log("listDatalistDatalistData", { courseSearchHistory, listData });
  }

  const renderItem = ({ item }: { item: ICourseItem }, index: number) => {
    if (type == EnumSearchType.post)
      return <ItemPost data={item} key={index} />;
    if (type == EnumSearchType.tutor)
      return <TutorItem {...item} key={index} />;
    if (type == EnumSearchType.user) return <UserItem {...item} key={index} />;
    return <CourseItem {...item} key={index} />;
  };

  const renderHeader = () => {
    if (isLoading || !listData.length) return null;
    return (
      <View style={styles.wrapSort}>
        <Text style={styles.txtCountResult}>
          {totalCount} {translations.results}
        </Text>
        {type !== EnumSearchType.user && (
          <TouchableOpacity onPress={openSortModal} style={CS.flexEnd}>
            <Text style={CS.hnSemiBold}>{translations.sort_by_relevance} </Text>
            <IconBtn name="align-right" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View>
      {isLoading && <LoadingList numberItem={3} />}
      {!listData?.length && !isLoading && (
        <EmptyResultView
          title={translations.noResult}
          lottieJson={lotieNoResult}
        />
      )}
      {renderHeader()}
      <FlatList
        contentContainerStyle={{ paddingBottom: 32 }}
        data={listData}
        renderItem={renderItem}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        ListFooterComponent={renderFooterComponent()}
      />
    </View>
  );
});

export default CourseFilterResultScreen;
