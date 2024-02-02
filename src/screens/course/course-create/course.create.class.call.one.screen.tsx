import React, { useMemo, useState } from "react";
import { Text, View, ScrollView } from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";
import { getBottomSpace } from "react-native-iphone-screen-helper";

import Header from "@shared-components/header/Header";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import { daysOfWeek, timeFullWeek } from "constants/course.constant";
import CS from "@theme/styles";
import createStyles from "./course.create.class.style";
import { getLabelHourLesson } from "@screens/course-tab/course.helper";
import Button from "@shared-components/button/Button";
import useStore from "@services/zustand/store";
import { createTimeAvailableTeacher } from "@services/api/course.api";
import { showToast } from "@helpers/super.modal.helper";

interface ITimeSelected {
  day: number;
  time_start: string;
  duration: number;
}

const CreateClassCallOneScreen = () => {
  const theme = useTheme();
  const { colors } = theme;
  const route = useRoute();

  const course_id = route.params?.["course_id"];

  const [timeSelected, setTimeSelected] = useState<ITimeSelected[]>([]);
  const [date, setDate] = useState<number>(0);
  const [updating, setUpdating] = useState(false);
  const userData = useStore((store) => store.userData);

  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const renderSelectDate = () => {
    const onSelectDate = (item) => {
      setDate(item.value);
    };

    const renderDateBtn = (item) => {
      const isSelect = item.value === date;
      return (
        <PressableBtn
          onPress={() => onSelectDate(item)}
          style={isSelect ? styles.durationBtnSelected : styles.durationBtn}
        >
          <Text style={styles.txtBtn}>{item.label}</Text>
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
        duration: 1,
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
                indexSelected >= 0 ? colors.backgroundMain : colors.white,
            },
          ]}
        >
          <Text style={styles.text}>{item.label}</Text>
        </PressableBtn>
      </>
    );
  };
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
    const data = {
      course_id: course_id,
      user_id: userData?._id,
      time_available: timeSelected,
    };
    setUpdating(true);
    createTimeAvailableTeacher(data).then((res) => {
      console.log(res);
      if (!res.isError) {
        setUpdating(false);
        showToast({
          type: "success",
          message: translations.course.createModuleSuccess,
        });
      } else {
        setUpdating(false);
        showToast({ type: "error", message: res.message });
      }
    });
  };

  return (
    <View style={[CS.safeAreaView, { marginBottom: getBottomSpace() }]}>
      <Header text={translations.course.timeAvailable} />
      <View style={{ paddingHorizontal: 16 }}>{renderSelectDate()}</View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 16 }}
      >
        {renderSelectHours}
      </ScrollView>
      <Button
        style={{
          marginHorizontal: 16,
          marginTop: 8,
          backgroundColor: updating ? colors.placeholder : colors.primary,
        }}
        text={translations.save}
        disabled={updating}
        onPress={_submitTime}
      />
    </View>
  );
};

export default CreateClassCallOneScreen;
