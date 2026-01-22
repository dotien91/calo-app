import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus } from "phosphor-react-native";

const { width } = Dimensions.get("window");

interface CustomBottomTabProps {
  tabs: any[];
  fabOnPress: () => void;
  activeColor: string;
  inactiveColor: string;
  backgroundColor: string;
}

export const CustomBottomTab = ({ 
  tabs = [], 
  fabOnPress, 
  activeColor, 
  inactiveColor,
  backgroundColor
}: CustomBottomTabProps) => {
  const insets = useSafeAreaInsets();
  
  // 1. Giảm chiều cao một chút để gọn hơn (64 -> 60)
  const TAB_BAR_HEIGHT = 60; 
  
  // 2. Tính tổng chiều cao bao gồm cả phần tai thỏ dưới đáy (Safe Area)
  // Để SVG vẽ phủ kín xuống đáy, không bị hở
  const totalHeight = TAB_BAR_HEIGHT + insets.bottom;

  if (!tabs || tabs.length < 4) {
    return <View style={{ height: totalHeight }} />;
  }

  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2, 4);

  // 3. Cập nhật đường vẽ SVG
  // Thay đổi: Kéo dài nét vẽ cuối cùng xuống `totalHeight` thay vì `TAB_BAR_HEIGHT`
  const d = `
    M 0 0
    L ${width / 2 - 60} 0
    C ${width / 2 - 40} 0 ${width / 2 - 40} 42 ${width / 2} 42
    C ${width / 2 + 40} 42 ${width / 2 + 40} 0 ${width / 2 + 60} 0
    L ${width} 0
    L ${width} ${totalHeight} 
    L 0 ${totalHeight}
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
    // Container bao bọc toàn bộ
    <View style={[styles.container, { height: totalHeight }]}>
      
      {/* Background SVG: Vẽ full chiều cao */}
      <View style={[StyleSheet.absoluteFill, styles.shadow]}>
        <Svg width={width} height={totalHeight}>
          <Path d={d} fill={backgroundColor} />
        </Svg>
      </View>

      {/* Nội dung Tab */}
      <View style={[styles.content, { height: TAB_BAR_HEIGHT }]}>
        {leftTabs.map(renderTabItem)}
        <View style={{ width: 80 }} /> 
        {rightTabs.map(renderTabItem)}
      </View>

      {/* FAB Button: Hạ thấp xuống một chút cho khớp với chiều cao mới */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: insets.bottom + 26 }]} 
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
    shadowOffset: {
      width: 0,
      height: -4, // Bóng đổ lên trên
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 0,
  },
  content: {
    flexDirection: 'row',
    width: width,
    alignItems: 'flex-start',
    paddingTop: 10, // Giảm padding top một chút (12 -> 10) để icon cân đối với chiều cao mới
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  fab: {
    position: 'absolute',
    left: width / 2 - 31,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#84CC16',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: "#84CC16",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1,
  },
});