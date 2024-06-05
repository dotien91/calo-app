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
  createTimeAvailableTeacher,
  _getTimeAvailableTeacher,
  updateTimeAvailableTeacher,
} from "@services/api/course.api";
import { showToast } from "@helpers/super.modal.helper";

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
  const [updataTime, setUpdateTime] = useState(false);
  const userData = useStore((store) => store.userData);

  const addOneHour = (timeStr) => {
    // Split the input time string into hours and minutes
    const [hours, minutes] = timeStr.split(":").map(Number);

    // Create a new Date object with the given time
    const time = new Date();
    time.setHours(hours);
    time.setMinutes(minutes);

    // Add one hour
    time.setHours(time.getHours() + 1);

    // Format the result
    const result = `${(time.getHours() + "").padStart(2, "0") + ""}:${
      (time.getMinutes() + "").padStart(2, "0") + ""
    }`;
    console.log("result", result);
    return result;
  };

  useEffect(() => {
    const _getTimeAvailable = () => {
      const params = {
        user_id: userData?._id,
      };
      _getTimeAvailableTeacher(params).then((res) => {
        if (!res.isError) {
          // console.log("res.s..", JSON.stringify(res.data));
          if (res.data.time_available.length > 0) {
            setUpdateTime(true);
            // lấy data gen lại ở đây
            const mapTime = res.data.time_available.map(
              (item: ITimeSelected) => {
                return {
                  day: item.day,
                  time_start: item.time_start,
                  time_end: addOneHour(item.time_start),
                  duration: 1,
                };
              },
            );
            setTimeSelected(mapTime);
          }
        }
      });
    };
    _getTimeAvailable();
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
      user_id: userData?._id,
      time_available: timeSelected,
    };
    setUpdating(true);
    if (!updataTime) {
      createTimeAvailableTeacher(data).then((res) => {
        console.log(res);
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
    } else {
      updateTimeAvailableTeacher(data).then((res) => {
        console.log(res);
        if (!res.isError) {
          setUpdating(false);
          showToast({
            type: "success",
            message: translations.course.updateModuleSuccess,
          });
          NavigationService.goBack();
        } else {
          setUpdating(false);
          showToast({ type: "error", message: res.message });
        }
      });
    }
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
