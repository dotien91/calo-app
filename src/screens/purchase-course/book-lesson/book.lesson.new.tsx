import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useRoute } from "@react-navigation/native";

import { getTimeAvailableNew } from "@services/api/course.api";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { formatDate } from "@utils/date.utils";
import { showToast } from "@helpers/super.modal.helper";
import LottieComponent from "@shared-components/lottie/LottieComponent";
import Button from "@shared-components/button/Button";
import { translations } from "@localization";
import { navigate } from "@helpers/navigation.helper";
import { SCREENS } from "constants";
import EmptyResultView from "@shared-components/empty.data.component";

interface TimeAvaiableType {
  day: string;
  time_start: string;
  time_end: string;
}

const BookLessonNew = () => {
  const route = useRoute();
  const courseData = route.params?.["courseData"];
  const startDate = new Date(
    courseData.start_time || "1970-01-01",
  ).toISOString();
  const mindate = new Date().toISOString();
  const maxdate = new Date(courseData.end_time || "2050-12-31").toISOString();
  const sumday = courseData.lession_count * 2;
  const [listTimeSelected, setListTimeSelected] = useState<TimeAvaiableType[]>(
    [],
  );
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
    let timeSelect;
    if (daySelected) {
      timePick = {
        [daySelected]: {
          selected: true,
          selectedColor: palette.primarySub,
        },
      };
    }
    if (listTimeSelected) {
      const input = listTimeSelected.map((item) => {
        return {
          [item.day]: {
            selected: true,
            selectedColor: palette.primary,
          },
        };
      });
      timeSelect = input.reduce((acc, item) => {
        const day = Object.keys(item)[0];
        acc[day] = item[day];
        return acc;
      }, {});
    }
    const selected = { ...timeSelect, ...timePick };
    setMarked(selected);
  }, [daySelected, listTimeSelected]);
  const getTimeAvaiable = (idCourse: string, date: string) => {
    setIsLoading(true);
    getTimeAvailableNew(idCourse, { date: date }).then((res) => {
      console.log("res...", res);
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
        lottieJson={require("../../../assets/lotties/loading-circle.json")}
      />
    );
  };

  const goToCheckout = () => {
    const timeSelected = listTimeSelected
      .sort((a, b) => new Date(a.day) - new Date(b.day))
      .sort((a, b) => {
        if (a.day === b.day) {
          return a.time_start.localeCompare(b.time_start);
        }
        return new Date(a.day) - new Date(b.day);
      });
    const params = {
      courseData,
      listTimeSelected: timeSelected,
      duration: "0.5",
    };
    // console.log("params...", params);
    navigate(SCREENS.PAYMENT_COURES, params);
  };

  const renderPurchaseBtn = () => {
    const isActive = listTimeSelected.length === sumday;
    return (
      <View style={styles.viewBtn}>
        <Button
          text={translations.purchase.orderNow}
          type={isActive ? "primary" : "disabled"}
          onPress={goToCheckout}
        />
      </View>
    );
  };

  const renderProgress = () => {
    return (
      <View style={styles.viewProgress}>
        <View style={styles.bgProgress}>
          <View
            style={{ ...styles.progressSelect, flex: listTimeSelected.length }}
          />
          <View style={{ flex: sumday - listTimeSelected.length }} />
        </View>
        <Text style={styles.textProgress}>
          {listTimeSelected.length}/{sumday}
        </Text>
      </View>
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
        <View style={{ height: 100 }}>
          <EmptyResultView
            desc={translations.course.emptyLesson}
            icon="calendar-clear-outline"
          />
        </View>
      );
    }
    return listAvaiableWithDay.map((item, index) => {
      const selected =
        listTimeSelected.findIndex(
          (i) => i.time_start === item.time_start && i.day === item.day,
        ) >= 0;
      const pressItem = () => {
        if (selected) {
          setListTimeSelected(
            listTimeSelected.filter(
              (i) => !(i.time_start === item.time_start && i.day === item.day),
            ),
          );
        } else {
          if ([...listTimeSelected].length >= sumday) {
            showToast({
              type: "error",
              message: translations.course.maxLesson(sumday),
            });
          } else {
            setListTimeSelected([...listTimeSelected, item]);
          }
        }
      };
      return (
        <TouchableOpacity
          onPress={pressItem}
          key={index}
          style={selected ? styles.viewItemSelected : styles.viewItem}
        >
          <Text style={selected ? styles.txtItemSelected : styles.txtItem}>
            {item.time_start} - {item.time_end}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={CS.flex1}>
      {renderProgress()}
      <ScrollView style={CS.flex1}>
        {renderCalendar()}
        {renderTimeAvaiable()}
      </ScrollView>
      {renderPurchaseBtn()}
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
  viewItemSelected: {
    marginTop: 8,
    marginHorizontal: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: palette.primary,
    backgroundColor: palette.primary,
    borderRadius: 12,
    ...CS.center,
  },
  txtItem: {
    ...CS.hnRegular,
  },
  txtItemSelected: {
    ...CS.hnSemiBold,
    color: palette.white,
  },
  viewProgress: {
    ...CS.row,
    paddingHorizontal: 16,
    gap: 16,
  },
  textProgress: {
    ...CS.hnMedium,
    fontSize: 14,
  },
  bgProgress: {
    flexDirection: "row",
    backgroundColor: palette.backgroundColorGrey,
    borderRadius: 12,
    height: 6,
    // marginHorizontal: 16,
    flex: 1,
  },
  progressSelect: {
    backgroundColor: palette.primary,
    borderRadius: 12,
  },
  viewBtn: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
});

export default BookLessonNew;
