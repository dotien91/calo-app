import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./book.lesson.styles";
import { exampleData, daysOfWeek } from "constants/course.constant";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import CS from "@theme/styles";
import { getLabelHourLesson } from "@screens/course/course.helper";
import IconBtn from "@shared-components/button/IconBtn";
import { palette } from "@theme/themes";

const times = exampleData[0].times;

interface BookLessonSelectViewProps {}

const BookLessonSelectView: React.FC<BookLessonSelectViewProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [duration, setDuration] = useState<number>(1);
  const [date, setDate] = useState<number>(0);

  const onSelectDate = () => {
    setDate(2);
  };

  const onSelectDuration = () => {
    setDuration(2);
  };

  const onSelectHour = () => {};

  const renderDurationBtn = () => {
    return (
      <PressableBtn
        onPress={() => onSelectDuration(item)}
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
      <View style={styles.selectBox}>
        <Text style={styles.label}>{translations.purchase.timeDuration}</Text>
        <View style={CS.flexRear}>
          {times.map((item) => renderDurationBtn(item))}
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
          {daysOfWeek.map((item) => renderDateBtn(item))}
        </View>
        <Text style={[styles.des, { marginTop: 8 }]}>
          {translations.purchase.timeNote}
        </Text>
      </View>
    );
  };

  const renderHourBtn = (item) => {
    const isPicked = item?.is_picked;
    const isDisabled = false;
    return (
      <>
        {!!item.extraLabel && (
          <Text style={{ ...styles.text, marginBottom: 8 }}>
            {item.extraLabel}
          </Text>
        )}
        <TouchableOpacity
          onPress={() => onSelectHour(item)}
          style={[styles.hourBtn, isDisabled && styles.hourActiveBtn]}
        >
          <Text style={styles.text}>{item.label}</Text>
          <View
            style={[
              styles.checkbox,
              isDisabled && styles.checkBoxDisable,
              isPicked && styles.checkBoxActive,
            ]}
          >
            {isPicked && (
              <IconBtn color={palette.white} size={16} name="check" />
            )}
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const renderSelectHours = useMemo(() => {
    const data = exampleData[date].times[duration].times_in_utc;
    const dataWithLabel = getLabelHourLesson(data);
    return (
      <View style={styles.selectBox}>
        {dataWithLabel.map((item) => renderHourBtn(item))}
        <Text style={styles.des}>{translations.purchase.hoursNote}</Text>
      </View>
    );
  }, [duration, date]);

  const renderPurchaseBtn = () => {
    return (
      <PressableBtn style={styles.btnPurchase}>
        <Text style={styles.txtPurchaseBtn}>
          {translations.purchase.orderNow}
        </Text>
      </PressableBtn>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderSelectDuration()}
      {renderSelectDate()}
      {renderSelectHours}
      {renderPurchaseBtn()}
    </ScrollView>
  );
};

export default React.memo(BookLessonSelectView);
