import React from 'react';
import {
  View, 
  Text,
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Dimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStore from '@services/zustand/store';
import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
// Import trọn bộ icon cần dùng từ Phosphor
import { 
  Star, 
  Smiley, 
  Trophy, 
  ForkKnife, 
  Fire, 
  Info
} from 'phosphor-react-native';

const { width } = Dimensions.get('window');

// Hàm lấy tuần hiện tại
const getCurrentWeek = () => {
  const today = new Date();
  // Lấy ngày thứ 2 đầu tuần (weekStartsOn: 1 là Thứ 2)
  const start = startOfWeek(today, { weekStartsOn: 1 }); 

  const weekData = [];
  for (let i = 0; i < 7; i++) {
    const current = addDays(start, i);
    weekData.push({
      // format 'EEEEEE' ra T2, T3... (cần check locale vi)
      // Nhưng để an toàn ta tự map tay cho chuẩn ngắn gọn:
      day: i === 6 ? 'CN' : `T${i + 2}`, 
      date: format(current, 'd'),
      active: isSameDay(current, today),
    });
  }
  return weekData;
};

const HomeScreen = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  
  // Màu sắc động dựa trên dark mode
  const COLORS = {
    bg: isDarkMode ? '#000000' : '#FFFFFF',
    card: isDarkMode ? '#1C1C1E' : '#F5F5F5',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    subText: isDarkMode ? '#A0A0A0' : '#666666',
    primary: '#84CC16',   // Xanh lá (Lime) - giữ nguyên
    accent: '#FACC15',    // Vàng - giữ nguyên
    blue: '#3B82F6',
    red: '#EF4444',
    borderColor: isDarkMode ? '#333' : '#E5E7EB',
    activeDateBg: isDarkMode ? '#2C2C2E' : '#E5E7EB',
    activeDateText: isDarkMode ? '#FFFFFF' : '#000000',
    progressBarBg: isDarkMode ? '#333' : '#E5E7EB',
    iconBadgeBg: isDarkMode ? '#333' : '#F0F0F0',
    bannerBg: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    bannerText: isDarkMode ? '#FFFFFF' : '#000000',
    emptyIconColor: isDarkMode ? '#333' : '#CCCCCC',
  };

  // Lấy tuần hiện tại
  const weekDays = getCurrentWeek();

  // Component con: Macro Card với styles động
  const MacroCard = ({ title, current, total, color, progressBarBg }: any) => (
    <View style={[styles.macroCard, { backgroundColor: COLORS.card }]}>
      <Text style={[styles.macroTitle, { color: COLORS.subText }]}>{title}</Text>
      <Text style={[styles.macroValue, { color: COLORS.text }]}>{current}/{total}g</Text>
      <View style={[styles.progressBarBg, { backgroundColor: progressBarBg }]}>
        <View style={[styles.progressBarFill, { width: `${(current/total)*100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.bg,
    },
  // Header
  headerSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.iconBadgeBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    color: COLORS.accent,
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Calendar
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
  },
  dayText: {
    color: COLORS.subText,
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333', // Viền mờ cho ngày thường
    backgroundColor: 'transparent',
  },
  activeDate: {
    backgroundColor: '#E5E7EB', // Màu trắng xám
    borderColor: '#E5E7EB',
  },
  dateText: {
    color: COLORS.subText,
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Dashboard Card
  dashboardCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  dashboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mascotImage: {
    width: 130,
    height: 130,
  },
  statsColumn: {
    flex: 1,
    marginLeft: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statInfo: {
    marginLeft: 10,
  },
  statLabel: {
    color: COLORS.subText,
    fontSize: 12,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  unit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: COLORS.subText,
    marginLeft: 2,
  },

  // Macros
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 24,
  },
  macroCard: {
    backgroundColor: COLORS.card,
    width: (width - 40 - 24) / 3, // Khoảng cách giữa các thẻ lớn hơn xíu
    padding: 14,
    borderRadius: 16,
    justifyContent: 'center',
  },
  macroTitle: {
    color: COLORS.subText,
    fontSize: 12,
    marginBottom: 6,
  },
  macroValue: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressBarBg: {
    height: 5,
    borderRadius: 10,
    width: '100%',
  },
  progressBarFill: {
    height: 5,
    borderRadius: 10,
  },

  // Banner
  bannerContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  banner: {
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIconPlaceholder: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 14,
  },
  downloadBtn: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  btnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 13,
  },
  premiumText: {
    textAlign: 'center',
    color: COLORS.subText,
    marginTop: 10,
    fontSize: 12,
  },

  // Recent Section
  recentSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    opacity: 0.7,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySub: {
    color: COLORS.subText,
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={COLORS.bg} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* --- 1. HEADER --- */}
        <View style={styles.headerSection}>
          <View style={styles.topRow}>
            <Text style={styles.greeting}>Hôm nay</Text>
            <View style={styles.headerIcons}>
              {/* Điểm / Coin */}
              <View style={styles.iconBadge}>
                <Star size={20} color={COLORS.accent} weight="fill" />
                <Text style={styles.badgeText}>0</Text>
              </View>
              
              {/* Avatar / Mood */}
              <TouchableOpacity style={{ marginLeft: 15 }}>
                 <Smiley size={28} color={COLORS.text} weight="regular" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Calendar Row */}
          <View style={styles.calendarRow}>
            {weekDays.map((item, index) => (
              <View key={index} style={styles.dayItem}>
                <Text style={styles.dayText}>{item.day}</Text>
                <View style={[
                  styles.dateCircle, 
                  { borderColor: COLORS.borderColor },
                  item.active && { backgroundColor: COLORS.activeDateBg, borderColor: COLORS.activeDateBg }
                ]}>
                  <Text style={[
                    styles.dateText, 
                    { color: COLORS.subText },
                    item.active && { color: COLORS.activeDateText, fontWeight: 'bold' }
                  ]}>
                    {item.date}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* --- 2. DASHBOARD CARD (QUẢ BƠ) --- */}
        <View style={styles.dashboardCard}>
          <View style={styles.dashboardRow}>
            {/* Ảnh nhân vật (Thay bằng ảnh local của bạn) */}
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7006/7006772.png' }} 
              style={styles.mascotImage} 
              resizeMode="contain"
            />
            
            {/* Cột thông số */}
            <View style={styles.statsColumn}>
              {/* Mục tiêu */}
              <View style={styles.statItem}>
                <Trophy size={20} color={COLORS.accent} weight="fill" />
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Mục tiêu</Text>
                  <Text style={styles.statValue}>2045<Text style={styles.unit}>kcal</Text></Text>
                </View>
              </View>

              {/* Đã nạp */}
              <View style={[styles.statItem, { marginTop: 15 }]}>
                <ForkKnife size={20} color={COLORS.text} weight="regular" />
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Đã nạp</Text>
                  <Text style={styles.statValue}>0<Text style={styles.unit}>kcal</Text></Text>
                </View>
              </View>

              {/* Tiêu hao */}
              <View style={[styles.statItem, { marginTop: 15 }]}>
                <Fire size={20} color={COLORS.red} weight="fill" />
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Tiêu hao</Text>
                  <Text style={styles.statValue}>0<Text style={styles.unit}>kcal</Text></Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* --- 3. MACROS --- */}
        <View style={styles.macroRow}>
          <MacroCard title="Tinh bột" current={0} total={256} color={COLORS.subText} progressBarBg={COLORS.progressBarBg} />
          <MacroCard title="Chất đạm" current={0} total={102} color={COLORS.subText} progressBarBg={COLORS.progressBarBg} />
          <MacroCard title="Chất béo" current={0} total={68} color={COLORS.subText} progressBarBg={COLORS.progressBarBg} />
        </View>

        {/* --- 4. BANNER QUẢNG CÁO --- */}
        <View style={styles.bannerContainer}>
          <View style={[styles.banner, { backgroundColor: COLORS.bannerBg }]}>
            <View style={styles.bannerContent}>
              <View style={styles.appIconPlaceholder}>
                <ForkKnife size={20} color="white" weight="fill" />
              </View>
              <Text style={[styles.bannerText, { color: COLORS.bannerText }]}>Bộ Đếm Calo AI</Text>
            </View>
            <TouchableOpacity style={styles.downloadBtn}>
              <Text style={styles.btnText}>Tải</Text>
            </TouchableOpacity>
            
            {/* Nút info/close nhỏ ở góc */}
            <TouchableOpacity style={{marginLeft: 10}}>
                <Info size={16} color={COLORS.subText} />
        </TouchableOpacity>
          </View>
          <Text style={[styles.premiumText, { color: COLORS.subText }]}>Tạm biệt quảng cáo. <Text style={{ color: COLORS.primary }}>Nâng cấp Premium</Text></Text>
        </View>

        {/* --- 5. EMPTY STATE (GẦN ĐÂY) --- */}
        <View style={styles.recentSection}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>Gần đây</Text>
          <View style={styles.emptyState}>
            {/* Dùng icon ForkKnife cho empty state */}
            <ForkKnife size={48} color={COLORS.emptyIconColor} weight="duotone" />
            <Text style={[styles.emptyTitle, { color: COLORS.text }]}>Chưa có bữa ăn nào!</Text>
            <Text style={[styles.emptySub, { color: COLORS.subText }]}>Nhấn + để thêm bữa ăn đầu tiên trong ngày.</Text>
          </View>
    </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
