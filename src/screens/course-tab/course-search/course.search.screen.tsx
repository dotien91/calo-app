import React, { useState } from "react";
import {
  FlatList,
  useWindowDimensions,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
// import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
// import createStyles from "../course.style";
import { ICourseItem } from "models/course.model";
import CourseItem from "../components/course.item";
import { getCourseList, getListTutor } from "@services/api/course.api";
import LoadingList from "@shared-components/loading.list.component";
import EmptyResultView from "@shared-components/empty.data.component";
import { translations } from "@localization";
import SearchInput from "@shared-components/search-input.tsx/search.input";
import lotieNoResult from "assets/lotties/no-result.json";
import CS from "@theme/styles";
import { useListSearch } from "@helpers/hooks/useListSearch";
import { SCREENS } from "constants";
import TutorItem from "../components/tutor.item";
import { getListPost } from "@services/api/post";
import { TypedPost } from "shared/models";
import ItemPost from "@screens/post/components/post-item/post.detail.item";

interface CourseSearchScreenProps {}

const CourseSearchScreen: React.FC<CourseSearchScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const [txtSearch, setTxtSearch] = useState("");

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Course" },
    { key: "second", title: "Teacher" },
    { key: "third", title: "Post" },
  ]);

  const renderTabBar = (props) => (
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
      style={{ backgroundColor: colors.background }}
    />
  );

  const FirstRoute = React.useCallback(
    () => <ListSearch txtSearch={txtSearch} />,
    [txtSearch],
  );
  const SecondRoute = React.useCallback(
    () => <ListSearch txtSearch={txtSearch} isTeacherTab />,
    [txtSearch],
  );

  const ThirdRoute = React.useCallback(
    () => <ListPost txtSearch={txtSearch} />,
    [txtSearch],
  );

  const renderScene2 = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  const _onSubmitEditing = (v) => {
    NavigationService.navigate(SCREENS.COURSE_CATEGORY, {
      defaultParams: { search: v, title: "Kết quả cho từ khoá: " + v },
    });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SearchInput
        onSubmitEditing={_onSubmitEditing}
        showBackBtn={true}
        setTxtSearch={setTxtSearch}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene2}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};

const ListSearch = React.memo(({ txtSearch, isTeacherTab }) => {
  console.log("txtSearchtxtSearch", txtSearch);
  const { listData, isLoading, onEndReach, renderFooterComponent } =
    useListSearch<ICourseItem>(
      isTeacherTab
        ? { limit: "5", search: txtSearch, headerTitle: txtSearch }
        : {
            limit: "5",
            search: txtSearch,
            headerTitle: txtSearch,
            public_status: "active",
          },
      isTeacherTab ? getListTutor : getCourseList,
      [],
    );

  const renderItem = (item: ICourseItem, index: number) => {
    if (isTeacherTab) return <TutorItem {...item.item} key={index} />;
    return <CourseItem data={item.item} key={index} />;
  };

  return (
    <View style={{ flex: 1, paddingTop: 16 }}>
      {isLoading && <LoadingList numberItem={3} />}
      {!listData?.length && !isLoading && (
        <EmptyResultView
          title={translations.noResult}
          lottieJson={lotieNoResult}
        />
      )}
      <FlatList
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

const ListPost = React.memo(({ txtSearch }) => {
  console.log("txtSearchtxtSearch", txtSearch);
  const { listData, isLoading, onEndReach, renderFooterComponent } =
    useListSearch<TypedPost>(
      { limit: "5", search: txtSearch },
      getListPost,
      [],
    );

  const renderItem = ({ item }: { item: TypedPost }, index: number) => {
    return <ItemPost data={item} key={index} />;
  };

  return (
    <View style={{ flex: 1, paddingTop: 16 }}>
      {isLoading && <LoadingList />}
      {!listData?.length && !isLoading && (
        <EmptyResultView
          title={translations.noResult}
          lottieJson={lotieNoResult}
        />
      )}
      <FlatList
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

// const ListUser = React.memo(({ txtSearch }) => {
//   console.log("txtSearchtxtSearch", txtSearch);
//   const { listData, isLoading, onEndReach, renderFooterComponent } =
//     useListSearch<TypedPost>(
//       { limit: "5", search: txtSearch },
//       getListPost,
//       [],
//     );

//   const renderItem = ({ item }: { item: TypedPost }, index: number) => {
//     return <ItemPost data={item} key={index} />;
//   };

//   return (
//     <View style={{ flex: 1, paddingTop: 16 }}>
//       {isLoading && <LoadingList />}
//       {!listData?.length && !isLoading && (
//         <EmptyResultView
//           title={translations.noResult}
//           lottieJson={lotieNoResult}
//         />
//       )}
//       <FlatList
//         data={listData}
//         renderItem={renderItem}
//         onEndReachedThreshold={0}
//         onEndReached={onEndReach}
//         removeClippedSubviews={true}
//         keyExtractor={(item) => item?._id + ""}
//         ListFooterComponent={renderFooterComponent()}
//       />
//     </View>
//   );
// });
export default CourseSearchScreen;
