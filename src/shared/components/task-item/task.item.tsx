import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import * as Progress from "react-native-progress";

import { useTheme } from "@react-navigation/native";
import CS from "@theme/styles";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import IconSvg from "assets/svg";
import TaskIcon from "@shared-components/task-icon/task.icon";
import { SCREENS } from "constants";
import { ActionTypeTask } from "constants/task.constant";
import { Device } from "@utils/device.ui.utils";
import { translations } from "@localization";
import createStyles from "./task.style";

const progressWidth = Device.width - 250;

const TaskItemCommon = ({ item }) => {
  const theme = useTheme();
  const { colors } = theme;

  const onClickItemTask = () => {
    console.log("item.action_type", item.action_type);
    switch (item.action_type) {
      case ActionTypeTask.LIKE:
        NavigationService.navigate(SCREENS.HOME);
        break;
      case ActionTypeTask.COMMENT:
        NavigationService.navigate(SCREENS.HOME);
        break;
      case ActionTypeTask.POST:
        NavigationService.navigate(SCREENS.POST_SCREEN);
        break;
      case ActionTypeTask.COMPLETE:
        NavigationService.navigate(SCREENS.MY_COURES);
        break;
      case ActionTypeTask.WATCH:
        NavigationService.navigate(SCREENS.MY_COURES);
        break;
      case ActionTypeTask.BUY:
        NavigationService.navigate(SCREENS.COURSE_LIST);
        break;
      case ActionTypeTask.JOIN:
        NavigationService.navigate(SCREENS.COURSE_LIST);
        break;
      case ActionTypeTask.REFERRAL:
        NavigationService.navigate(SCREENS.HOME);
        break;
      case ActionTypeTask.VIEW:
        NavigationService.navigate(SCREENS.MY_COURES);
        break;
      case ActionTypeTask.SHARE:
        NavigationService.navigate(SCREENS.HOME);
        break;
      default:
        NavigationService.navigate(SCREENS.HOME);
        break;
    }
  };
  const styles = useMemo(() => createStyles(theme), [theme]);

  const progress = item.action_counter / item.action_amount;

  return (
    <TouchableOpacity
      onPress={onClickItemTask}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <TaskIcon item={item} customStyle={{ marginHorizontal: 16 }} />
      <View style={styles.viewDes}>
        <View style={CS.flex1}>
          <Text style={styles.txtTitle}>{item.title}</Text>
          {!!item?.description && (
            <Text style={styles.txtDes}>{item?.description}</Text>
          )}
          {!!item.action_amount && (
            <View style={CS.flexStart}>
              <Progress.Bar
                progress={(item.action_counter || 1) / item.action_amount}
                width={progressWidth}
                color={progress == 1 ? colors.green : colors.lightBlue}
                unfilledColor={colors.grey3}
                borderWidth={0}
                height={8}
              />
              <Text style={styles.txtProgress}>{progress * 100}%</Text>
            </View>
          )}
          <Text style={styles.txtStatus}>
            {item.status
              ? translations.task.complete
              : translations.task.notComplete}
          </Text>
        </View>
        <View style={styles.viewPoint}>
          {item.point && item.point > 0 && (
            <View style={CS.row}>
              <Text style={styles.txtPoint}>{item.point}</Text>
              <IconSvg
                style={{ marginLeft: 6 }}
                name={"icCoinStar"}
                color={colors.gold}
                size={15}
              />
            </View>
          )}
          {item.coin && item.coin > 0 && (
            <View style={CS.row}>
              <Text style={styles.txtPoint}>{item.coin}</Text>
              <IconSvg
                style={{ marginLeft: 6 }}
                name={"icCoin"}
                color={colors.gold}
                size={15}
              />
            </View>
          )}
        </View>
        <Icon
          name="chevron-forward-outline"
          type={IconType.Ionicons}
          color={colors.text}
        />
      </View>
    </TouchableOpacity>
  );
};

export default TaskItemCommon;
