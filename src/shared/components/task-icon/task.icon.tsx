import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import IconSvg from "assets/svg";
import { ActionTypeTask } from "constants/task.constant";
import CS from "@theme/styles";

const TaskIcon = ({ item, customStyle }) => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={customStyle}>
      {item.action_type === ActionTypeTask.BUY && (
        <View
          style={{
            ...styles.viewIcon,
            backgroundColor: colors.btnRedPrimary,
          }}
        >
          <IconSvg
            name={"iconBuyTask"}
            color={colors.white}
            size={15}
          ></IconSvg>
        </View>
      )}
      {item.action_type === ActionTypeTask.COMMENT && (
        <View
          style={{
            ...styles.viewIcon,
            backgroundColor: colors.yellowComment,
          }}
        >
          <IconSvg
            name={"icCommentTask"}
            color={colors.white}
            size={15}
          ></IconSvg>
        </View>
      )}
      {item.action_type === ActionTypeTask.LIKE && (
        <View
          style={{
            ...styles.viewIcon,
            backgroundColor: colors.blueChart,
          }}
        >
          <IconSvg name={"icLike"} color={colors.white} size={15}></IconSvg>
        </View>
      )}
      {item.action_type === ActionTypeTask.POST && (
        <View
          style={{
            ...styles.viewIcon,
            backgroundColor: colors.greenChart,
          }}
        >
          <IconSvg name={"icupLoad"} color={colors.white} size={15}></IconSvg>
        </View>
      )}
      {item.action_type === ActionTypeTask.COMPLETE && (
        <View
          style={{
            ...styles.viewIcon,
            backgroundColor: colors.greenChart,
          }}
        >
          <IconSvg name={"iconPen"} color={colors.white} size={15}></IconSvg>
        </View>
      )}
      {item.action_type === ActionTypeTask.VIEW && (
        <View
          style={{
            ...styles.viewIcon,
            backgroundColor: colors.primary,
          }}
        >
          <IconSvg name={"icYoutube"} color={colors.white} size={15}></IconSvg>
        </View>
      )}
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
