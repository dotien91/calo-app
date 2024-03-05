import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./book.lesson.styles";
import {
  TimeAvailableType,
  TypeTimeAvailableRes,
} from "constants/course.constant";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import CS from "@theme/styles";
import { getLabelHourLesson } from "@screens/course-tab/course.helper";
import { getTimeAvailable } from "@services/api/course.api";

interface BookLessonSelectViewProps {
  course_id: string;
  isShow: string;
}

const BookLessonSelectView = ({
  course_id,
  isShow,
}: BookLessonSelectViewProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [duration, setDuration] = useState<number>(0);
  const [date, setDate] = useState<number>(0);
  const [timeDataRes, setTimeDataRes] = useState<TypeTimeAvailableRes[]>();
  const [timeAvailable, setTimeAvailable] = useState<TimeAvailableType[]>([]);

  useEffect(() => {
    _getTimeAvailable();
  }, []);

  const _getTimeAvailable = () => {
    const params = {
      course_id: course_id,
    };
    getTimeAvailable(params).then((res: any) => {
      if (!res.isError) {
        setTimeDataRes(res.data);
        setTimeAvailable(res.data[0].times);
      }
    });
  };

  if (!timeAvailable.length || !timeDataRes?.length) return null;

  const onSelectDate = () => {
    setDate(2);
  };

  const onSelectDuration = (index) => {
    setDuration(index);
  };

  const renderDurationBtn = (item, index) => {
    return (
      <PressableBtn
        onPress={() => onSelectDuration(index)}
        style={styles.durationBtn}
      >
        <Text style={styles.txtBtn}>{item.label}</Text>
      </PressableBtn>
    );
  };

  const renderDateBtn = (item) => {
    return (
      <PressableBtn
        onPress={() => onSelectDate(item)}
        style={styles.durationBtn}
      >
        <Text style={styles.txtBtn}>{item.label}</Text>
      </PressableBtn>
    );
  };

  const renderSelectDuration = () => {
    return (
      <View style={[styles.container, { paddingHorizontal: 0 }]}>
        <Text style={styles.label}>{translations.purchase.timeDuration}</Text>
        <View style={[CS.flexRear]}>
          {timeAvailable?.map((item, index) => renderDurationBtn(item, index))}
        </View>
      </View>
    );
  };

  const renderSelectDate = () => {
    return (
      <View style={styles.selectBox}>
        <Text style={[styles.label, { marginBottom: 0 }]}>
          {translations.purchase.chooseDay}
        </Text>
        <Text style={styles.des}>{translations.purchase.chooseDayDes}</Text>
        <View style={CS.flexRear}>
          {timeDataRes?.map((item) => renderDateBtn(item))}
        </View>
        <Text style={[styles.des, { marginTop: 8 }]}>
          {translations.purchase.timeNote}
        </Text>
      </View>
    );
  };

  const renderHourBtn = (item) => {
    const isDisabled = false;
    return (
      <>
        {!!item.extraLabel && (
          <Text style={{ ...styles.text, marginBottom: 8 }}>
            {item.extraLabel}
          </Text>
        )}
        <View style={[styles.hourBtn, isDisabled && styles.hourActiveBtn]}>
          <Text style={styles.text}>{item.label}</Text>
        </View>
      </>
    );
  };

  const renderSelectHours = () => {
    const data = timeDataRes?.[date]?.times[duration].times_in_utc;
    const dataWithLabel = getLabelHourLesson(data);
    return (
      <View style={styles.selectBox}>
        {dataWithLabel?.map((item) => renderHourBtn(item))}
      </View>
    );
  };

  if (!isShow) return null;

  return (
    <ScrollView style={styles.container}>
      {renderSelectDate()}
      {renderSelectDuration()}
      {renderSelectHours()}
    </ScrollView>
  );
};

export default React.memo(BookLessonSelectView);
