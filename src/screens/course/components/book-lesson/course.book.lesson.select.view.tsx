import React, { useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./book.lesson.styles";
import { daysOfWeek } from "constants/course.constant";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import CS from "@theme/styles";
import { getLabelHourLesson } from "@screens/course-tab/course.helper";
import { getTimeAvailable } from "@services/api/course.api";
import LoadingList from "@shared-components/loading.list.component";

interface BookLessonSelectViewProps {
  course_id: string;
  isShow: string;
}

const BookLessonSelectView = ({
  course_id,
  isShow,
}: BookLessonSelectViewProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [data, setData] = useState([]);
  const [duration, setDuration] = useState<number>(1);
  const [isMaxDay, setIsMaxDay] = useState(false);

  const [day, setDay] = useState([]);
  const [dateView, setDateView] = useState(1);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    getTimeAvailable({ course_id: course_id }).then((res) => {
      if (!res.isError) {
        setData(res.data);
      }
      setLoading(false);
    });
  }, []);

  //hide
  React.useEffect(() => {
    let countDay = 0;
    let currentDay = -1;
    day.forEach((item) => {
      if (item.day != currentDay) {
        countDay += 1;
        currentDay = item.day;
      }
    });
    if (countDay >= 4) {
      !isMaxDay && setIsMaxDay(true);
    } else {
      !!isMaxDay && setIsMaxDay(false);
    }
  }, [day]);

  const onSelectDateView = (item) => {
    setDateView(item.value);
  };

  const onSelectDuration = (item) => {
    setDuration(item.time_duration);
    setDay([]);
    setIsMaxDay(false);
  };

  // const onSelectTimeStart = (item, isActive) => {
  //   const timePickByDay = {
  //     day: dateView,
  //     time_start: item.time_start + "" + ":00",
  //     time_end: item.time_start + duration + ":00",
  //   };
  //   const timeOfCurrentDay = day.filter((_item) => _item.day == dateView);

  //   // console.log("itemmmmm", {item, timePickByDay});

  //   setDay((old) => {
  //     if (isActive)
  //       return old.filter(
  //         (_item) =>
  //           item.label != _item.time_start + " - " + _item.time_end ||
  //           _item.day != dateView,
  //       );
  //     if (timeOfCurrentDay.length == 2) {
  //       const indexItemNeedDelete = old
  //         .map((_item) => _item.day == dateView)
  //         .lastIndexOf(true);
  //       return [
  //         timePickByDay,
  //         ...old.filter((_item, index) => index != indexItemNeedDelete),
  //       ];
  //     }
  //     return [timePickByDay, ...old];
  //   });
  // };

  const renderDurationBtn = (item) => {
    const isActive = item?.time_duration == duration;
    return (
      <PressableBtn
        onPress={() => onSelectDuration(item)}
        style={[styles.durationBtn, isActive && styles.durationBtnActive]}
      >
        <Text style={[styles.txtBtn, isActive && styles.txtBtnActive]}>
          {item.label}
          {item?.value}
        </Text>
      </PressableBtn>
    );
  };

  const renderSectionDuration = () => {
    const times = data.find((item) => item.value == dateView).times;
    return (
      <View style={styles.selectBox}>
        <Text style={styles.label}>{translations.purchase.timeDuration}</Text>
        <View style={CS.flexRear}>
          {times.map((item) => renderDurationBtn(item))}
        </View>
      </View>
    );
  };

  const renderDayBtn = (item) => {
    const isActive = day.find((_item) => _item.day == item?.value);
    const isSelect = item?.value == dateView;
    const isDisabled = isMaxDay && !isActive;
    return (
      <PressableBtn
        disable={isDisabled}
        onPress={() => onSelectDateView(item, isActive)}
        style={[
          styles.dateBtn,
          isActive && styles.durationBtnActive,
          isDisabled && { opacity: 0.7 },
          // isSelect && styles.btnSelectedHour,
        ]}
      >
        <Text style={[styles.txtBtn, isActive && styles.txtBtnActive]}>
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

  const renderSectionDate = () => {
    return (
      <View style={styles.selectBox}>
        <Text style={[styles.label, { marginBottom: 0 }]}>
          {translations.purchase.chooseDay}
        </Text>
        <Text style={styles.des}>{translations.purchase.chooseDayDes}</Text>
        <View style={CS.flexRear}>
          {daysOfWeek.map((item) => renderDayBtn(item))}
        </View>
        <Text style={[styles.des, { marginTop: 8 }]}>
          {translations.purchase.timeNote}
        </Text>
      </View>
    );
  };

  const renderTimeBtn = (item) => {
    // const isActive = false
    const isDisabled = item?.is_picked;
    // const timeOfCurrentDay = day.filter((_item) => _item.day == dateView);
    // const isActive = timeOfCurrentDay.find(
    //   (_item) => item.label == _item.time_start + " - " + _item.time_end,
    // );
    return (
      <>
        {!!item.extraLabel && (
          <Text style={{ ...styles.text, marginBottom: 8 }}>
            {item.extraLabel}
          </Text>
        )}
        <PressableBtn
          disable={isDisabled}
          // onPress={() => onSelectTimeStart(item, isActive)}
          style={[styles.hourBtn, isDisabled && styles.hourActiveBtn]}
        >
          <Text style={styles.text}>{item.label}</Text>
          {/* <View
            style={[
              styles.checkbox,
              isDisabled && styles.checkBoxDisable,
              isActive && styles.checkBoxActive,
            ]}
          >
            {isActive && (
              <IconBtn color={palette.white} size={16} name="check" />
            )}
          </View> */}
        </PressableBtn>
      </>
    );
  };

  const renderSectionTime = () => {
    const times = data?.find((item) => item.value == dateView)?.times || [];
    const timesAvailable = getLabelHourLesson(
      times?.[duration - 1]?.times_in_utc || [],
    );

    return (
      <View style={styles.selectBox}>
        {timesAvailable.map((item) => renderTimeBtn(item))}
        <Text style={styles.des}>{translations.purchase.hoursNote}</Text>
      </View>
    );
  };

  if (!isShow) return null;
  if (loading) return <LoadingList numberItem={3} />;
  if (!data?.length) return null;

  return (
    <ScrollView style={styles.container}>
      {renderSectionDuration()}
      {renderSectionDate()}
      {renderSectionTime()}
    </ScrollView>
  );
};

export default React.memo(BookLessonSelectView);
