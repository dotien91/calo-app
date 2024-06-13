import React, { useEffect, useMemo, useState } from "react";
import { Text, View, ScrollView, SafeAreaView } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import Header from "@shared-components/header/Header";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import { daysOfWeek, timeFullWeek } from "constants/course.constant";
import CS from "@theme/styles";
import createStyles from "./course.create.class.style";
import { getLabelHourLesson } from "@screens/course-tab/course.helper";
import Button from "@shared-components/button/Button";
import useStore from "@services/zustand/store";
import {
  // _getTimeAvailableTeacher,
  getTimeAvailableTeacherBuyId,
  updateTeacherTimeAvaiable,
} from "@services/api/course.api";
import { showToast } from "@helpers/super.modal.helper";
import dayjs from "dayjs";

interface ITimeSelected {
  day: number;
  time_start: string;
  duration: number;
}

const CreateClassCallOneScreen = () => {
  const theme = useTheme();
  const { colors } = theme;
  // const route = useRoute();

  // const course_id = route.params?.["course_id"];

  const [timeSelected, setTimeSelected] = useState<ITimeSelected[]>([]);
  const [date, setDate] = useState<number>(0);
  const [updating, setUpdating] = useState(false);
  // const [updataTime, setUpdateTime] = useState(false);
  const userData = useStore((store) => store.userData);

  const addOneHour = (timeStr) => {
    // Split the input time string into hours and minutes
    const [hours, minutes] = timeStr.split(":").map(Number);

    // Create a new Date object with the given time
    const time = new Date();
    time.setHours(hours);
    time.setMinutes(minutes);

    // Add one hour
    // time.setHours(time.getHours() + 1);
    const day = dayjs(time).add(30, "minutes").toDate();

    // Format the result
    const result = `${(day.getHours() + "").padStart(2, "0") + ""}:${
      (day.getMinutes() + "").padStart(2, "0") + ""
    }`;
    // console.log("result", result);
    return result;
  };

  useEffect(() => {
    const _getTimeAvailableNew = () => {
      getTimeAvailableTeacherBuyId(userData?._id).then((res) => {
        if (!res.isError) {
          // console.log("res.s..", res.data);
          const schedule = res.data.schedule;
          const dataUpdate = [];
          for (let i = 0; i < schedule.length; i++) {
            if (schedule[i].time_available.length > 0) {
              // setUpdateTime(true);
              const mapTime = schedule[i].time_available.map(
                (item: ITimeSelected) => {
                  return {
                    day: schedule[i].day,
                    time_start: item.time_start,
                    time_end: addOneHour(item.time_start),
                  };
                },
              );
              // console.log("mapTime...", mapTime);
              dataUpdate.push(...mapTime);
            }
          }
          if (dataUpdate.length > 0) {
            setTimeSelected(dataUpdate);
          }
        }
      });
    };
    _getTimeAvailableNew();
  }, []);

  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const renderSelectDate = () => {
    const onSelectDate = (item) => {
      setDate(item.value);
    };

    const renderDateBtn = (item) => {
      const isSelect = item.value === date;
      const daySelect =
        timeSelected.findIndex((i) => i.day === item.value) >= 0;
      return (
        <PressableBtn
          onPress={() => onSelectDate(item)}
          style={
            isSelect || daySelect
              ? styles.durationBtnSelected
              : styles.durationBtn
          }
        >
          <Text
            style={
              isSelect || daySelect ? styles.txtBtnSelected : styles.txtBtn
            }
          >
            {item.label}
          </Text>
          {isSelect && (
            <View
              style={{
                height: 3,
                backgroundColor: colors.primary,
                position: "absolute",
                left: 0,
                bottom: -8,
                right: 0,
                zIndex: 1,
              }}
            />
          )}
        </PressableBtn>
      );
    };

    return (
      <View style={styles.selectBox}>
        <Text style={[styles.label, { marginBottom: 0 }]}>
          {translations.purchase.chooseDay}
        </Text>
        <View style={CS.flexRear}>
          {daysOfWeek.map((item) => renderDateBtn(item))}
        </View>
      </View>
    );
  };

  const renderHourBtn = (item) => {
    const indexSelected = timeSelected.findIndex(
      (i) => i.day === date && i.time_start === item.time_start,
    );

    const _pressHour = () => {
      const timeSelect = {
        day: date,
        time_start: item.time_start,
        time_end: addOneHour(item.time_start),
      };
      if (indexSelected >= 0) {
        const newTimeSelected = [...timeSelected].filter(
          (i) => !(i.day === date && i.time_start === item.time_start),
        );
        setTimeSelected(newTimeSelected);
      } else {
        setTimeSelected([...timeSelected, timeSelect]);
      }
    };
    return (
      <>
        {!!item.extraLabel && (
          <Text style={{ ...styles.text, marginBottom: 8 }}>
            {item.extraLabel}
          </Text>
        )}
        <PressableBtn
          onPress={_pressHour}
          style={[
            styles.hourBtn,
            {
              backgroundColor:
                indexSelected >= 0 ? colors.primary : colors.white,
            },
          ]}
        >
          <Text style={indexSelected >= 0 ? styles.textSelected : styles.text}>
            {item.label}
          </Text>
        </PressableBtn>
      </>
    );
  };

  function groupByDay(intervals) {
    const grouped = intervals.reduce((acc, interval) => {
      if (!acc[interval.day]) {
        acc[interval.day] = { day: interval.day, time_available: [] };
      }
      acc[interval.day].time_available.push({
        time_start: interval.time_start,
        time_end: interval.time_end,
      });
      return acc;
    }, {});
    return Object.values(grouped);
  }

  function mergeIntervals(intervals) {
    if (intervals.length === 0) return [];
    intervals.sort((a, b) => a.time_start.localeCompare(b.time_start));
    const mergedIntervals = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
      const last = mergedIntervals[mergedIntervals.length - 1];
      const current = intervals[i];
      if (current.time_start === last.time_end) {
        last.time_end = current.time_end;
      } else {
        mergedIntervals.push(current);
      }
    }
    return mergedIntervals;
  }
  function processIntervals(intervals) {
    const groupedByDay = groupByDay(intervals);
    groupedByDay.forEach((group) => {
      group.time_available = mergeIntervals(group.time_available);
    });

    return groupedByDay;
  }

  const renderSelectHours = useMemo(() => {
    const data = timeFullWeek?.[date]?.times;
    const dataWithLabel = getLabelHourLesson(data);
    return (
      <View style={styles.selectBox}>
        {dataWithLabel?.map((item) => renderHourBtn(item))}
      </View>
    );
  }, [date, timeSelected]);

  const _submitTime = () => {
    const time_available = timeSelected
      .sort((a, b) => a.day - b.day)
      .sort((a, b) => {
        if (a.day === b.day) {
          return a.time_start.localeCompare(b.time_start);
        }
        return a.day - b.day;
      });

    const schedule = processIntervals(time_available);

    const data = {
      schedule: schedule,
    };
    console.log("data", JSON.stringify(data));
    setUpdating(true);
    updateTeacherTimeAvaiable(data).then((res) => {
      // console.log(res);
      if (!res.isError) {
        setUpdating(false);
        showToast({
          type: "success",
          message: translations.course.createModuleSuccess,
        });
        NavigationService.goBack();
      } else {
        setUpdating(false);
        showToast({ type: "error", message: res.message });
      }
    });
  };

  return (
    <SafeAreaView style={[CS.safeAreaView]}>
      <Header text={translations.course.timeAvailable} />
      <View style={{ paddingHorizontal: 16 }}>{renderSelectDate()}</View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 16 }}
      >
        {renderSelectHours}
      </ScrollView>
      <View style={styles.paddingBtn}>
        <Button
          style={{
            backgroundColor: updating ? colors.placeholder : colors.primary,
            marginBottom: 8,
          }}
          text={translations.save}
          disabled={updating}
          onPress={_submitTime}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreateClassCallOneScreen;
