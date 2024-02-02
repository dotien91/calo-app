import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import moment from "moment";
import lodash from "lodash";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local Imports
 */
import createStyles from "./choose.class.style";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import CS from "@theme/styles";
import IconBtn from "@shared-components/button/IconBtn";
import { IClassRoom, ICourseItem } from "models/course.model";
import { SCREENS } from "constants";

interface ChooseClassSelectViewProps {
  classData: IClassRoom[];
  courseData: ICourseItem;
}

const ChooseClassSelectView: React.FC<ChooseClassSelectViewProps> = ({
  classData,
  courseData,
}: ChooseClassSelectViewProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [selectedClass, setSelectedClass] = React.useState({});

  const onSelectedClass = (item: IClassRoom, isActive: boolean) => {
    setSelectedClass(isActive ? {} : item);
  };

  const renderClass = (item: IClassRoom, index: number) => {
    const isActive = selectedClass._id == item._id;
    const isDisabled = item.limit_member == item.members.length;
    const colorIcon = isDisabled ? colors.textOpacity4 : colors.text;

    return (
      <PressableBtn
        onPress={() => onSelectedClass(item, isActive)}
        disable={isDisabled}
        key={index}
        style={[
          styles.classBox,
          isDisabled && styles.classBoxDisabled,
          isActive && styles.classBoxActive,
        ]}
      >
        <View style={styles.numberWrap}>
          <Text
            style={[
              styles.titleClass,
              isDisabled && { color: colors.textOpacity4 },
            ]}
          >
            {item?.name}
          </Text>
          <View style={CS.flexStart}>
            <IconBtn
              name={"user"}
              color={colorIcon}
              customStyle={{ marginRight: 8 }}
            />
            <Text style={styles.text}>
              {item.members.length + "/" + item.limit_member}
            </Text>
          </View>

          <View style={CS.flexStart}>
            <IconBtn
              color={colorIcon}
              name={"calendar"}
              customStyle={{ marginRight: 8 }}
            />
            <Text style={styles.text}>
              {moment(item.start_time).format("HH:mm DD/MM/YY") +
                " - " +
                moment(item.end_time).format("HH:mm DD/MM/YY")}
            </Text>
          </View>
        </View>
        <View style={styles.calendarWrap}>
          {item?.course_calendar_ids?.map((v, index) => (
            <Text
              key={index}
              style={[
                styles.calendarTxt,
                isDisabled && { color: colors.textOpacity4 },
              ]}
            >
              {v.time_start}-{v.time_end}
            </Text>
          ))}
        </View>
      </PressableBtn>
    );
  };

  const goToCheckout = () => {
    const timePick = {
      name: selectedClass?.name,
      end_time: selectedClass?.end_time,
      course_id: selectedClass?.course_id,
      start_time: selectedClass?.start_time,
      limit_member: selectedClass?.limit_member,
      course_calendars: selectedClass?.course_calendar_ids,
      _id: selectedClass?._id,
    };
    NavigationService.navigate(SCREENS.PAYMENT_COURES, {
      courseData,
      timePick,
      duration: selectedClass?.course_calendar_ids?.[0]?.time_duration,
    });
  };
  const renderPurchaseBtn = () => {
    const isDisabled = lodash.isEmpty(selectedClass);
    return (
      <PressableBtn
        onPress={goToCheckout}
        disable={isDisabled}
        style={[
          styles.btnPurchase,
          isDisabled && { backgroundColor: colors.btnInactive },
        ]}
      >
        <Text
          style={[
            styles.txtPurchaseBtn,
            isDisabled && { color: colors.textOpacity4 },
          ]}
        >
          {translations.purchase.orderNow}
        </Text>
      </PressableBtn>
    );
  };

  console.log("classDataclassData", classData);

  return (
    <ScrollView style={styles.container}>
      {classData.map((item, index) => renderClass(item, index))}
      {renderPurchaseBtn()}
    </ScrollView>
  );
};

export default React.memo(ChooseClassSelectView);
