import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

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
import { Calendar } from 'react-native-big-calendar'
import Button from "@shared-components/button/Button";
const currentData = (new Date()).getDate()
const plusDate = (number) => {
  new Date(currentData + number)
}
const events = [
  {
    title: 'Meeting',
    start: new Date('2024-06-03T03:24:00'),
    end:new Date('2024-06-03T04:24:00'),
  },
  {
    title: 'Coffee break',
    start: new Date('2024-06-04T04:24:00'),
    end: new Date('2024-06-04T06:24:00'),

  },
]
const TeacherCourse = () => {
  const userData = useStore((state) => state.userData);
  const [date, setDate] = React.useState(new Date())
  const [mode, setMode] = React.useState("week")

  // const { listData, isLoading } = useListData<ICourseItem>(
  //   {
  //     created_user_id: userData?._id,
  //     order_by: "DESC",
  //     sort_by: "createdAt",
  //     public_status: "active",
  //   },
  //   getMyCourse,
  // );
  // const coursesHasClass = React.useMemo(() => {
  //   let data = [];
  //   listData.forEach((item) => {
  //     if (item?.classes?.length) {
  //       const currentClass = item.classes.map((_item) => ({
  //         courseData: item,
  //         ..._item,
  //         title: item.title,
  //         type: item.type,
  //       }));
  //       data = data.concat(currentClass);
  //     }
  //   });

  //   return data;
  // }, [listData]);

  // const renderItem = ({ item }) => {
  //   return <ClassItem item={item} />;
  // };
  // const renderEmpty = () => {
  //   return (
  //     <EmptyResultView title={translations.notFound} style={styles.viewEmpty} />
  //   );
  // };

  const _onPressCell = (e) => {
    alert(e)
  }

  const renderCalendar = () => {
    return <Calendar mode={mode}  onPressCell={_onPressCell} activeDate={date} onPressDateHeader={(e)=> setDate(e)} onPressEvent={() => alert(3)} events={events} height={600} />
  }

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.course.manageClass} />
      <View style={CS.flexStart}>
        <Button isFullWidth={false} text="day" onPress={() => setMode("day")} />
        <Button isFullWidth={false} text="week" onPress={() => setMode("week")} />

        <Button isFullWidth={false} text="month" onPress={() => setMode("month")} />

      </View>
      {renderCalendar()}
      {/* {isLoading && <LoadingList numberItem={2} />}
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
      /> */}
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
