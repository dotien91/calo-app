import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import useStore from '@services/zustand/store';
import { format } from 'date-fns';
import { translations } from '@localization';
import { getCalorieDay } from '@services/api/calorie.api';
import eventEmitter from '@services/event-emitter';
import { MacroType } from '../../constants/macro.enum';

import { createStyles, getHomeColors } from './home.screen.style';
import MacroCard from './components/MacroCard';
import DashboardCard from './components/DashboardCard';
import BannerCard from './components/BannerCard';
import HeaderSection from './components/HeaderSection';
import RecentActivity from './components/RecentActivity';
import { IconProtein, IconFat } from '@assets/svg/CustomeSvg';
import { GrainsIcon } from 'phosphor-react-native';

const HomeScreen = () => {
  const theme = useTheme();
  const onboardingData = useStore((state) => state.onboardingData);

  const styles = useMemo(() => createStyles(theme), [theme]);
  const COLORS = useMemo(() => getHomeColors(theme), [theme]);

  // 1. [MỚI] State lưu ngày đang được chọn (Mặc định là hôm nay)
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // 2. State lưu dữ liệu cả tuần từ API
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loadingWeekly, setLoadingWeekly] = useState(true);

  const fetchWeekData = useCallback(async () => {
    setLoadingWeekly(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const res = await getCalorieDay(today);
      if (res && Array.isArray(res.week)) {
        setWeeklyData(res.week);
      }
    } catch (err) {
      console.log('Error fetching calories:', err);
    } finally {
      setLoadingWeekly(false);
    }
  }, []);

  useEffect(() => {
    fetchWeekData();
  }, [fetchWeekData]);

  // Lắng nghe khi cần refresh (vd: sau khi lưu món từ scanner)
  useEffect(() => {
    const onReload = () => {
      // Reset về ngày hôm nay và refresh data
      const today = format(new Date(), 'yyyy-MM-dd');
      setSelectedDate(today);
      fetchWeekData();
    };
    eventEmitter.on('reload_home_page', onReload);
    return () => eventEmitter.off('reload_home_page', onReload);
  }, [fetchWeekData]);

  // 3. [MỚI] Tự động tính toán Totals dựa trên selectedDate
  // Khi user chọn ngày khác, biến này tự update -> DashboardCard tự update -> AvocadoIcon tự đổi màu/hình
  const dayTotals = useMemo(() => {
    const entry = weeklyData.find((w: any) => w.date === selectedDate);
    // Nếu tìm thấy ngày thì trả về totals, không thì trả về 0 hết
    return entry?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0, meals: 0 };
  }, [weeklyData, selectedDate]);

  // Lấy target và current
  const targetCalories = onboardingData?.target_calories || 2000;
  const currentCalories = dayTotals?.calories || 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={COLORS.bg} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* --- HEADER SECTION --- */}
        <HeaderSection 
          COLORS={COLORS} 
          currentCalories={currentCalories} 
          targetCalories={targetCalories}
          weeklyData={weeklyData}
          // [MỚI] Truyền props để xử lý chọn ngày
          selectedDate={selectedDate}
          onSelectDate={(date) => setSelectedDate(date)}
        />

        {/* --- DASHBOARD CARD --- */}
        {/* currentCalories thay đổi -> AvocadoIcon bên trong sẽ tự update % và màu sắc */}
        <DashboardCard 
          styles={styles} 
          COLORS={COLORS} 
          onboardingData={onboardingData} 
          currentCalories={currentCalories} 
        />

        {/* --- MACROS (Cũng tự update theo dayTotals) --- */}
        <View style={styles.macroRow}>
          <MacroCard
            styles={styles} COLORS={COLORS}
            title={translations.home?.macros?.[MacroType.CARBS] || 'Tinh bột'}
            icon={<GrainsIcon size={16} color={COLORS.subText} />}
            current={Math.round(dayTotals.carbs || 0)}
            total={onboardingData?.target_carbs || 256}
            color={COLORS.subText} progressBarBg={COLORS.progressBarBg}
          />
          <MacroCard
            styles={styles} COLORS={COLORS}
            title={translations.home?.macros?.[MacroType.PROTEIN] || 'Đạm'}
            icon={<IconProtein size={16} color={COLORS.subText} />}
            current={Math.round(dayTotals.protein || 0)}
            total={onboardingData?.target_protein || 102}
            color={COLORS.subText} progressBarBg={COLORS.progressBarBg}
          />
          <MacroCard
            styles={styles} COLORS={COLORS}
            title={translations.home?.macros?.[MacroType.FAT] || 'Béo'}
            icon={<IconFat size={16} color={COLORS.subText} />}
            current={Math.round(dayTotals.fat || 0)}
            total={onboardingData?.target_fat || 68}
            color={COLORS.subText} progressBarBg={COLORS.progressBarBg}
          />
        </View>

        <BannerCard styles={styles} COLORS={COLORS} />
        <RecentActivity data={weeklyData} selectedDate={selectedDate} loading={loadingWeekly} />

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;