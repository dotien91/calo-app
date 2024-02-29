import { Text, View } from "react-native";
import React, { useMemo } from "react";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import IconBtn from "@shared-components/button/IconBtn";
import createStyles from "./style.class.home.work";
import { useTheme } from "@react-navigation/native";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { deleteThread } from "@services/api/course.api";
import eventEmitter from "@services/event-emitter";
import { SCREENS } from "constants";
import { formatFullDate } from "@utils/date.utils";

interface IData {
  thread_content: string;
  thread_title: string;
  createdAt: string;
}

interface TaskItemProps {
  showMore: boolean;
  data: IData;
}

const TaskItem = ({ data, showMore }: TaskItemProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;

  const gotoTaskDetail = () => {
    NavigationService.navigate(SCREENS.DETAIL_TASK, {
      data,
    });
  };

  const deleteTask = () => {
    deleteThread(data._id, {
      "Class-ID": data.class_id,
    }).then((res) => {
      if (!res.isError) {
        eventEmitter.emit("reload_data");
        showToast({
          message: translations.homework.deleteTaskSuccess,
        });
      }
    });
    closeSuperModal();
  };

  const editTask = () => {
    NavigationService.navigate(SCREENS.CREATE_WORK, {
      defaultData: data,
    });
    closeSuperModal();
  };

  const showMoreAction = () => {
    showSuperModal({
      styleModalType: EnumStyleModalType.Bottom,
      contentModalType: EnumModalContentType.ListMoreAction,
      data: {
        hideCloseIcon: true,
        options: [
          {
            onPress: editTask,
            nameIcon: "edit",
            text: translations.edit,
          },
          {
            onPress: deleteTask,
            nameIcon: "trash",
            text: translations.delete,
          },
        ],
      },
    });
  };

  return (
    <PressableBtn onPress={gotoTaskDetail} style={styles.taskBox}>
      <View style={styles.taskInner}>
        <View style={styles.wrapIconTask}>
          <IconBtn name="file" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>{data.thread_title}</Text>
          <Text style={styles.text64}>{formatFullDate(data.createdAt)}</Text>
        </View>
      </View>
      {showMore && (
        <View style={styles.moreIcon}>
          <IconBtn
            name={"more-vertical"}
            color={colors.textOpacity6}
            onPress={showMoreAction}
          />
        </View>
      )}
    </PressableBtn>
  );
};

export default TaskItem;
