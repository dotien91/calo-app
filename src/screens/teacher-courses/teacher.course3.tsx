import { palette } from '@theme/themes';
import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Agenda, DateData, AgendaEntry, AgendaSchedule} from 'react-native-calendars';
import CS from '@theme/styles';
import { formatCalendarDateTime } from '@utils/date.utils';
import { getStatusBarHeight } from 'react-native-safearea-height';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
const  testIDs = {
  menu: {
    CONTAINER: 'menu',
    CALENDARS: 'calendars_btn',
    CALENDAR_LIST: 'calendar_list_btn',
    HORIZONTAL_LIST: 'horizontal_list_btn',
    AGENDA: 'agenda_btn',
    EXPANDABLE_CALENDAR: 'expandable_calendar_btn',
    WEEK_CALENDAR: 'week_calendar_btn',
    TIMELINE_CALENDAR: 'timeline_calendar_btn',
    PLAYGROUND: 'playground_btn'
  },
  calendars: {
    CONTAINER: 'calendars',
    FIRST: 'first_calendar',
    LAST: 'last_calendar'
  },
  calendarList: {CONTAINER: 'calendarList'},
  horizontalList: {CONTAINER: 'horizontalList'},
  agenda: {
    CONTAINER: 'agenda',
    ITEM: 'item'
  },
  expandableCalendar: {CONTAINER: 'expandableCalendar'},
  weekCalendar: {CONTAINER: 'weekCalendar'}
};

interface State {
  items?: AgendaSchedule;
}

export default class AgendaScreen extends Component<State> {
  state: State = {
    items: undefined
  };

  // reservationsKeyExtractor = (item, index) => {
  //   return `${item?.reservation?.day}${index}`;
  // };

  render() {
    return (
      <Agenda
        testID={testIDs.agenda.CONTAINER}
        items={this.state.items}
        loadItemsForMonth={this.loadItems}
        selected={'2017-05-16'}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
        rowHasChanged={this.rowHasChanged}
        showClosingKnob={true}
        // markingType={'period'}
        // markedDates={{
        //    '2017-05-08': {textColor: '#43515c'},
        //    '2017-05-09': {textColor: '#43515c'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
        // monthFormat={'yyyy'}
        // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        // renderDay={this.renderDay}
        // hideExtraDays={false}
        // showOnlySelectedDayItems
        // reservationsKeyExtractor={this.reservationsKeyExtractor}
      />
    );
  }

  loadItems = (day: DateData) => {
    const items = this.state.items || {};

    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];
          
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
              day: strTime
            });
          }
        }
      }
      
      const newItems: AgendaSchedule = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });
      console.log("newItems", newItems)
      this.setState({
        items: newItems
      });
    }, 1000);
  };

  renderDay = (day) => {
    if (day) {
      return <Text style={styles.customDay}>{day.getDay()}</Text>;
    }
    return <View style={styles.dayItem}/>;
  };

  renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? 'black' : '#43515c';
    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, {height: reservation.height}]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text style={{fontSize, color}}>{reservation.height}</Text>
        <View style={{ ...CS.row, marginTop: 8 }}>
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: palette.red,
              }}
            />
            <View
              style={{
                flex: 1,
                height: 1,
                borderRadius: 2,
                backgroundColor: palette.red,
              }}
            />
          </View>
      </TouchableOpacity>
    );
  };

  const renderPlan = (item) => {
    const onPress = () => {
      // setEventsSelect(item);
      console.log("eventSelected...", item);
    };
    if (item.timeAlive) {
      console.log("item...", item);
    }
    return (
      <View style={{height: 100}} key={item.date}>
        {item.timeAlive ? (
          <View style={{ ...CS.row, marginTop: 8 }}>
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: palette.red,
              }}
            />
            <View
              style={{
                flex: 1,
                height: 1,
                borderRadius: 2,
                backgroundColor: palette.red,
              }}
            />
          </View>
        ) : (
          <TouchableOpacity
            style={{
              ...CS.row,
              marginTop: 8,
              backgroundColor: `${item.color}30`,
              gap: 8,
            }}
            onPress={onPress}
          >
            <View
              style={{
                ...styles.viewSticky,
                backgroundColor: item.color,
              }}
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
        )}
      </View>
    );
  };
  

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    return r1.name !== r2.name;
  };

  timeToString(time: number) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: 'green'
  },
  dayItem: {
    marginLeft: 34
  },
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
    height: "100%",
    width: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  txtItemEvent: {
    ...CS.hnRegular,
    fontSize: 16,
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
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    fontWeight: "bold",
    marginRight: 10,
    color: "#333",
  },
  dayContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  todayContainer: {
    backgroundColor: "#e0f7fa",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  currentTimeMarker: {
    fontSize: 14,
    color: "#ff1744",
    marginTop: 5,
  },
});