import React from "react";
import { SafeAreaView, Text, View, TouchableOpacity } from "react-native";
import {
  Calendar,
  CalendarTouchableOpacityProps,
  ICalendarEventBase,
  Mode,
} from "react-native-big-calendar";

import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { translations } from "@localization";
import Button from "@shared-components/button/Button";
import { palette } from "@theme/themes";

interface MyCustomEventType extends ICalendarEventBase {
  color: string;
}

const listevents = [
  {
    title: "Meeting",
    start: new Date("2024-06-05T03:24:00"),
    end: new Date("2024-06-05T04:24:00"),
    color: palette.primary,
  },
  {
    title: "Coffee break",
    start: new Date("2024-06-07T04:24:00"),
    end: new Date("2024-06-07T06:24:00"),
    color: palette.yellow,
  },
  {
    title: "Meeting",
    start: new Date("2024-06-04T03:24:00"),
    end: new Date("2024-06-04T04:24:00"),
    color: palette.primarySub,
  },
  {
    title: "Coffee break",
    start: new Date("2024-06-06T04:24:00"),
    end: new Date("2024-06-06T06:24:00"),
    color: palette.backgroundColorGrey,
  },
];
const TeacherCourse = () => {
  const [date, setDate] = React.useState(new Date());
  const [mode, setMode] = React.useState<Mode>("week");
  const [events, setEvents] = React.useState(listevents);

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
    alert(e);
  };

  const renderEvent = <T extends MyCustomEventType>(
    event: T,
    touchableOpacityProps: CalendarTouchableOpacityProps,
  ) => (
    <TouchableOpacity {...touchableOpacityProps}>
      <View
        style={{
          backgroundColor: event.color,
          width: "auto",
          height: 4,
          borderRadius: 2,
        }}
      />
      <Text style={[CS.hnRegular, { fontSize: 10 }]}>{`${event.title}`}</Text>
    </TouchableOpacity>
  );

  const renderCalendar = () => {
    return (
      <Calendar
        mode={mode}
        renderEvent={renderEvent}
        onPressCell={_onPressCell}
        activeDate={date}
        onPressDateHeader={(e) => setDate(e)}
        onPressEvent={(e) => alert(e.title)}
        events={events}
        eventCellStyle={{
          borderRadius: 10,
          backgroundColor: palette.secondColor,
          borderWidth: 1,
          borderColor: palette.borderColor,
        }}
        height={600}
      />
    );
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.course.manageClass} />
      <View style={CS.flexStart}>
        <Button isFullWidth={false} text="day" onPress={() => setMode("day")} />
        <Button
          isFullWidth={false}
          text="3day"
          onPress={() => setMode("3days")}
        />
        <Button
          isFullWidth={false}
          text="week"
          onPress={() => setMode("week")}
        />

        <Button
          isFullWidth={false}
          text="month"
          onPress={() => setMode("month")}
        />
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

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 16,
//   },
//   viewEmpty: {
//     minHeight: 200,
//     ...CS.center,
//   },
// });

export default TeacherCourse;
