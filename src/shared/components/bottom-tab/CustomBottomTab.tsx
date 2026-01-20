import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus } from "phosphor-react-native";

const { width } = Dimensions.get("window");

// Định nghĩa props để code rõ ràng hơn
interface CustomBottomTabProps {
  tabs: any[];
  fabOnPress: () => void;
  activeColor: string;
  inactiveColor: string;
}

export const CustomBottomTab = ({ 
  tabs = [], 
  fabOnPress, 
  activeColor, 
  inactiveColor 
}: CustomBottomTabProps) => {
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 64;

  // 1. Kiểm tra an toàn để tránh lỗi "slice of undefined"
  if (!tabs || tabs.length < 4) {
    return <View style={{ height: TAB_BAR_HEIGHT + insets.bottom }} />;
  }

  // 2. Chia tab: 2 trái, 2 phải
  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2, 4);

  // 3. FIX VISUAL: Mở rộng đường cong và làm sâu hơn
  // - width/2 - 60: Mở rộng miệng (cũ là 50)
  // - depth 42: Làm sâu đáy (cũ là 35)
  const d = `
    M 0 0
    L ${width / 2 - 60} 0
    C ${width / 2 - 40} 0 ${width / 2 - 40} 42 ${width / 2} 42
    C ${width / 2 + 40} 42 ${width / 2 + 40} 0 ${width / 2 + 60} 0
    L ${width} 0
    L ${width} ${TAB_BAR_HEIGHT}
    L 0 ${TAB_BAR_HEIGHT}
    Z
  `;

  const renderTabItem = (item: any, index: number) => {
    const IconComponent = item.iconComponent;
    const iconColor = item.isActive ? activeColor : inactiveColor;
    
    return (
      <TouchableOpacity 
        key={item.key || index} 
        onPress={item.onPress} 
        style={styles.tabItem}
        activeOpacity={0.7}
      >
        {IconComponent && (
          <IconComponent 
            size={24} 
            color={iconColor}
            weight={item.isActive ? "fill" : "regular"}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { height: TAB_BAR_HEIGHT + insets.bottom }]}>
      {/* Background SVG */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width={width} height={TAB_BAR_HEIGHT} style={styles.shadow}>
          <Path d={d} fill="white" />
        </Svg>
      </View>

      {/* Nội dung Tab */}
      <View style={styles.content}>
        {leftTabs.map(renderTabItem)}
        
        {/* Khoảng trống ở giữa (đã tăng lên 80 để né nút FAB) */}
        <View style={{ width: 80 }} /> 
        
        {rightTabs.map(renderTabItem)}
      </View>

      {/* 4. FIX VISUAL: Đẩy nút lên cao (tăng bottom lên 35) */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: insets.bottom + 35 }]} 
        onPress={fabOnPress}
        activeOpacity={0.9}
      >
        <Plus size={30} color="white" weight="bold" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  content: {
    flexDirection: 'row',
    height: 64,
    width: width,
    alignItems: 'flex-start',
    paddingTop: 12, // Căn chỉnh icon xuống một chút cho cân đối
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  fab: {
    position: 'absolute',
    left: width / 2 - 28, // Căn giữa
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#57A686',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: "#57A686",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});