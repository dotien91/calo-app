import * as React from "react";
import { Text, StyleSheet, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import { EnumClassType, ICourseItem } from "models/course.model";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { SCREENS } from "constants";
import { getCourseRoomV2, getPlanDetail } from "@services/api/course.api";
import useStore from "@services/zustand/store";

interface EnrollNowProps {
  data?: ICourseItem;
  course_id?: string;
  courseRoom: any;
  fromBottom: boolean;
}

const EnrollNow = ({
  data,
  course_id,
  courseRoom,
  fromBottom,
}: EnrollNowProps) => {
  const [event, setEvent] = React.useState(null);

  const userData = useStore((state) => state.userData);

  React.useEffect(() => {
    getInfoCall();
  }, []);

  const getInfoCall = () => {
    if (!userData?._id) return;
    getPlanDetail({
      student_id: userData?._id,
      teacher_id: data?.user_id._id,
      course_id: data?._id,
    }).then((res) => {
      if (!res.isError) {
        const event = res.data;
        console.log("data", data);
        getCourseRoomV2({
          course_plan_student_id: event?._id,
          student_id: event?.student_id?._id,
          teacher_id: event?.teacher_id?._id,
        }).then((_res) => {
          if (!res.isError) {
            const roomId = (_res.data?.redirect_url || "").match(
              /[^\/]+$/,
            )?.[0];
            const courseRoom = {
              roomId,
              chatRoomId: _res.data?.chat_room_id,
              classId: _res.data?._id,
            };
            const isMakeCall = event?.teacher_id?._id == userData?._id;
            setEvent({
              event: {
                ...event,
                course_name: data?.title,
                partner_id: isMakeCall ? event.student_id : event.teacher_id,
              },
              courseRoom,
              isMakeCall,
            });
          }
        });
      }
    });
  };

  const _goToListVideo = () => {
    console.log("courseRoomcourseRoom", courseRoom);
    if (data?.type == EnumClassType.SelfLearning) {
      NavigationService.navigate(SCREENS.COURSE_LEARN_VIDEO_SCREEN, {
        course_id: course_id,
        courseData: data,
      });
    } else if (data?.type == EnumClassType.Call11) {
      if (!event) return;
      console.log("eventevent", event);
      NavigationService.navigate(SCREENS.ONEONE_SCREEN, event);
    } else {
      NavigationService.navigate(SCREENS.CALL_CLASS, {
        course_id: course_id,
        courseData: data,
        courseRoom,
      });
    }
  };

  const _goToHomeWork = () => {
    NavigationService.navigate(SCREENS.CLASSHOMEWORK, {
      course_id: course_id,
      courseData: data,
      class_id: data?.classes?.[0]?._id,
    });
  };

  return (
    <View style={[{ marginHorizontal: 16 }, fromBottom && CS.flexRear]}>
      {(data?.type == EnumClassType.SelfLearning || !!courseRoom?.roomId) && (
        <PressableBtn onPress={_goToListVideo} style={styles.containerFull}>
          <Text style={styles.textBtn}>{translations.course.enrollNow}</Text>
        </PressableBtn>
      )}
      {fromBottom && <View style={{ width: 12 }} />}
      {data?.type == EnumClassType.CallGroup && (
        <PressableBtn onPress={_goToHomeWork} style={styles.viewHomeWorkBtn}>
          <Text style={styles.textBtn2}>
            {translations.course.viewHomework}
          </Text>
        </PressableBtn>
      )}
    </View>
  );
};

export default EnrollNow;

const styles = StyleSheet.create({
  containerFull: {
    ...CS.center,
    marginTop: 8,
    backgroundColor: palette.primary,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  viewHomeWorkBtn: {
    ...CS.center,
    marginTop: 8,
    backgroundColor: palette.white,
    ...CS.borderStyle,
    borderColor: palette.primary,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  textBtn2: {
    ...CS.hnSemiBold,
    color: palette.primary,
  },
  textBtn: {
    ...CS.hnSemiBold,
    color: palette.btnLight,
  },
});
