import React, { useMemo } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
// import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import createStyles from "./course.list.style";
import { ICourseItem } from "models/course.model";
import { useListData } from "@helpers/hooks/useListData";
import CourseItem from "../components/course.item";
import { getCourseList } from "@services/api/course.api";
import LoadingList from "@shared-components/loading.list.component";
import EmptyResultView from "@shared-components/empty.data.component";
import { translations } from "@localization";

interface CourseListScreenProps {}

const CourseListScreen: React.FC<CourseListScreenProps> = () => {
  const theme = useTheme();
  // const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    listData,
    onEndReach,
    isFirstLoading,
    refreshControl,
    renderFooterComponent,
  } = useListData<ICourseItem>({ limit: 8 }, getCourseList);

  console.log("listDatalistData", listData);

  const renderItem = (item: ICourseItem, index: number) => {
    return <CourseItem {...item} key={index} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {isFirstLoading && <LoadingList />}
      {!listData?.length && !isFirstLoading && (
        <EmptyResultView
          title={translations.noNewMessageTittle}
          desc={translations.noNewMessageDesc}
          icon={"chatbubble-ellipses-outline"}
        />
      )}
      <FlatList
        data={listData}
        renderItem={renderItem}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listData}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
      />
    </SafeAreaView>
  );
};

export default CourseListScreen;
