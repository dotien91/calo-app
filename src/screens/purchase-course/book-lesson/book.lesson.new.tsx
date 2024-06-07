import CS from "@theme/styles";
import { palette } from "@theme/themes";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

const BookLessonNew = () => {
  const mindate = new Date().toISOString();
  const sumday = 12;
  const [listTimeSelected, setListTimeSelected] = useState([
    { lable: "123123" },
  ]);
  const [listAvaiableWithDay, setListAvaiableWithDay] = useState([
    { lable: "123123" },
    { lable: "1234546" },
  ]);
  const getTimeAvaiable = () => {};

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: palette.backgroundColorGrey,
          borderRadius: 12,
          height: 6,
          marginHorizontal: 16,
        }}
      >
        <View
          style={{
            flex: listTimeSelected.length,
            backgroundColor: "red",
            borderRadius: 12,
          }}
        />
        <View style={{ flex: sumday - listTimeSelected.length }} />
      </View>
      <ScrollView style={{ flex: 1 }}>
        <Calendar
          // Initially visible month. Default = now
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={mindate}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          // Handler which gets executed on day press. Default = undefined
          onDayPress={(day) => {
            console.log("selected day", day);
          }}
          // Handler which gets executed on day long press. Default = undefined
          onDayLongPress={(day) => {
            console.log("selected day", day);
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={"yyyy MM"}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          onMonthChange={(month) => {
            console.log("month changed", month);
          }}
          hideExtraDays={true}
          disableMonthChange={true}
          firstDay={1}
          enableSwipeMonths={true}
          markingType={"dot"}
          markedDates={{
            "2024-06-15": { marked: true, dotColor: "#50cebb" },
            "2024-06-16": { marked: true, dotColor: "#50cebb" },
            "2024-06-18": { marked: true, dotColor: "#50cebb" },
            "2024-06-19": { marked: true, dotColor: "#50cebb" },
            "2024-06-22": { marked: true, dotColor: "#50cebb" },
            "2024-06-24": { marked: true, dotColor: "#50cebb" },
          }}
        />
        {listAvaiableWithDay.map((item, index) => {
          const selected =
            listTimeSelected.findIndex((i) => i.lable === item.lable) >= 0;
          const pressItem = () => {
            if (selected) {
              setListTimeSelected(
                listTimeSelected.filter((i) => i.lable !== item.lable),
              );
            } else {
              setListTimeSelected([...listTimeSelected, item]);
            }
          };
          return (
            <TouchableOpacity
              onPress={pressItem}
              key={index}
              style={styles.viewItem}
            >
              <Text style={selected ? styles.txtItemSelected : styles.txtItem}>
                {item.lable}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  viewItem: {
    marginTop: 8,
    marginHorizontal: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: palette.borderColor,
    borderRadius: 12,
    ...CS.center,
  },
  txtItem: {
    ...CS.hnRegular,
  },
  txtItemSelected: {
    ...CS.hnSemiBold,
  },
});

export default BookLessonNew;
