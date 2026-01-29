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
import useStore from "@services/zustand/store";
import { showSuperModal } from "@helpers/super.modal.helper";
import { EnumModalContentType, EnumStyleModalType } from "@helpers/super.modal.helper";

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
  const isLightMode = useStore((state) => state.isLightMode);
  
  // Colors based on dark mode
  const activeColor = "#84CC16"; // Keep green for active
  const inactiveColor = isLightMode ? "#666666" : "#A0A0A0";
  const backgroundColor = isLightMode ? "#FFFFFF" : "#1C1C1E";
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
    // Show QuickActionMenu modal
    showSuperModal({
      contentModalType: EnumModalContentType.QuickActionMenu,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        onNavigate: (screenId: string) => {
          // Handle navigation based on selected action
          switch (screenId) {
            case 'activity':
              // Navigate to activity screen
              console.log('Navigate to Activity Log');
              // navigate(SCREENS.ACTIVITY_SCREEN); // Uncomment when screen exists
              break;
            case 'water':
              // Navigate to water screen
              console.log('Navigate to Water');
              // navigate(SCREENS.WATER_SCREEN); // Uncomment when screen exists
              break;
            case 'weight':
              // Navigate to weight screen
              console.log('Navigate to Weight');
              // navigate(SCREENS.WEIGHT_SCREEN); // Uncomment when screen exists
              break;
            case 'breakfast':
            case 'lunch':
            case 'dinner':
            case 'snacks':
              // Navigate to add meal screen with meal type
              navigate(SCREENS.ADD_MEAL_SCREEN);
              break;
            case 'scanner':
              // Navigate to calorie scanner
              navigate(SCREENS.CALORIER_SCANNER);
              break;
            default:
              console.log('Unknown action:', screenId);
          }
        }
      }
    });
  };

  return (
    <View
      pointerEvents="box-none"
      style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
    >
      <CustomBottomTab
        tabs={tabs} // Truyền mảng tabs đã xử lý xuống UI
        fabOnPress={handleFabPress}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
        backgroundColor={backgroundColor}
      />
    </View>
  );
};
