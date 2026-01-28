import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';

type MacroCardProps = {
  title: string;
  icon?: React.ReactNode;
  current?: number;
  total?: number;
  color?: string;
  progressBarBg?: string;
  styles: any;
  COLORS: any;
};

const MacroCard = ({
  title,
  icon,
  current = 0,
  total = 100,
  color,
  progressBarBg,
  styles,
  COLORS,
}: MacroCardProps) => {
  // --- BẢNG MÀU ĐỒNG BỘ ---
  const COLOR_LOW = '#FEF08A';    // Vàng nhạt (< 50%)
  const COLOR_MEDIUM = '#FACC15'; // Vàng tiêu chuẩn (50% - 99%)
  const COLOR_FULL = '#FFB347';   // Cam nhạt (>= 100%)

  // 1. Tính % thực tế
  const rawPercentage = total ? (current / total) * 100 : 0;
  // Giới hạn max 100 cho animation (để width không bị vỡ)
  const targetPercentage = Math.min(rawPercentage, 100);

  // 2. Khởi tạo giá trị Animation (bắt đầu từ 0)
  const animatedValue = useRef(new Animated.Value(0)).current;

  // 3. Chạy Animation mỗi khi targetPercentage thay đổi
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: targetPercentage,
      duration: 1000, // Thời gian chạy 1 giây
      easing: Easing.out(Easing.cubic), // Hiệu ứng chậm dần về cuối cho mượt
      useNativeDriver: false, // Bắt buộc false vì ta animate thuộc tính layout (width/color)
    }).start();
  }, [targetPercentage]);

  // 4. Biến đổi (Interpolate) giá trị 0-100 thành Width (%)
  const animatedWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp', // Đảm bảo không vượt quá 100%
  });

  // 5. Biến đổi (Interpolate) giá trị 0-100 thành Màu sắc
  // 0 -> 50: Chuyển từ Vàng nhạt sang Vàng đậm
  // 50 -> 100: Chuyển từ Vàng đậm sang Cam
  const animatedColor = animatedValue.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [COLOR_LOW, COLOR_MEDIUM, COLOR_FULL],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.macroCard, { backgroundColor: COLORS.card }]}>
      <Text style={[styles.macroTitle, { color: color || COLORS.subText }]}>{title}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        {icon ? <View style={{ marginRight: 6 }}>{icon}</View> : null}
        <Text style={[
          styles.macroValue,
          { color: COLORS.text }
        ]}>
          {current}/{total}
        </Text>
      </View>

      {/* Thanh Progress Background */}
      <View style={[
        styles.progressBarBg, 
        { 
          backgroundColor: progressBarBg || COLORS.progressBarBg,
          overflow: 'hidden' // Bo góc
        }
      ]}>
        {/* Thanh Progress Fill (Dùng Animated.View) */}
        <Animated.View 
          style={[
            styles.progressBarFill, 
            { 
              width: animatedWidth,         // Width động
              backgroundColor: animatedColor // Màu động
            }
          ]} 
        />
      </View>
    </View>
  );
};

export default MacroCard;