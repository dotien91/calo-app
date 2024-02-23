import React from "react";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
import IconSvg from "assets/svg";

const TaskIcon = ({ item, customStyle }) => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={customStyle}>
      {item.typeTask === "Buy" && (
        <View
          style={{
            borderRadius: 12,
            backgroundColor: colors.btnRedPrimary,
            height: 24,
            width: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconSvg
            name={"iconBuyTask"}
            color={colors.white}
            size={15}
          ></IconSvg>
        </View>
      )}
      {item.typeTask === "Comment" && (
        <View
          style={{
            borderRadius: 12,
            backgroundColor: colors.yellowComment,
            height: 24,
            width: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconSvg
            name={"icCommentTask"}
            color={colors.white}
            size={15}
          ></IconSvg>
        </View>
      )}
      {item.typeTask === "Like" && (
        <View
          style={{
            borderRadius: 12,
            backgroundColor: colors.blueChart,
            height: 24,
            width: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconSvg name={"icLike"} color={colors.white} size={15}></IconSvg>
        </View>
      )}
      {item.typeTask === "Post" && (
        <View
          style={{
            borderRadius: 12,
            backgroundColor: colors.greenChart,
            height: 24,
            width: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconSvg name={"icupLoad"} color={colors.white} size={15}></IconSvg>
        </View>
      )}
      {item.typeTask === "Practive" && (
        <View
          style={{
            borderRadius: 12,
            backgroundColor: colors.greenChart,
            height: 24,
            width: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconSvg name={"iconPen"} color={colors.white} size={15}></IconSvg>
        </View>
      )}
    </View>
  );
};
export default TaskIcon;
