import React, { useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList } from 'react-native';
import { startOfWeek, addDays, subWeeks, format, isAfter, startOfDay } from 'date-fns';
import Svg, { Circle } from 'react-native-svg';
import { Star, Smiley } from 'phosphor-react-native';
import { translations } from '@localization';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DEFAULT_COLORS = {
  text: '#FFFFFF',
  subText: '#8E8E93',
  accent: '#FACC15',
  full: '#FFB347',
  cardBg: '#2C2C2E',
  iconBg: '#3A3A3C',
  track: '#333333',
  dashed: '#999999'
};

// --- COMPONENT VÒNG TRÒN TIẾN ĐỘ (GIỮ NGUYÊN) ---
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
        {hasDataOrActive && (
          <>
            <Circle
              cx={size / 2} cy={size / 2} r={radius}
              stroke={DEFAULT_COLORS.track} 
              strokeWidth={strokeWidth}
              fill="transparent"
            />
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

// --- COMPONENT HIỂN THỊ 1 TUẦN ---
interface WeekRowProps {
  weekOffset: number; // 0 = tuần này, 1 = tuần trước, v.v.
  targetCalories: number;
  weeklyData: any[];
  COLORS: any;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
}

const WeekRow = ({ weekOffset, targetCalories, weeklyData, COLORS, selectedDate, onSelectDate }: WeekRowProps) => {
  const weekDays = useMemo(() => {
    const today = new Date();
    const todayStart = startOfDay(today);
    
    // Tính ngày bắt đầu của tuần dựa trên offset
    // subWeeks(today, 0) -> Tuần này
    // subWeeks(today, 1) -> Tuần trước
    const baseDate = subWeeks(today, weekOffset);
    const start = startOfWeek(baseDate, { weekStartsOn: 1 }); // Thứ 2 là đầu tuần
    
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
  }, [weeklyData, targetCalories, weekOffset, selectedDate]);

  return (
    <View style={styles.weekContainer}>
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
  );
};

// --- HEADER SECTION CHÍNH ---
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

  // Tạo mảng offset: [0, 1, 2, 3] -> Tương ứng: Tuần này, Tuần trước, 2 tuần trước, 3 tuần trước
  // Chúng ta hiển thị 4 tuần (Hiện tại + 3 tuần quá khứ)
  const weeksData = [0, 1, 2, 3]; 

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

      {/* Sử dụng FlatList Inverted:
        - index 0 (Tuần này) sẽ nằm bên Phải cùng.
        - index 1 (Tuần trước) nằm bên trái nó.
        => Người dùng vuốt sang phải để xem quá khứ.
      */}
      <View style={{ marginHorizontal: -20 }}> {/* Bù lại padding của headerSection để vuốt tràn màn hình */}
        <FlatList
          data={weeksData}
          keyExtractor={(item) => item.toString()}
          horizontal
          pagingEnabled // Bắt buộc để vuốt từng trang
          inverted // Đảo ngược: Mới nhất bên phải
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <WeekRow 
              weekOffset={item}
              targetCalories={targetCalories}
              weeklyData={weeklyData}
              COLORS={COLORS}
              selectedDate={selectedDate}
              onSelectDate={onSelectDate}
            />
          )}
        />
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
  // Container cho 1 tuần phải rộng bằng màn hình để paging khớp
  weekContainer: {
    width: SCREEN_WIDTH, 
    paddingHorizontal: 20, // Padding trong mỗi trang tuần
    flexDirection: 'row', 
    justifyContent: 'space-between',
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