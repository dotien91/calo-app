import { Text, View, StyleSheet } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { SCREENS } from "constants";
import { EnumClassType, ICourseItem } from "models/course.model";
import * as React from "react";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import CS from "@theme/styles";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
  showWarningLogin,
} from "@helpers/super.modal.helper";
import useStore from "@services/zustand/store";
import IconSvg from "assets/svg";
import { palette } from "@theme/themes";
import { deleteCourse } from "@services/api/course.api";
import eventEmitter from "@services/event-emitter";

interface PopupCourseDetailProps {
  isTeacher: boolean;
  dataCourse: ICourseItem;
}

const PopupCourseDetail = ({
  isTeacher,
  dataCourse,
  courseRoom,
}: PopupCourseDetailProps) => {
  const userData = useStore((state) => state.userData);
  const goToEditCourse = () => {
    closeSuperModal();
    NavigationService.navigate(SCREENS.COURSE_CREATE, {
      course_id: dataCourse?._id,
      data: dataCourse,
    });
  };

  const isJoined = dataCourse.is_join || false;
  const showHomeWork =
    dataCourse.type === "Call 1-1" || dataCourse.type === "Call group";
  const isDraf = dataCourse?.public_status === "draft";

  const gotoUpdateModules = () => {
    if (dataCourse?.type === "Call group") {
      NavigationService.navigate(SCREENS.COURSE_LIST_CLASS, {
        course_id: dataCourse?._id,
        start_time: dataCourse.start_time,
        end_time: dataCourse.end_time,
      });
    }
    if (dataCourse?.type === "Call 1-1") {
      NavigationService.navigate(SCREENS.COURSE_CREATE_CALENDAR_CALL, {
        course_id: dataCourse?._id,
      });
    }
    if (dataCourse?.type === "Self-learning") {
      NavigationService.navigate(SCREENS.COURSE_LIST_MODULE, {
        course_id: dataCourse?._id,
      });
    }
    closeSuperModal();
  };

  const applyCoupon = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.AddCouponToCourse,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        dataCourse: dataCourse,
        hideCloseIcon: true,
      },
    });
  };
  const publicCourse = () => {};
  const goToClassRoom = () => {
    const classes = (dataCourse?.classes || []).map((_item) => ({
      courseData: dataCourse,
      ..._item,
      title: dataCourse?.title,
      type: dataCourse?.type,
    }));
    showSuperModal({
      contentModalType: EnumModalContentType.TeacherClass,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        listData: classes,
        hideCloseIcon: true,
      },
    });
  };

  const goToChat = () => {
    NavigationService.navigate(SCREENS.CHAT_ROOM, {
      id: courseRoom?.chatRoomId,
    });
    closeSuperModal();
  };
  const goToHomeWork = () => {
    NavigationService.navigate(SCREENS.CLASSHOMEWORK, {
      course_id: dataCourse?._id,
      courseData: dataCourse,
      class_id: courseRoom?.classId,
    });
  };
  const _deleteCourse = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        title: translations.course.warningDelete,
        cb: () =>
          deleteCourse(dataCourse._id).then((res) => {
            if (!res.isError) {
              NavigationService.goBack();
              closeSuperModal();
              showToast({
                type: "success",
                message: translations.course.deleteCourseSuccess,
              });
              eventEmitter.emit("reload_list_course");
            }
          }),
      },
    });
  };
  const reportCourse = () => {
    if (userData?._id) {
      showSuperModal({
        contentModalType: EnumModalContentType.Report,
        styleModalType: EnumStyleModalType.Bottom,
        data: {
          report_type: "course",
          partner_id: dataCourse?.user_id?._id,
        },
      });
    } else {
      showWarningLogin();
    }
  };

  const ItemPopup = ({
    onPress,
    title,
    icName = "",
  }: {
    onPress: () => void;
    title: string;
    icName?: string;
  }) => {
    return (
      <PressableBtn onPress={onPress} style={styles.containerFull}>
        <View style={styles.viewItem}>
          <IconSvg name={icName} size={20} color={palette.text} />
        </View>
        <Text style={styles.textBtn}>{title}</Text>
      </PressableBtn>
    );
  };

  return (
    <View style={styles.container}>
      {isTeacher && (
        <ItemPopup
          icName="iconEdit"
          onPress={goToEditCourse}
          title={translations.edit}
        />
      )}
      {isTeacher && (
        <ItemPopup
          icName="icAdd"
          onPress={gotoUpdateModules}
          title={translations.course.updateModule}
        />
      )}
      {isTeacher && (
        <ItemPopup
          icName="iconCoupon"
          onPress={applyCoupon}
          title={translations.coupon.applyCoupon}
        />
      )}
      {isTeacher && isDraf && (
        <ItemPopup
          icName="iconPublish"
          onPress={publicCourse}
          title={translations.course.publicCourse}
        />
      )}
      {isTeacher && showHomeWork && (
        <ItemPopup
          icName="iconGoto"
          onPress={goToClassRoom}
          title={translations.course.manageClass}
        />
      )}
      {isJoined && (
        <ItemPopup
          icName="icMessage"
          onPress={goToChat}
          title={translations.profile.chat}
        />
      )}
      {isJoined &&
        showHomeWork &&
        dataCourse.type == EnumClassType.CallGroup && (
          <ItemPopup
            icName="icCourse"
            onPress={goToHomeWork}
            title={translations.homework.header}
          />
        )}
      {isTeacher && (
        <ItemPopup
          icName="iconRemove"
          onPress={_deleteCourse}
          title={translations.course.delete}
        />
      )}
      {!isTeacher && (
        <ItemPopup
          icName="iconFlag"
          onPress={reportCourse}
          title={translations.course.report}
        />
      )}
    </View>
  );
};

export default PopupCourseDetail;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 30,
  },
  containerFull: {
    ...CS.row,
    height: 40,
    gap: 8,
  },
  textBtn: {
    ...CS.hnRegular,
    flex: 1,
  },
  viewItem: {
    width: 40,
    height: 40,
    ...CS.center,
  },
});
