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
import {
  getCourseClassListById,
  getCourseRoom,
} from "@services/api/course.api";
import { formatVNDate, getDayOfWeek } from "@utils/date.utils";
import useStore from "@services/zustand/store";

interface ChooseClassSelectViewProps {
  course_id: string;
  isShow: boolean;
}

const ChooseClassSelectView: React.FC<ChooseClassSelectViewProps> = ({
  isShow,
  course_id,
}: ChooseClassSelectViewProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [classData, setClassData] = React.useState(null);

  React.useEffect(() => {
    getCourseClassListById(course_id).then((res) => {
      if (!res.isError) {
        console.log("class id", res.data);
        setClassData(res.data);
      }
    });
  }, []);

  if (!isShow) return null;

  return (
    <ScrollView style={styles.container}>
      {classData?.map((item, index) => (
        <ClassItem course_id={course_id} item={item} key={index} />
      ))}
    </ScrollView>
  );
};

const ClassItem = ({
  course_id,
  item,
}: {
  course_id: string;
  item: IClass;
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const isActive = false;
  const isDisabled = false;
  const colorIcon = isDisabled ? colors.textOpacity4 : colors.text;
  const [courseRoom, setCourseRoom] = React.useState();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const userData = useStore((state) => state.userData);

  const _getCourseRoom = () => {
    getCourseRoom({
      course_id,
      user_id: userData?._id,
      class_id: item._id,
    }).then((res) => {
      if (!res.isError) {
        const data = res.data;
        //eslint-disable-next-line
        const roomId = (data?.redirect_url || "").match(/[^\/]+$/)?.[0];
        setCourseRoom({
          roomId,
          chatRoomId: data?.chat_room_id,
        });
      }
    });
  };

  console.log("courseRoomcourseRoom", courseRoom);

  React.useEffect(() => {
    _getCourseRoom();
  }, []);

  return (
    <View
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

export default React.memo(ChooseClassSelectView);
