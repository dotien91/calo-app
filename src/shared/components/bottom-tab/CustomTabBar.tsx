import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { CustomBottomTab } from "./CustomBottomTab";
import { SCREENS } from "constants";
import { View } from "react-native";
import { navigate } from "@helpers/navigation.helper";
import eventEmitter from "@services/event-emitter";
import {
  House,
  ChartBar,
  Heart,
  User,
} from "phosphor-react-native";

// Hàm map tên route sang Icon Component
const getIconComponent = (routeName: string) => {
  switch (routeName) {
    case SCREENS.HOME_TAB:
      return House;
    case SCREENS.STATISTICS_TAB:
      return ChartBar;
    case SCREENS.HEALTH_TAB:
      return Heart;
    case SCREENS.SETTINGPROFILESCREEN_TAB:
      return User;
    default:
      return House;
  }
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  // Xử lý chuyển đổi dữ liệu từ Navigation thành mảng tabs
  const tabs = state.routes.map((route, index) => {
    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }

      // Handle specific route events
      if (route.name === SCREENS.HOME_TAB) {
        eventEmitter.emit("reload_home_page");
        eventEmitter.emit("scroll_home_to_top");
      } else if (route.name === SCREENS.SETTINGPROFILESCREEN_TAB) {
        eventEmitter.emit("reload_list_task");
      }
    };

    return {
      key: route.key,
      iconComponent: getIconComponent(route.name),
      onPress: onPress,
      isActive: isFocused,
    };
  });

  const handleFabPress = () => {
    // Logic khi bấm nút cộng
    navigate(SCREENS.POST_SCREEN);
  };

  return (
    <View
      pointerEvents="box-none"
      style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
    >
      <CustomBottomTab
        tabs={tabs} // Truyền mảng tabs đã xử lý xuống UI
        fabOnPress={handleFabPress}
        activeColor="#57A686"
        inactiveColor="#A0A0A0"
      />
    </View>
  );
};
