import { translations } from "@localization";
import { getPlanStudent, getPlanTeacher } from "@services/api/course.api";
import ImageLoad from "@shared-components/image-load/ImageLoad";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { formatCalendarDateTime, formatDate } from "@utils/date.utils";
import { EnumClassType } from "models/course.model";
import React, { useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import {
  Agenda,
  DateData,
  AgendaEntry,
  AgendaSchedule,
} from "react-native-calendars";
import ModalCalendar from "./ModalCalendar";
import Header from "@shared-components/header/Header";
import DetailEvent from "./detail.event";
import SelectTypeCalendar from "./select.type.calendar";
import { styles } from "./styles";

const testIDs = {
  menu: {
    CONTAINER: "menu",
    CALENDARS: "calendars_btn",
    CALENDAR_LIST: "calendar_list_btn",
    HORIZONTAL_LIST: "horizontal_list_btn",
    AGENDA: "agenda_btn",
    EXPANDABLE_CALENDAR: "expandable_calendar_btn",
    WEEK_CALENDAR: "week_calendar_btn",
    TIMELINE_CALENDAR: "timeline_calendar_btn",
    PLAYGROUND: "playground_btn",
  },
  calendars: {
    CONTAINER: "calendars",
    FIRST: "first_calendar",
    LAST: "last_calendar",
  },
  calendarList: { CONTAINER: "calendarList" },
  horizontalList: { CONTAINER: "horizontalList" },
  agenda: {
    CONTAINER: "agenda",
    ITEM: "item",
  },
  expandableCalendar: { CONTAINER: "expandableCalendar" },
  weekCalendar: { CONTAINER: "weekCalendar" },
};
const AgendaScreen = () => {
  const [items, setItems] = React.useState([]);
  const [rawData, setRawData] = React.useState<any>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [eventTeacher, setEventTeacher] = useState<any>([]);
  const [eventUser, setEventUser] = useState<any[]>([]);
  const isFetchingStudent = useRef(true);
  const isFetchingTeacher = useRef(true);
  const today = formatDate(new Date());
  const [eventsSelect, setEventsSelect] = React.useState<any>(null);

  const getListEventStudent = async () => {
    const listEventStudent: any[] = [];
    await getPlanStudent().then((res) => {
      isFetchingStudent.current = false;
      if (!res.isError) {
        const dataStudent = res.data;
        // console.log("res.student..", res.data);
        for (let index = 0; index < dataStudent.length; index++) {
          const element = dataStudent[index];
          const schedule = element.schedule;
          for (let i = 0; i < schedule.length; i++) {
            const date = schedule[i].date;
            const e = schedule[i].time_available;
            for (let ind = 0; ind < e.length; ind++) {
              const ele = e[ind];
              const [hours, minutes] = ele.time_start.split(":");
              const [hoursEnd, minutesEnd] = ele.time_end.split(":");

              const dataAdd = {
                title: translations.course.call11With(
                  "teacher",
                  element.teacher_id.display_name,
                ),
                date: date,
                start: new Date(new Date(date).setHours(hours, minutes)),
                end: new Date(new Date(date).setHours(hoursEnd, minutesEnd)),
                color: ind > 0 || i > 0 ? palette.call11 : palette.newClass,
                type: EnumClassType.Call11,
                student_name: element.student_id.display_name,
                student_id: element.student_id._id,
                teacher_name: element.teacher_id.display_name,
                teacher_id: element.teacher_id._id,
                partner_id: element.teacher_id._id,
                partner_name: element.teacher_id.display_name,
                plan_id: element._id,
                course_name: element.course_id.title,
                partner: element.teacher_id,
              };
              listEventStudent.push(dataAdd);
            }
          }
        }
      }
    });
    setEventUser(listEventStudent);
  };
  const [currentTime, setCurrentTime] = useState([]);

  useEffect(() => {
    const updateCurrentTime = () => {
      const day = new Date();
      const timeAlive = [];
      const date = formatDate(day);
      timeAlive[0] = { date: date, start: day, timeAlive: true };
      setCurrentTime(timeAlive);
    };
    updateCurrentTime();
    const timer = setInterval(updateCurrentTime, 600000); // Update every 10 minutes

    return () => clearInterval(timer);
  }, []);
  const getListEventTeacher = async () => {
    const listEventTeacher: any[] = [];
    await getPlanTeacher().then((res) => {
      isFetchingTeacher.current = false;
      if (!res.isError) {
        const dataStudent = res.data;
        // console.log("res.teacher..", res.data);
        for (let index = 0; index < dataStudent.length; index++) {
          const element = dataStudent[index];
          const schedule = element.schedule;
          for (let i = 0; i < schedule.length; i++) {
            const date = schedule[i].date;
            const e = schedule[i].time_available;
            for (let ind = 0; ind < e.length; ind++) {
              const ele = e[ind];
              const [hours, minutes] = ele.time_start.split(":");
              const [hoursEnd, minutesEnd] = ele.time_end.split(":");

              const dataAdd = {
                title: translations.course.call11With(
                  "student",
                  element.student_id.display_name,
                ),
                date: formatDate(date),
                start: new Date(new Date(date).setHours(hours, minutes)),
                end: new Date(new Date(date).setHours(hoursEnd, minutesEnd)),
                color: ind > 0 || i > 0 ? palette.call11 : palette.newClass,
                type: EnumClassType.Call11,
                student_name: element.student_id.display_name,
                student_id: element.student_id._id,
                teacher_name: element.teacher_id.display_name,
                partner_id: element.student_id._id,
                partner_name: element.student_id.display_name,
                teacher_id: element.teacher_id._id,
                plan_id: element._id,
                course_name: element.course_id.title,
                partner: element.student_id,
              };
              listEventTeacher.push(dataAdd);
            }
          }
        }
      }
      // console.log("listEventTeacher", listEventTeacher);
      setEventTeacher(listEventTeacher);
    });
    // return listEventTeacher;
  };

  const getListEvent = () => {
    getListEventStudent();
    getListEventTeacher();
  };

  useEffect(() => {
    getListEvent();
  }, []);

  useEffect(() => {
    const event = [...eventTeacher, ...eventUser, ...currentTime];
    // console.log("event...", event);
    const eve = event
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .sort((a, b) => {
        if (a.date === b.date) {
          return a.start - b.start;
        }
        return a.date - b.date;
      });
    const groupedData = eve.reduce((groups, item) => {
      const date = item.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});
    // console.log("...old...", groupedData);
    // Object.keys(event).forEach((key) => {
    //   newItems[formatDate(event[key].start)] = event[key];
    // });
    // console.log("...evevt...", newItems);
    setRawData(groupedData);
  }, [eventTeacher, eventUser, currentTime]);

  const loadItems = (day: DateData) => {
    const _items = { ...items };

    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!_items[strTime]) {
          _items[strTime] = [];

          const numItems = 1;
          for (let j = 0; j < numItems; j++) {
            const findData = _items[strTime].push({
              name: "Item for " + strTime + " #" + j,
              day: strTime,
            });
            console.log(findData);
          }
        }
      }

      const newItems: AgendaSchedule = {};
      Object.keys(_items).forEach((key) => {
        newItems[key] = _items[key];
      });
      // console.log("newItemsnewItems", newItems)
      // console.log("...old...newItemsnewItems", newItems);

      setItems(newItems);
    }, 1000);
  };

  // const renderDay = (day) => {
  //   if (day) {
  //     return <Text style={styles.customDay}>{day.getDay()}</Text>;
  //   }
  //   return <View style={styles.dayItem} />;
  // };

  const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? "black" : "#43515c";
    const findData = rawData?.[reservation.day];
    // console.log("reservation", findData);
    return (
      <View testID={testIDs.agenda.ITEM} style={[styles.item]}>
        {!findData && (
          <View style={{ ...CS.flexStart, alignItems: "center" }}>
            <Text style={{ fontSize, color }}>
              {translations.emptyCalendar}
            </Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          {!!findData && findData.map((item) => renderPlan(item))}
        </View>
      </View>
    );
  };

  const renderPlan = (item) => {
    const onPress = () => {
      setEventsSelect(item);
    };
    if (item.timeAlive) {
      return (
        <View style={styles.containerAlive}>
          <View style={styles.viewDot} />
          <View style={styles.viewLine} />
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={{
          ...styles.containerItem,
          backgroundColor: `${item.color}30`,
        }}
        onPress={onPress}
      >
        <View
          style={{
            ...styles.viewSticky,
            backgroundColor: item.color,
          }}
        />
        <ImageLoad
          isAvatar
          style={styles.viewAvatar}
          source={{
            uri: item?.partner?.user_avatar,
          }}
          resizeMode={"cover"}
        />
        <View style={{ ...CS.flex1, gap: 4, paddingVertical: 4 }}>
          <Text numberOfLines={1} style={[styles.txtItemEvent]}>
            {item.title}
          </Text>
          <Text numberOfLines={2} style={[styles.txtItemEvent]}>
            {formatCalendarDateTime({
              start: item?.start,
              end: item?.end,
            })}
          </Text>
          <Text numberOfLines={2} style={[styles.txtItemEvent]}>
            {item.course_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // const renderEmptyDate = () => {
  //   return (
  //     <View style={styles.emptyDate}>
  //       <Text>This is empty date1!</Text>
  //     </View>
  //   );
  // };

  const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    return r1.name !== r2.name;
  };

  const timeToString = (time: number) => {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  };

  const closeModalDetail = () => setEventsSelect(null);

  return (
    <>
      <SafeAreaView style={CS.safeAreaView}>
        <Header
          text={translations.course.manageClass}
          iconNameRight="calendar"
          onPressRight={() => setModalVisible(true)}
        />
        <Agenda
          testID={testIDs.agenda.CONTAINER}
          items={items}
          loadItemsForMonth={loadItems}
          selected={today}
          renderItem={renderItem}
          // renderEmptyDate={renderEmptyDate}
          rowHasChanged={rowHasChanged}
          showClosingKnob={true}
        />

        <ModalCalendar
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
          propagateSwipe={true}
          style={styles.modal}
        >
          <SelectTypeCalendar />
        </ModalCalendar>
        <ModalCalendar
          isVisible={eventsSelect !== null}
          onBackdropPress={closeModalDetail}
          propagateSwipe={(event) => {
            console.log("event", event);
            return true;
          }}
          swipeDirection={["left", "right"]}
          style={styles.modal}
          swipeThreshold={100}
          onSwipeComplete={closeModalDetail}
        >
          <DetailEvent
            event={eventsSelect}
            closeModalDetail={closeModalDetail}
          />
        </ModalCalendar>
      </SafeAreaView>
    </>
  );
};

export default AgendaScreen;
