import React, { useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
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
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import ModalCalendar from "./ModalCalendar";
import PressableBtn from "@shared-components/button/PressableBtn";
import IconSvg from "assets/svg";
import { formatCalendarDateTime } from "@utils/date.utils";
import IconSvgBtn from "@screens/audio/components/IconSvgBtn";

interface MyCustomEventType extends ICalendarEventBase {
  color: string;
}

const listevents = [
  {
    title: "Call 1-1 với Dangth",
    start: new Date("2024-06-05T03:24:00"),
    end: new Date("2024-06-05T04:24:00"),
    color: palette.call11,
    type: "call11",
  },
  {
    title: "Call 1-1 với Tony Vu",
    start: new Date("2024-06-07T04:24:00"),
    end: new Date("2024-06-07T06:24:00"),
    color: palette.newClass,
    type: "call11",
  },
  {
    title: "Call group lớp C06",
    start: new Date("2024-06-04T03:24:00"),
    end: new Date("2024-06-04T04:24:00"),
    color: palette.callGroup,
    type: "callGroup",
  },
  {
    title: "Call group lớp E06",
    start: new Date("2024-06-06T04:24:00"),
    end: new Date("2024-06-06T06:24:00"),
    color: palette.callGroup,
    type: "callGroup",
  },
];
const TeacherCourse = () => {
  const [date, setDate] = React.useState(new Date());
  const [mode, setMode] = React.useState<Mode>("week");
  const [events, setEvents] = React.useState<any[]>([]);
  const [eventsSelect, setEventsSelect] = React.useState<any>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  useEffect(() => {
    setEvents(listevents);
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

  const addLeave = () => {};

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
          ...styles.viewSticky,
          backgroundColor: event.color,
        }}
      />
      <Text numberOfLines={1} style={styles.txtItemEvent}>
        {event.title}
      </Text>
      <Text numberOfLines={1} style={styles.txtItemEvent}>
        {formatCalendarDateTime({
          start: event?.start,
          end: event?.end,
        })}
      </Text>
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
        onPressEvent={(e) => setEventsSelect(e)}
        events={events}
        eventCellStyle={styles.eventCellStyle}
        height={600}
      />
    );
  };
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

  const DetailEvent = ({ event }) => {
    if (event == null) {
      return null;
    } else {
      const startCall = () => {
        if (event.type === "call11") {
          alert("Bắt đầu cuộc gọi call11");
        }
        if (event.type === "callGroup") {
          alert("Bắt đầu cuộc gọi callGroup");
        }
      };
      const copyLink = () => {
        alert("copy link");
      };
      const sendMessage = () => {
        alert("gửi tin nhắn");
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
              <PressableBtn onPress={closeModalDetail} style={styles.viewIcon}>
                <Icon
                  name={"chevron-left"}
                  type={IconType.Feather}
                  size={25}
                  color={palette.text}
                />
              </PressableBtn>
              <PressableBtn style={styles.viewIcon}>
                <Icon
                  name={"edit"}
                  type={IconType.Feather}
                  size={20}
                  color={palette.text}
                />
              </PressableBtn>
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
                  style={{ ...CS.hnRegular, fontSize: 14, color: event?.color }}
                >
                  {formatCalendarDateTime({
                    start: event?.start,
                    end: event?.end,
                  })}
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
  };

  const SelectTypeCalendar = () => {
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
          <View style={styles.viewBorder} />
          <PressableBtn onPress={addLeave} style={styles.viewBtn}>
            <IconSvg name="icAdd" size={24} color={palette.textOpacity8} />
            <Text style={CS.hnRegular}>{translations.course.addLeave}</Text>
          </PressableBtn>
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
            <ItemCheck
              item={{ color: palette.leave, title: translations.course.leave }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <>
      <SafeAreaView style={CS.safeAreaView}>
        <Header
          text={translations.course.manageClass}
          iconNameRight="calendar"
          onPressRight={() => setModalVisible(true)}
        />

        {renderCalendar()}
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
  container: {
    paddingHorizontal: 16,
  },
  viewEmpty: {
    minHeight: 200,
    ...CS.center,
  },
  modal: {
    ...CS.flexCenter,
  },
  bottomInner: {
    ...CS.safeAreaView,
    backgroundColor: palette.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    // position: "absolute",
    left: SCREEN_WIDTH / 5,
    bottom: 0,
    right: 0,
    top: 0,
  },
  bottomFull: {
    ...CS.flex1,
    backgroundColor: palette.background,
    // position: "absolute",
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
    width: "auto",
    height: 4,
    borderRadius: 2,
  },
  txtItemEvent: {
    ...CS.hnRegular,
    fontSize: 10,
  },
  eventCellStyle: {
    borderRadius: 10,
    backgroundColor: palette.secondColor,
    borderWidth: 1,
    borderColor: palette.borderColor,
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
