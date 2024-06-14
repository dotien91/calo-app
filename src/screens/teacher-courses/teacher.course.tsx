import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
} from "react-native";
import {
  Calendar,
  CalendarTouchableOpacityProps,
  ICalendarEventBase,
  Mode,
} from "react-native-big-calendar";
import { getStatusBarHeight } from "react-native-safearea-height";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import ModalCalendar from "./ModalCalendar";
import PressableBtn from "@shared-components/button/PressableBtn";
import IconSvg from "assets/svg";
import { formatCalendarDateTime } from "@utils/date.utils";
import IconSvgBtn from "@screens/audio/components/IconSvgBtn";
import {
  getCourseRoomV2,
  getPlanStudent,
  getPlanTeacher,
} from "@services/api/course.api";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import { navigate } from "@helpers/navigation.helper";
import { SCREENS } from "constants";
import { EnumClassType } from "models/course.model";
import { showToast } from "@helpers/super.modal.helper";

interface MyCustomEventType extends ICalendarEventBase {
  color: string;
}

const HEIGHT_CALENDAR =
  SCREEN_HEIGHT - getStatusBarHeight() - getBottomSpace() - 48;

const TeacherCourse = () => {
  const [date, setDate] = React.useState(new Date());
  const [mode, setMode] = React.useState<Mode>("schedule");
  const [eventsSelect, setEventsSelect] = React.useState<any>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const [eventTeacher, setEventTeacher] = useState<any>([]);
  const [eventUser, setEventUser] = useState<any[]>([]);

  const getListEventStudent = async () => {
    const listEventStudent: any[] = [];
    await getPlanStudent().then((res) => {
      if (!res.isError) {
        const dataStudent = res.data;
        console.log("res.student..", res);
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
              };
              listEventStudent.push(dataAdd);
            }
          }
        }
      }
    });
    setEventUser(listEventStudent);
  };
  const getListEventTeacher = async () => {
    const listEventTeacher: any[] = [];
    await getPlanTeacher().then((res) => {
      if (!res.isError) {
        const dataStudent = res.data;
        console.log("res.teacher..", res);
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
              };
              listEventTeacher.push(dataAdd);
            }
          }
        }
      }
      console.log("listEventTeacher", listEventTeacher);
      setEventTeacher(listEventTeacher);
    });
    return listEventTeacher;
  };

  const getListEvent = () => {
    getListEventStudent();
    getListEventTeacher();
  };

  useEffect(() => {
    getListEvent();
  }, []);

  const ItemCheck = ({ item }: { item: { color: string; title: string } }) => {
    return (
      <View style={styles.itemSelectTypeCalendar}>
        <IconSvg name="icCheck" color={item.color} size={20} />
        <Text style={CS.hnRegular}>{item.title}</Text>
      </View>
    );
  };

  const ItemTypeDate = ({
    item,
  }: {
    item: { title: string; icon: string; type: Mode };
  }) => {
    const selected = item.type === mode;
    const onPress = () => {
      setModalVisible(false);
      setMode(item.type);
    };
    return (
      <PressableBtn
        style={{
          ...styles.containerItemSelectType,
          backgroundColor: selected
            ? palette.backgroundColorGrey
            : palette.background,
        }}
        onPress={onPress}
      >
        <IconSvg name={item.icon} color={palette.textOpacity8} size={32} />
        <Text style={{ ...CS.hnRegular, fontSize: 12 }}>{item.title}</Text>
      </PressableBtn>
    );
  };

  // const addLeave = () => {};

  // const _onPressCell = (e) => {
  //   // alert(e);
  // };

  const renderEvent = <T extends MyCustomEventType>(
    event: T,
    touchableOpacityProps: CalendarTouchableOpacityProps,
  ) => (
    <TouchableOpacity {...touchableOpacityProps}>
      <View
        style={{
          ...styles.viewSticky,
          backgroundColor: event.color,
        }}
      />
      <View
        style={[
          CS.flex1,
          { backgroundColor: `${event.color}30`, paddingLeft: 8 },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.txtItemEvent,
            mode === "schedule" ? { fontSize: 16 } : {},
          ]}
        >
          {event.title}
        </Text>
        {mode === "schedule" && (
          <Text
            numberOfLines={1}
            style={[
              styles.txtItemEvent,
              mode === "schedule" ? { fontSize: 12 } : {},
            ]}
          >
            {formatCalendarDateTime({
              start: event?.start,
              end: event?.end,
            })}
            {event.course_name}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCalendar = useMemo(() => {
    return (
      <Calendar
        mode={mode}
        renderEvent={renderEvent}
        // onPressCell={_onPressCell}
        activeDate={date}
        onPressDateHeader={(e) => setDate(e)}
        onPressEvent={(e) => setEventsSelect(e)}
        events={[...eventTeacher, ...eventUser]}
        eventCellStyle={styles.eventCellStyle}
        height={HEIGHT_CALENDAR}
      />
    );
  }, [eventTeacher, eventUser, mode]);
  const closeModalDetail = () => setEventsSelect(null);

  const ItemDetailEvent = ({
    onPress,
    title,
    color,
    iconLeft,
    iconRight,
    onPressRight,
  }: {
    onPress: () => void;
    title: string;
    color: string;
    iconLeft: string;
    iconRight?: string;
    onPressRight?: () => void;
  }) => {
    return (
      <View style={styles.containerItemDetail}>
        <IconSvg name={iconLeft} size={20} color={palette.textOpacity8} />
        <View style={CS.flex1}>
          <PressableBtn
            style={{
              ...styles.btnDetailEvent,
              borderColor: color,
            }}
            onPress={onPress}
          >
            <Text style={styles.txtBtnDeatilEvent}>{title}</Text>
          </PressableBtn>
        </View>
        {iconRight && (
          <IconSvgBtn
            onPress={onPressRight}
            name={iconRight}
            size={16}
            color={palette.textOpacity8}
          />
        )}
      </View>
    );
  };

  const DetailEvent = useCallback(
    ({ event }) => {
      if (event == null) {
        return null;
      } else {
        let courseRoom: any;
        getCourseRoomV2({
          course_plan_student_id: event?.plan_id,
          student_id: event?.student_id,
          teacher_id: event?.teacher_id,
        }).then((res) => {
          if (!res.isError) {
            const data = res.data;
            const roomId = (data?.redirect_url || "").match(/[^\/]+$/)?.[0];
            courseRoom = { roomId, chatRoomId: data?.chat_room_id };
          }
        });
        const startCall = () => {
          if (event.type === EnumClassType.Call11) {
            closeModalDetail();
            navigate(SCREENS.CALL_CLASS, {
              course_id: event.course_id,
              courseData: { type: event.type, user_id: event.teacher_id },
              courseRoom,
            });
            // alert("Bắt đầu cuộc gọi call11");
          }
          if (event.type === EnumClassType.CallGroup) {
            alert("Bắt đầu cuộc gọi callGroup");
          }
        };
        const copyLink = () => {
          Clipboard.setString(
            ` https://app.ikigaicoach.net/room/${courseRoom?.roomId}`,
          );
          showToast({ type: "success", message: translations.copied });
        };
        const sendMessage = () => {
          closeModalDetail();
          navigate(SCREENS.CHAT_ROOM, {
            id: courseRoom?.chat_room_id,
            partner_id: event.partner_id,
            partner_name: event?.partner_name,
          });
        };
        return (
          <View style={styles.bottomFull}>
            <View
              style={{
                ...styles.viewHeader,
                backgroundColor: `${event?.color}10`,
              }}
            >
              <View style={styles.headerDetail}>
                <PressableBtn
                  onPress={closeModalDetail}
                  style={styles.viewIcon}
                >
                  <Icon
                    name={"chevron-left"}
                    type={IconType.Feather}
                    size={25}
                    color={palette.text}
                  />
                </PressableBtn>
                {/* <PressableBtn style={styles.viewIcon}>
                  <Icon
                    name={"edit"}
                    type={IconType.Feather}
                    size={20}
                    color={palette.text}
                  />
                </PressableBtn> */}
              </View>
              <View style={styles.viewTitle}>
                <View
                  style={{
                    ...styles.viewRect,
                    backgroundColor: event?.color,
                  }}
                />
                <View>
                  <Text style={{ ...CS.hnRegular, color: event?.color }}>
                    {event?.title}
                  </Text>
                  <Text
                    style={{
                      ...CS.hnRegular,
                      fontSize: 14,
                      color: event?.color,
                    }}
                  >
                    {formatCalendarDateTime({
                      start: event?.start,
                      end: event?.end,
                    })}
                  </Text>
                  <Text
                    style={{
                      ...CS.hnRegular,
                      fontSize: 14,
                      color: event?.color,
                    }}
                  >
                    {event.course_name}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.paddingH}>
              <ItemDetailEvent
                color={event?.color}
                iconLeft={"icCall"}
                title={translations.chat.startCall}
                onPress={startCall}
                iconRight="icCopy"
                onPressRight={copyLink}
              />
              <ItemDetailEvent
                color={event?.color}
                iconLeft={"icMessage"}
                title={translations.chat.sendMessage}
                onPress={sendMessage}
              />
              {event?.type === "callGroup" && (
                <ItemDetailEvent
                  color={event?.color}
                  iconLeft={"icChat"}
                  title={translations.course.assignTask}
                  onPress={sendMessage}
                />
              )}
            </View>
          </View>
        );
      }
    },
    [eventsSelect],
  );

  const SelectTypeCalendar = useCallback(() => {
    return (
      <SafeAreaView style={styles.bottomInner}>
        <View style={styles.viewTypeCalendar}>
          <ItemTypeDate
            item={{
              icon: "icAgenda",
              title: translations.schedule,
              type: "schedule",
            }}
          />
          <ItemTypeDate
            item={{ icon: "icDay", title: translations.day, type: "day" }}
          />
          <ItemTypeDate
            item={{ icon: "icWeek", title: translations.week, type: "week" }}
          />
          <ItemTypeDate
            item={{ icon: "icMonth", title: translations.month, type: "month" }}
          />
        </View>
        <View style={styles.paddingH}>
          {/* <View style={styles.viewBorder} /> */}
          {/* <PressableBtn onPress={addLeave} style={styles.viewBtn}>
            <IconSvg name="icAdd" size={24} color={palette.textOpacity8} />
            <Text style={CS.hnRegular}>{translations.course.addLeave}</Text>
          </PressableBtn> */}
          <View style={styles.viewBorder} />
          <View style={styles.viewBtn}>
            <Text style={CS.hnSemiBold}>{translations.course.note}</Text>
          </View>
          <View>
            <ItemCheck
              item={{
                color: palette.callGroup,
                title: translations.course.callGroup,
              }}
            />
            <ItemCheck
              item={{
                color: palette.newClass,
                title: translations.course.newClass,
              }}
            />
            <ItemCheck
              item={{
                color: palette.call11,
                title: translations.course.callOneVsOne,
              }}
            />
            {/* <ItemCheck
              item={{ color: palette.leave, title: translations.course.leave }}
            /> */}
          </View>
        </View>
      </SafeAreaView>
    );
  }, [mode, modalVisible]);

  return (
    <>
      <SafeAreaView style={CS.safeAreaView}>
        <Header
          text={translations.course.manageClass}
          iconNameRight="calendar"
          onPressRight={() => setModalVisible(true)}
        />

        {renderCalendar}
      </SafeAreaView>
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
        <DetailEvent event={eventsSelect} />
      </ModalCalendar>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    ...CS.flexCenter,
  },
  bottomInner: {
    ...CS.safeAreaView,
    backgroundColor: palette.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    left: SCREEN_WIDTH / 5,
    bottom: 0,
    right: 0,
    top: 0,
  },
  bottomFull: {
    ...CS.flex1,
    backgroundColor: palette.background,
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
  },
  viewHeader: {
    paddingTop: getStatusBarHeight(),
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  viewTypeCalendar: {
    ...CS.flexStart,
    gap: 8,
    paddingHorizontal: 8,
  },
  viewBtn: {
    paddingVertical: 8,
    ...CS.row,
    gap: 8,
  },
  viewBorder: {
    height: 1,
    backgroundColor: palette.borderColor,
    marginVertical: 8,
  },
  btnDetailEvent: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  txtBtnDeatilEvent: {
    ...CS.hnRegular,
    fontSize: 14,
  },
  viewRect: {
    width: 20,
    height: 20,
    borderRadius: 8,
  },
  viewIcon: {
    ...CS.center,
    width: 25,
    height: 25,
  },
  headerDetail: {
    ...CS.row,
    height: 40,
    justifyContent: "space-between",
  },
  itemSelectTypeCalendar: {
    ...CS.row,
    gap: 8,
    marginTop: 8,
  },
  viewTitle: {
    ...CS.row,
    gap: 16,
  },
  containerItemSelectType: {
    width: SCREEN_WIDTH / 5 - 10,
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  viewSticky: {
    height: "auto",
    width: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  txtItemEvent: {
    ...CS.hnRegular,
    fontSize: 10,
  },
  eventCellStyle: {
    borderRadius: 8,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.borderColor,
    padding: 0,
    flexDirection: "row",
  },
  paddingH: {
    paddingHorizontal: 16,
  },
  containerItemDetail: {
    ...CS.row,
    gap: 8,
    marginTop: 8,
  },
});

export default TeacherCourse;
