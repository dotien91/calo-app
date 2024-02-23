import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { useTheme } from "@react-navigation/native";
import CS from "@theme/styles";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import IconSvg from "assets/svg";
import TaskIcon from "@shared-components/task-icon/task.icon";
import { SCREENS } from "constants";

const TaskItemCommon = ({ item }) => {
  const theme = useTheme();
  const { colors } = theme;

  const onClickItemTask = (item) => {
    switch (item.typeTask) {
      case "Like":
        NavigationService.navigate(SCREENS.HOME);
        break;
      case "Comment":
        NavigationService.navigate(SCREENS.HOME);
        break;
      case "Post":
        NavigationService.navigate(SCREENS.POST_SCREEN);
        break;

      default:
        break;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        onClickItemTask(item);
      }}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <TaskIcon item={item} customStyle={{ marginHorizontal: 16 }}></TaskIcon>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderColor: colors.grey2,
          flex: 1,
          paddingVertical: 8,
        }}
      >
        <View style={{}}>
          <Text
            style={{
              ...CS.hnSemiBold,
              fontSize: 16,
              color: colors.text,
              maxWidth: 200,
              marginBottom: 8,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{ ...CS.hnMedium, fontSize: 12, color: colors.textOpacity6 }}
          >
            {item.decs}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          <Text style={{ ...CS.hnSemiBold, fontSize: 16, color: colors.text }}>
            {item.coinNum}
          </Text>
          <IconSvg
            style={{ marginLeft: 6 }}
            name={"icCoinStar"}
            color={colors.gold}
            size={15}
          ></IconSvg>
          <Icon
            name="chevron-forward-outline"
            type={IconType.Ionicons}
            color={colors.text}
          ></Icon>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default TaskItemCommon;
