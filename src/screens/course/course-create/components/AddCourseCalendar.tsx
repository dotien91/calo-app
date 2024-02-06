import * as React from "react";
import { Text, View } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import SelectTime from "./TimePicker";
import { useTheme } from "@react-navigation/native";
import createStyles from "./select.time.style";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import CS from "@theme/styles";
import Button from "@shared-components/button/Button";
import { daysOfWeek } from "constants/course.constant";
import { palette } from "@theme/themes";
import { formatTimeHHMM, getDayOfWeek } from "@utils/date.utils";
import { showToast } from "@helpers/super.modal.helper";

interface CourseAddType {
  time_duration: number;
  day: number;
  time_start: string;
}

interface ItemTimeType {
  time_duration: number;
  label: string;
}

interface ItemDate {
  value: number;
  label: string;
}

const times: ItemTimeType[] = [
  { time_duration: 1, label: "1 hour" },
  { time_duration: 2, label: "2 hour" },
  { time_duration: 3, label: "3 hour" },
];

// const AddCourseCalenDar = ({ saveCourse }: AddCourseCalenDarProps) => {
const AddCourseCalenDar = () => {
  const [timeSelect, setTimeSelect] = React.useState<Date>();
  const [durationSelected, setDurationSelected] =
    React.useState<ItemTimeType>();
  const [date, setDate] = React.useState<ItemDate>();
  const [courseCalendar, setCourseCalendar] = React.useState<CourseAddType[]>(
    [],
  );
  const [isAdding, setIsAdding] = React.useState<boolean>();

  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const { colors } = theme;
  const _addCourseCalendar = () => {
    if (!durationSelected || !timeSelect || !date) {
      showToast({ type: "error", message: "Chọn đầy đủ thông tin" });
    } else {
      const course = {
        time_duration: durationSelected.time_duration,
        day: date.value,
        time_start: formatTimeHHMM(timeSelect),
      };
      setCourseCalendar([...courseCalendar, course]);
      setIsAdding(false);
    }
  };
  const _cancel = () => {
    setIsAdding(false);
  };

  const _viewAddCourseCalendars = () => {
    setIsAdding(true);
  };

  const renderListCourseCalendar = () => {
    return (
      <View>
        <Text style={[CS.hnSemiBold, { marginTop: 8 }]}>Lịch học</Text>
        {/* render lịch đã chọn */}

        {courseCalendar.map((item, index) => {
          const _clearItem = () => {
            setCourseCalendar([
              ...courseCalendar.filter(
                (iteminLis) => iteminLis.day !== item.day,
              ),
            ]);
          };
          return (
            <View
              key={index}
              style={{
                borderWidth: 1,
                marginTop: 8,
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
            >
              <Text style={styles.txtClass}>day: {getDayOfWeek(item.day)}</Text>
              <Text style={styles.txtClass}>
                duration: {item.time_duration} h
              </Text>
              <Text style={styles.txtClass}>time start: {item.time_start}</Text>
              <PressableBtn
                onPress={_clearItem}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  zIndex: 1,
                }}
              >
                <Icon size={30} name="close-outline" type={IconType.Ionicons} />
              </PressableBtn>
            </View>
          );
        })}

        {!isAdding && (
          <PressableBtn
            style={{
              backgroundColor: palette.backgroundMain,
              height: 40,
              ...CS.center,
              marginTop: 8,
              borderRadius: 8,
            }}
            onPress={_viewAddCourseCalendars}
          >
            <Text style={[CS.hnRegular, { color: colors.white }]}>
              {"Thêm buổi học"}
            </Text>
          </PressableBtn>
        )}
      </View>
    );
  };

  const SelectDuration = () => {
    const renderDurationBtn = (item: ItemTimeType) => {
      const _onSelectDuration = () => {
        setDurationSelected(item);
      };
      const isSeleted = durationSelected?.label === item.label;
      return (
        <PressableBtn
          onPress={_onSelectDuration}
          style={[
            styles.durationBtn,
            isSeleted && { backgroundColor: palette.primary },
          ]}
        >
          <Text style={[styles.txtBtn]}>{item.label}</Text>
        </PressableBtn>
      );
    };

    return (
      <View style={styles.selectBox}>
        <Text style={styles.label}>{translations.purchase.timeDuration}</Text>
        <View style={CS.flexRear}>
          {times.map((item) => renderDurationBtn(item))}
        </View>
      </View>
    );
  };

  const SelectDate = () => {
    const theme = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    const onSelectDate = (item: ItemDate) => {
      setDate(item);
    };

    const renderDateBtn = (item: ItemDate) => {
      const isSelect = item.label === date?.label;
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

  const renderViewAdd = () => {
    return (
      <>
        <View style={{}}>
          <SelectTime
            placeholder="Thời gian bắt đầu"
            setTime={setTimeSelect}
            style={{}}
          />
          <SelectDuration />
          <SelectDate />
          <View style={[CS.row, { gap: 8 }]}>
            <Button
              style={{ height: 48, flex: 1 }}
              backgroundColor={colors.backgroundMain}
              onPress={_addCourseCalendar}
              text="Thêm"
              disabled={false}
            />
            <Button
              style={{ height: 48, flex: 1 }}
              backgroundColor={colors.backgroundMain}
              onPress={_cancel}
              text="Huỷ"
              disabled={false}
            />
          </View>
        </View>
      </>
    );
  };
  return {
    renderViewAdd,
    renderListCourseCalendar,
    isAdding,
    courseCalendar,
    setCourseCalendar,
  };
};

export default AddCourseCalenDar;
