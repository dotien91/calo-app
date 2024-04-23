import React, { useMemo } from "react";
import { Text, View } from "react-native";
import * as Progress from "react-native-progress";

import { useTheme } from "@react-navigation/native";
import CS from "@theme/styles";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import IconSvg from "assets/svg";
import TaskIcon from "@shared-components/task-icon/task.icon";
import { Device } from "@utils/device.ui.utils";
import PressableBtn from "@shared-components/button/PressableBtn";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import createStyles from "./task.style";
import { translations } from "@localization";

const progressWidth = Device.width - 250;

const TashListItem = ({ item }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const progress = (item.action_counter || 0) / item.action_amount;

  const showRefer = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.RefferralTask,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        item,
        hideCloseIcon: true,
      },
    });
  };

  return (
    <PressableBtn onPress={showRefer} style={styles.container}>
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
                progress={(item.action_counter || 0) / item.action_amount}
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
    </PressableBtn>
  );
};
export default TashListItem;
