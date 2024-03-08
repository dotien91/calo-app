import React from "react";
import { FlatList, SafeAreaView } from "react-native";

import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { getMyCourse } from "@services/api/course.api";
import { useListData } from "@helpers/hooks/useListData";
import { ICourseItem } from "models/course.model";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import LoadingList from "@shared-components/loading.list.component";
import ClassItem from "./class.item";

const TeacherCourse = () => {
  const userData = useStore((state) => state.userData);

  const { listData, isLoading } = useListData<ICourseItem>(
    { created_user_id: userData?._id, order_by: "DESC", sort_by: "createdAt" },
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
    return <ClassItem item={item} />;
  };

  return (
    <SafeAreaView style={CS.flex1}>
      <Header text={translations.settingUser.mycouse} />
      {isLoading && <LoadingList numberItem={2} />}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16 }}
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

export default TeacherCourse;
