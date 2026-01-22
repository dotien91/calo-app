import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trophy, Footprints, Drop, Fire, ForkKnife } from 'phosphor-react-native';
import { translations } from '@localization';
// Import Component SVG hiệu ứng quả bơ
import FillingMascot from './avocado/FillingMascot';

type Props = {
  styles: any;       // Styles từ theme chung
  COLORS: any;       // Bộ màu từ theme chung
  onboardingData?: any; 
  currentCalories?: number; // Số calo đã nạp (từ API)
  currentSteps?: number;
  currentWater?: number;
};

const DashboardCard = ({
  styles: globalStyles,
  COLORS,
  onboardingData,
  currentCalories = 0, // Mặc định là 0 nếu chưa ăn gì
  currentSteps = 0,
  currentWater = 0,
}: Props) => {

  // --- 1. TÍNH TOÁN % CALO ---
  // Lấy mục tiêu từ onboarding, mặc định 2045 nếu không có
  const targetCal = onboardingData?.target_calories || 2045;
  
  // Công thức: (Đã nạp / Mục tiêu) * 100.
  // Kết quả này sẽ được truyền vào FillingMascot để điều khiển mực nước vàng.
  const percentCal = targetCal > 0 ? (currentCalories / targetCal) * 100 : 0;
  return (
    <View style={globalStyles.dashboardCard}>
      <View style={globalStyles.dashboardRow}>
        
        {/* --- CỘT TRÁI: QUẢ BƠ FILLING (MASCOT) --- */}
        <View style={localStyles.mascotContainer}>
          <FillingMascot
            percentage={percentCal} // <--- Truyền % đã tính vào đây
            size={140}              // Kích thước quả bơ
            fillColor={COLORS.accent} // Màu vàng (#FACC15)
          />
        </View>

        {/* --- CỘT PHẢI: CÁC CHỈ SỐ THỐNG KÊ --- */}
        <View style={localStyles.statsColumn}>
          
          {/* 1. MỤC TIÊU CALO */}
          <View style={localStyles.statItem}>
            <Trophy size={20} color={COLORS.accent} weight="fill" />
            <View style={localStyles.statTextContainer}>
              <Text style={globalStyles.statLabel}>
                {translations.home?.dashboard?.caloriesLabel || 'Mục tiêu'}
              </Text>
              <Text style={globalStyles.statValue}>
                {targetCal}<Text style={globalStyles.unit}> kcal</Text>
              </Text>
            </View>
          </View>

          {/* 2. ĐÃ NẠP (HIỆN TẠI) */}
          <View style={[localStyles.statItem, { marginTop: 15 }]}>
            <ForkKnife size={20} color={COLORS.accent} weight="regular" />
            <View style={localStyles.statTextContainer}>
              <Text style={globalStyles.statLabel}>
                {translations.home?.dashboard?.consumedLabel || 'Consumed'}
              </Text>
              <Text style={globalStyles.statValue}>
                {currentCalories}<Text style={globalStyles.unit}> kcal</Text>
              </Text>
            </View>
          </View>

          {/* 3. TIÊU HAO (VÍ DỤ) */}
          <View style={[localStyles.statItem, { marginTop: 15 }]}>
            <Fire size={20} color={COLORS.red} weight="fill" />
            <View style={localStyles.statTextContainer}>
              <Text style={globalStyles.statLabel}>
                {translations.home?.dashboard?.burnedLabel || 'Burned'}
              </Text>
              <Text style={globalStyles.statValue}>
                0<Text style={globalStyles.unit}> kcal</Text>
              </Text>
            </View>
          </View>

        </View>
      </View>
    </View>
  );
};

// Styles nội bộ cho Card (để tinh chỉnh vị trí nếu cần)
const localStyles = StyleSheet.create({
  mascotContainer: {
    marginRight: 10, // Khoảng cách giữa quả bơ và cột chữ
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsColumn: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Căn icon theo dòng đầu tiên của text
  },
  statTextContainer: {
    marginLeft: 10,
  },
});

export default DashboardCard;