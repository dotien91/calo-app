import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

import { getTimeAvailableNew } from "@services/api/course.api";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { formatDate } from "@utils/date.utils";
import LottieComponent from "@shared-components/lottie/LottieComponent";
import { translations } from "@localization";
import EmptyResultView from "@shared-components/empty.data.component";
import { ICourseItem } from "models/course.model";

interface TimeAvaiableType {
  day: string;
  time_start: string;
  time_end: string;
}
interface BookLessonNewProps {
  courseData: ICourseItem;
}

const BookLessonNew = ({ courseData }: BookLessonNewProps) => {
  const startDate = new Date(
    courseData.start_time || "1970-01-01",
  ).toISOString();
  const mindate = new Date().toISOString();
  const maxdate = new Date(courseData.end_time || "2050-12-31").toISOString();
  const [listAvaiableWithDay, setListAvaiableWithDay] = useState<
    TimeAvaiableType[]
  >([]);
  const [daySelected, setDaySelected] = useState(formatDate(new Date()));
  const [isLoading, setIsLoading] = useState(false);
  const [marked, setMarked] = useState({});
  const idCourse = courseData._id;

  useEffect(() => {
    if (idCourse) {
      getTimeAvaiable(idCourse, formatDate(daySelected));
    }
  }, [idCourse, daySelected]);

  useEffect(() => {
    let timePick;
    if (daySelected) {
      timePick = {
        [daySelected]: {
          selected: true,
          selectedColor: palette.primarySub,
        },
      };
    }

    const selected = { ...timePick };
    setMarked(selected);
  }, [daySelected]);
  const getTimeAvaiable = (idCourse: string, date: string) => {
    setIsLoading(true);
    getTimeAvailableNew(idCourse, { date: date }).then((res) => {
      setIsLoading(false);
      if (!res.isError) {
        const schedule: any[] = res.data.schedule || [];
        const listTime = schedule.map((item) => {
          return {
            day: date,
            time_end: item.time_end,
            time_start: item.time_start,
          };
        });
        setListAvaiableWithDay(listTime);
      } else {
        setListAvaiableWithDay([]);
      }
    });
  };

  const renderLoading = () => {
    return (
      <LottieComponent
        resizeMode="contain"
        height={120}
        customStyle={{ width: 150 }}
        lottieJson={require("assets/lotties/loading-circle.json")}
      />
    );
  };

  const renderCalendar = () => {
    return (
      <Calendar
        minDate={startDate > mindate ? startDate : mindate}
        maxDate={maxdate}
        onDayPress={(day) => {
          setDaySelected(day.dateString);
        }}
        monthFormat={"yyyy MM"}
        // onMonthChange={(month) => {
        //   console.log("month changed", month);
        // }}
        hideExtraDays={true}
        disableMonthChange={true}
        firstDay={1}
        enableSwipeMonths={true}
        markingType={"dot"}
        markedDates={marked}
      />
    );
  };

  const renderTimeAvaiable = () => {
    if (isLoading) {
      return (
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 60,
          }}
        >
          {renderLoading()}
        </View>
      );
    }
    if (listAvaiableWithDay.length == 0) {
      return (
        <View style={{ height: 150 }}>
          <EmptyResultView
            style={{ height: 150, ...CS.center }}
            desc={translations.course.emptyLesson}
            icon="calendar-clear-outline"
          />
        </View>
      );
    }
    return listAvaiableWithDay.map((item, index) => {
      return (
        <View key={index} style={styles.viewItem}>
          <Text style={styles.txtItem}>
            {item.time_start} - {item.time_end}
          </Text>
        </View>
      );
    });
  };

  return (
    <View style={CS.flex1}>
      <ScrollView style={CS.flex1}>
        {renderCalendar()}
        {renderTimeAvaiable()}
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
});

export default BookLessonNew;
