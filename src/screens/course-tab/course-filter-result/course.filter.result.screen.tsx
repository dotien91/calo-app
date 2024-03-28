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
import ItemPost from "@screens/home/components/post-item/post.item";
import { getListUser } from "@services/api/user.api";
import UserItem from "../components/user.item";
import LoadingItem from "@shared-components/loading.item";
import LoadingList from "@shared-components/loading.list.component";

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
  const layout = useWindowDimensions();

  const courseCurrentType = useStore((state) => state.courseCurrentType);
  const setListCourseFilterParams = useStore(
    (state) => state.setListCourseFilterParams,
  );
  const listCourseFilterParams = useStore(
    (state) => state.listCourseFilterParams,
  );
  const setCourseCurrentSort = useStore((state) => state.setCourseCurrentSort);
  const route = useRoute();
  const defaultIndex =
    route.params?.["defaultIndex"] ||
    (courseCurrentType.id == EnumCourseType.course ? 0 : 1);
  const [index, setIndex] = React.useState(defaultIndex);
  const _index = React.useRef(index);
  const [routes] = React.useState([
    { key: "first", title: translations.listCategory.course },
    { key: "second", title: translations.listCategory.tutor },
    { key: "third", title: translations.post.posts },
    { key: "four", title: translations.affiliate.user },
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
    }
  }, [index]);

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
            ...CS.hnSemiBold,
            fontSize: 14,
            color: focused ? colors.primary : colors.text,
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

const ListSearch = ({ type }: { type: string }) => {
  const courseSearchHistory = useStore((state) => state.courseSearchHistory);

  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const courseCurrentSort = useStore((state) => state.courseCurrentSort);
  const listCourseFilterParams = useStore(
    (state) => state.listCourseFilterParams,
  );

  const setCourseCurrentSort = useStore((state) => state.setCourseCurrentSort);

  const paramRequest = React.useMemo(() => {
    return {
      ...courseCurrentSort,
      ...listCourseFilterParams,
      limit:
        type == EnumSearchType.tutor || type == EnumSearchType.user
          ? "10"
          : "5",
      // search: courseSearchHistory,
    };
  }, [courseCurrentSort, listCourseFilterParams, courseSearchHistory]);

  let requestData = getCourseList;
  if (type == EnumSearchType.tutor) requestData = getListTutor;
  if (type == EnumSearchType.post) requestData = getListPost;
  if (type == EnumSearchType.user) requestData = getListUser;

  const {
    noData,
    listData,
    isLoading,
    totalCount,
    onEndReach,
    renderFooterComponent,
  } = useListSearch<ICourseItem>(paramRequest, requestData, [], type);

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
          type == EnumSearchType.tutor
            ? translations.course.sortByTutor
            : translations.course.sortByTutor,
        callback: setCourseCurrentSort,
      },
    });
  }, [courseCurrentSort]);

  const renderItem = ({ item }: { item: ICourseItem }, index: number) => {
    if (type == EnumSearchType.post)
      return <ItemPost data={item} key={index} />;
    if (type == EnumSearchType.tutor)
      return <TutorItem {...item} key={index} />;
    if (type == EnumSearchType.user) return <UserItem {...item} key={index} />;
    return <CourseItem data={item} key={index} />;
  };

  const renderHeader = () => {
    if (isLoading || !listData.length) return null;
    return (
      <View style={styles.wrapSort}>
        <Text style={styles.txtCountResult}>
          {totalCount} {translations.results}
        </Text>
        {type !== EnumSearchType.user && type !== EnumSearchType.post && (
          <TouchableOpacity onPress={openSortModal} style={CS.flexEnd}>
            <Text style={CS.hnSemiBold}>{translations.sort_by_relevance} </Text>
            <IconBtn name="align-right" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderLoading = () => {
    if (!isLoading) return null;
    if (type == EnumSearchType.user || type == EnumSearchType.tutor) {
      return (
        <View style={{ marginTop: 10 }}>
          <LoadingList />
        </View>
      );
    }
    return (
      <View style={{ marginTop: 10 }}>
        <LoadingItem />
      </View>
    );
  };

  return (
    <View>
      {renderLoading()}
      {!listData?.length && !isLoading && noData && (
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
        keyExtractor={(item) => item?._id + "" || item?.last_active}
        ListFooterComponent={renderFooterComponent()}
      />
    </View>
  );
};

export default CourseFilterResultScreen;
