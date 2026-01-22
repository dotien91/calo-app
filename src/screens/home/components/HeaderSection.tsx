import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { startOfWeek, addDays, format, isSameDay, isAfter, startOfDay } from 'date-fns';
import Svg, { Circle } from 'react-native-svg';
import { Star, Smiley } from 'phosphor-react-native';
import { translations } from '@localization';

const DEFAULT_COLORS = {
  text: '#FFFFFF',
  subText: '#8E8E93',
  accent: '#FACC15', // Vàng (Mặc định)
  full: '#FFB347',   // [CẬP NHẬT] Cam nhạt (Pastel Orange) cho đồng bộ với AvocadoIcon
  cardBg: '#2C2C2E',
  iconBg: '#3A3A3C',
  track: '#333333',
  dashed: '#999999'
};

// --- COMPONENT VÒNG TRÒN TIẾN ĐỘ ---
interface ProgressProps {
  size?: number;
  progress?: number;
  active?: boolean;
  isFuture?: boolean;
  color?: string;
  children?: React.ReactNode;
}

const DateProgressCircle = ({ 
  size = 42, 
  progress = 0, 
  active = false,
  isFuture = false,
  color = DEFAULT_COLORS.accent,
  children 
}: ProgressProps) => {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const hasDataOrActive = active || (progress > 0);
  const isPastEmpty = !isFuture && !active && progress <= 0;

  // [LOGIC MÀU SẮC]
  // Nếu progress >= 1 (100%) -> Đổi sang màu CAM NHẠT
  const isFull = progress >= 1;
  const displayColor = isFull ? DEFAULT_COLORS.full : color;

  if (!hasDataOrActive && !isPastEmpty) {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </View>
    );
  }

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        
        {/* TRƯỜNG HỢP 1: QUÁ KHỨ + 0 CALO -> NÉT ĐỨT NHẠT */}
        {isPastEmpty && (
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={DEFAULT_COLORS.dashed} 
            strokeWidth={2}
            fill="transparent"
            strokeDasharray="4, 4"
            opacity={0.3} 
          />
        )}

        {/* TRƯỜNG HỢP 2: CÓ DỮ LIỆU HOẶC HÔM NAY */}
        {hasDataOrActive && (
          <>
            {/* Track nền */}
            <Circle
              cx={size / 2} cy={size / 2} r={radius}
              stroke={DEFAULT_COLORS.track} 
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Indicator (Dùng displayColor: Vàng hoặc Cam nhạt) */}
            <Circle
              cx={size / 2} cy={size / 2} r={radius}
              stroke={displayColor} 
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - Math.min(Math.max(progress, 0), 1) * circumference}
              strokeLinecap="round"
              rotation="-90"
              origin={`${size / 2}, ${size / 2}`}
            />
          </>
        )}
      </Svg>
      {children}
    </View>
  );
};

// --- HEADER SECTION ---
interface HeaderProps {
  currentCalories?: number;
  targetCalories: number;
  weeklyData?: any[]; 
  COLORS?: any;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
}

const HeaderSection = ({ 
  targetCalories, 
  weeklyData = [], 
  COLORS = DEFAULT_COLORS,
  selectedDate,
  onSelectDate,
}: HeaderProps) => {
  
  const weekDays = useMemo(() => {
    const today = new Date();
    const todayStart = startOfDay(today);
    const start = startOfWeek(today, { weekStartsOn: 1 });
    
    const list = [];
    for (let i = 0; i < 7; i++) {
      const current = addDays(start, i);
      const currentStart = startOfDay(current);
      const dateString = format(current, 'yyyy-MM-dd'); 

      const dayData = weeklyData.find((w: any) => w.date === dateString);
      const dayCalories = dayData?.totals?.calories || 0;
      const dayProgress = targetCalories > 0 ? dayCalories / targetCalories : 0;

      const dayLabel = i === 6
        ? translations.home?.week?.sunShort || 'CN'
        : (translations.home?.week?.dayShort?.replace('__INDEX__', `${i + 2}`) || `T${i + 2}`);
      
      list.push({
        day: dayLabel,
        date: format(current, 'd'),
        dateString,
        active: dateString === (selectedDate || format(today, 'yyyy-MM-dd')),
        isFuture: isAfter(currentStart, todayStart),
        progress: dayProgress 
      });
    }
    return list;
  }, [weeklyData, targetCalories]); 

  return (
    <View style={styles.headerSection}>
      <View style={styles.topRow}>
        <Text style={[styles.greeting, { color: COLORS.text }]}>
          {translations.home?.greeting || 'Today'}
        </Text>
        
        <View style={styles.headerIcons}>
          <View style={[styles.iconBadge, { backgroundColor: COLORS.iconBg }]}>
            <Star size={18} color={COLORS.accent} weight="fill" />
            <Text style={[styles.badgeText, { color: COLORS.text }]}>0</Text>
          </View>
          <TouchableOpacity style={{ marginLeft: 12 }}>
            <Smiley size={26} color={COLORS.text} weight="regular" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.calendarRow}>
        {weekDays.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => !item.isFuture && onSelectDate && onSelectDate(item.dateString)}
            style={[
              styles.dayItem,
              item.isFuture && { opacity: 0.3 }
            ]}
            disabled={item.isFuture}
          >
            <Text style={[styles.dayText, { color: COLORS.subText }]}>{item.day}</Text>

            <DateProgressCircle size={42} active={item.active} progress={item.progress} isFuture={item.isFuture} color={COLORS.accent}>
              <View style={[styles.dateCircle, (!item.active && !(item.progress <= 0 && !item.isFuture)) && { backgroundColor: COLORS.cardBg }]}>
                <Text style={[styles.dateText, { color: COLORS.text }, item.active && { fontWeight: 'bold' }]}>{item.date}</Text>
              </View>
            </DateProgressCircle>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  greeting: {
    fontSize: 24, fontWeight: '700',
  },
  headerIcons: {
    flexDirection: 'row', alignItems: 'center',
  },
  iconBadge: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20,
  },
  badgeText: {
    marginLeft: 6, fontWeight: '600', fontSize: 14,
  },
  calendarRow: {
    flexDirection: 'row', justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center', width: 42,
  },
  dayText: {
    fontSize: 12, marginBottom: 8, fontWeight: '500',
  },
  dateCircle: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
  },
});

export default HeaderSection;