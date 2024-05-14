import React from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";

import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { getMyCourse } from "@services/api/course.api";
import { useListData } from "@helpers/hooks/useListData";
import { ICourseItem } from "models/course.model";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import LoadingList from "@shared-components/loading.list.component";
import ClassItem from "./class.item";
import EmptyResultView from "@shared-components/empty.data.component";

const TeacherCourse = () => {
  const userData = useStore((state) => state.userData);

  const { listData, isLoading } = useListData<ICourseItem>(
    {
      created_user_id: userData?._id,
      order_by: "DESC",
      sort_by: "createdAt",
      public_status: "active",
    },
    getMyCourse,
  );

  const coursesHasClass = React.useMemo(() => {
    let data = [];
    listData.forEach((item) => {
      if (item?.classes?.length) {
        const currentClass = item.classes.map((_item) => ({
          courseData: item,
          ..._item,
          title: item.title,
          type: item.type,
        }));
        data = data.concat(currentClass);
      }
    });
    return data;
  }, [listData]);

  const renderItem = ({ item }) => {
    console.log("22222", item);
    return <ClassItem item={item} />;
  };
  const renderEmpty = () => {
    return (
      <EmptyResultView title={translations.notFound} style={styles.viewEmpty} />
    );
  };
  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.course.manageClass} />
      {isLoading && <LoadingList numberItem={2} />}
      {!isLoading && coursesHasClass.length == 0 && renderEmpty()}
      <FlatList
        contentContainerStyle={styles.container}
        data={coursesHasClass}
        renderItem={renderItem}
        onEndReachedThreshold={0}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item._id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  viewEmpty: {
    minHeight: 200,
    ...CS.center,
  },
});

export default TeacherCourse;
