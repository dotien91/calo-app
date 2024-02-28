import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./choose.class.style";
import CS from "@theme/styles";
import IconBtn from "@shared-components/button/IconBtn";
import { IClass } from "models/course.model";
import { getCourseClassListById } from "@services/api/course.api";
import { formatVNDate, getDayOfWeek } from "@utils/date.utils";

interface ChooseClassSelectViewProps {
  course_id: string;
}

const ChooseClassSelectView: React.FC<ChooseClassSelectViewProps> = ({
  course_id,
}: ChooseClassSelectViewProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [classData, setClassData] = React.useState(null);
  console.log("classDataclassData", classData);
  React.useEffect(() => {
    getCourseClassListById(course_id).then((res) => {
      if (!res.isError) {
        // console.log("res...", JSON.stringify(res));
        setClassData(res.data);
      }
    });
  }, []);

  const renderClass = (item: IClass, index: number) => {
    const isActive = false;
    const isDisabled = false;
    const colorIcon = isDisabled ? colors.textOpacity4 : colors.text;
    return (
      <View
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
              {formatVNDate(item.start_time) +
                " - " +
                formatVNDate(item.end_time)}
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
              {v.time_start}-{v.time_end} {getDayOfWeek(v.day)}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {classData?.map((item, index) => renderClass(item, index))}
    </ScrollView>
  );
};

export default React.memo(ChooseClassSelectView);
