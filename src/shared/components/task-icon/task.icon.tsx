import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import IconSvg from "assets/svg";
import { ActionTypeTask } from "constants/task.constant";
import CS from "@theme/styles";

const TaskIcon = ({ item, customStyle }) => {
  const theme = useTheme();
  const { colors } = theme;

  const iconType = () => {
    switch (item.action_type) {
      case ActionTypeTask.LIKE:
        return { backgroundColor: colors.blueChart, name: "icLike" };
      case ActionTypeTask.POST:
        return { backgroundColor: colors.greenChart, name: "icupLoad" };
      case ActionTypeTask.COMMENT:
        return { backgroundColor: colors.yellowComment, name: "icCommentTask" };
      case ActionTypeTask.REFERRAL:
        return { backgroundColor: colors.boldYellow, name: "iconPen" };
      case ActionTypeTask.BUY:
        return { backgroundColor: colors.btnRedPrimary, name: "iconBuyTask" };
      case ActionTypeTask.SHARE:
        return { backgroundColor: colors.yellow, name: "icupLoad" };
      case ActionTypeTask.COMPLETE:
        return { backgroundColor: colors.greenChart, name: "iconPen" };
      case ActionTypeTask.VIEW:
        return { backgroundColor: colors.primary, name: "icYoutube" };
      case ActionTypeTask.WATCH:
        return { backgroundColor: colors.yellowComment, name: "icYoutube" };
      case ActionTypeTask.JOIN:
        return { backgroundColor: colors.blueChart, name: "iconBuyTask" };
      default:
        return {
          backgroundColor: colors.primary,
          name: "icLike",
        };
    }
  };

  return (
    <View style={customStyle}>
      <View
        style={{
          ...styles.viewIcon,
          backgroundColor: iconType().backgroundColor,
        }}
      >
        <IconSvg name={iconType().name} color={colors.white} size={15} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewIcon: {
    borderRadius: 12,
    height: 24,
    width: 24,
    ...CS.center,
  },
});
export default TaskIcon;
