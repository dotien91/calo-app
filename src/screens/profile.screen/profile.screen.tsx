import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { SCREENS } from 'constants';

// --- Import Phosphor Icons ---
import {
  Scales,
  Fire,
  ChartPieSlice,
  ForkKnife,
  Footprints,
  Drop,
  ArrowCounterClockwise,
  Bell,
  Translate,
  Ruler,
  Star,
  Gift,
  ChatCircleDots,
  ShieldCheck,
  Info,
  FileText,
  Trash,
  Fingerprint,
  TiktokLogo,
  FacebookLogo,
  CaretRight,
  ArrowSquareOut,
  Aperture,
  FireSimple,
  Moon, // <--- Icon Mặt trăng cho Dark Mode
} from 'phosphor-react-native';

// --- Import Styles ---
import { createStyles } from './profile.screen.style';
import useStore from '@services/zustand/store'; // Store của bạn

// --- Component: ListItem (Hỗ trợ Switch) ---
interface ListItemProps {
  Icon?: any;
  title: string;
  value?: string | React.ReactNode;
  hasArrow?: boolean;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  color?: string;
  isLast?: boolean;
  theme: any;
  styles: any;
  onPress?: () => void;
}

const ListItem = ({ 
  Icon, title, value, hasArrow = true, isSwitch = false, 
  switchValue, onSwitchChange, color, isLast = false, theme, styles, onPress 
}: ListItemProps) => {
  const { colors, dark } = theme;
  const defaultIconColor = colors.text; 
  const secondaryColor = dark ? '#8E8E93' : '#888888';

  // Nếu là Switch thì không cho bấm vào View cha
  const Container = (isSwitch || !onPress) ? View : TouchableOpacity;

  return (
    <View>
      <Container 
        style={styles.itemContainer} 
        activeOpacity={0.7}
        onPress={onPress}
      >
        <View style={styles.itemLeft}>
          {Icon && (
            <Icon size={24} color={color || defaultIconColor} weight="regular" style={styles.itemIcon} />
          )}
          <Text style={[styles.itemTitle, color && { color: color }]}>{title}</Text>
        </View>

        <View style={styles.itemRight}>
          {typeof value === 'string' ? <Text style={styles.itemValue}>{value}</Text> : value}
          
          {isSwitch ? (
            <Switch
              trackColor={{ false: "#3e3e3e", true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? "#fff" : colors.primary} 
              onValueChange={onSwitchChange}
              value={switchValue}
            />
          ) : (
            hasArrow && <CaretRight size={20} color={secondaryColor} />
          )}
        </View>
      </Container>
      {!isLast && <View style={styles.divider} />}
    </View>
  );
};

// --- Component: SectionGroup ---
const SectionGroup = ({ title, children, styles }: { title?: string, children: React.ReactNode, styles: any }) => {
  return (
    <View style={styles.sectionWrapper}>
      {title && <Text style={styles.sectionHeader}>{title}</Text>}
      <View style={styles.sectionContainer}>{children}</View>
    </View>
  );
};

const SettingProfileScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { colors, dark } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  // Lấy hàm set theme từ store (nếu có)
  const setTheme = useStore((state) => state.setTheme); 

  // --- States ---
  const [isEnabledBurn, setIsEnabledBurn] = useState(false);
  const [isEnabledMetric, setIsEnabledMetric] = useState(true);
  
  // State hiển thị Darkmode (Khởi tạo bằng giá trị theme hiện tại)
  const [isDarkMode, setIsDarkMode] = useState(dark);

  const arrowIconColor = dark ? '#8E8E93' : '#888888';

  // --- Logic Toggle Dark Mode ---
  const handleToggleDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    // Cập nhật vào Global Store để app render lại
    // Nếu store của bạn dùng string 'dark'/'light':
    if (setTheme) {
        setTheme(value ? 'dark' : 'light'); 
    }
  };

  // --- Navigation Logic ---
  const handleNavigateToGoal = (key: string) => {
    let params = {};
    switch (key) {
      case 'WEIGHT':
        params = { type: 'WEIGHT', title: 'Mục tiêu cân nặng', initialValue: 70.0, unit: 'kg' };
        break;
      case 'CALO':
        params = { type: 'INPUT', title: 'Mục tiêu Calo', description: '...', initialValue: '2045', unit: 'kcal', iconType: 'fire' };
        break;
      case 'DIET':
        params = { type: 'DIET', title: 'Chế độ ăn', initialValue: '1' };
        break;
      case 'STEP':
        params = { type: 'INPUT', title: 'Mục tiêu bước chân', description: '...', initialValue: '10000', unit: 'bước / ngày', iconType: 'step' };
        break;
      case 'WATER':
        params = { type: 'INPUT', title: 'Mục tiêu nước uống', description: '...', initialValue: '2000', unit: 'ml', iconType: 'water' };
        break;
      default: return; 
    }
    navigation.navigate(SCREENS.GOAL, params);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Banner PRO */}
        <View style={styles.proBanner}>
          <View style={styles.proHeaderRow}>
            <Aperture size={28} color={colors.primary} weight="duotone" />
            <Text style={styles.proTitle}>CalSnap</Text>
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          </View>
          <Text style={styles.proDescription}>
            Trải nghiệm AI thông minh không lo bị gián đoạn - Nhanh chóng đạt được mục tiêu.
          </Text>
          <TouchableOpacity style={styles.proButton}>
            <Text style={styles.proButtonText}>Dùng thử miễn phí</Text>
          </TouchableOpacity>
        </View>

        {/* Section: Mục tiêu */}
        <SectionGroup title="Mục tiêu" styles={styles}>
          <ListItem theme={theme} styles={styles} Icon={Scales} title="Cân nặng" value="70 kg" onPress={() => handleNavigateToGoal('WEIGHT')} />
          <ListItem theme={theme} styles={styles} Icon={Fire} title="Calo" value="2045 kcal" onPress={() => handleNavigateToGoal('CALO')} />
          <ListItem theme={theme} styles={styles} Icon={ChartPieSlice} title="Dinh dưỡng" value="256/102/68 g" />
          <ListItem theme={theme} styles={styles} Icon={ForkKnife} title="Chế độ ăn" value="Cân bằng" onPress={() => handleNavigateToGoal('DIET')} />
          <ListItem theme={theme} styles={styles} Icon={Footprints} title="Bước chân" value="10000 bước" onPress={() => handleNavigateToGoal('STEP')} />
          <ListItem theme={theme} styles={styles} Icon={Drop} title="Nước" value="2000 ml" isLast onPress={() => handleNavigateToGoal('WATER')} />
        </SectionGroup>

        {/* Section: Tùy chỉnh */}
        <SectionGroup title="Tùy chỉnh" styles={styles}>
          <ListItem theme={theme} styles={styles} Icon={ArrowCounterClockwise} title="Bắt đầu lại" />
          <ListItem theme={theme} styles={styles} Icon={Bell} title="Nhắc nhở" />
          
          {/* --- TOGGLE DARK MODE HIỂN THỊ Ở NGOÀI --- */}
          <ListItem 
            theme={theme} styles={styles}
            Icon={Moon} 
            title="Chế độ tối" 
            isSwitch 
            switchValue={isDarkMode}
            onSwitchChange={handleToggleDarkMode}
          />
          
          <ListItem theme={theme} styles={styles} Icon={Translate} title="Ngôn ngữ" value="Tiếng Việt" />
          
          <View style={styles.toggleItemWrapper}>
            <ListItem 
              theme={theme} styles={styles}
              Icon={FireSimple} 
              title="Cộng calo tiêu hao" 
              isSwitch 
              switchValue={isEnabledBurn}
              onSwitchChange={setIsEnabledBurn}
              isLast
            />
            <Text style={styles.subText}>Tăng giới hạn calo hàng ngày dựa trên hoạt động</Text>
          </View>
           <View style={styles.divider} />

          <View style={styles.toggleItemWrapper}>
            <ListItem 
              theme={theme} styles={styles}
              Icon={Ruler} 
              title="Hệ mét" 
              isSwitch 
              switchValue={isEnabledMetric}
              onSwitchChange={setIsEnabledMetric}
              isLast
            />
             <Text style={styles.subText}>Tắt để sử dụng đơn vị đo lường Imperial</Text>
          </View>
        </SectionGroup>

        {/* Section: Khác */}
        <SectionGroup title="Khác" styles={styles}>
          <ListItem theme={theme} styles={styles} Icon={Star} title="Đánh giá CalSnap" />
          <ListItem theme={theme} styles={styles} Icon={Gift} title="Hạn mức miễn phí" />
          <ListItem theme={theme} styles={styles} Icon={ChatCircleDots} title="Hỗ trợ" />
          <ListItem theme={theme} styles={styles} Icon={ShieldCheck} title="Chính sách bảo mật" value={<ArrowSquareOut size={18} color={arrowIconColor} />} hasArrow={false} />
          <ListItem theme={theme} styles={styles} Icon={Info} title="Điều khoản sử dụng" value={<ArrowSquareOut size={18} color={arrowIconColor} />} hasArrow={false} />
          <ListItem theme={theme} styles={styles} Icon={FileText} title="Nguồn thông tin y tế" />
          <ListItem theme={theme} styles={styles} Icon={Trash} title="Xóa tài khoản" color={colors.notification} isLast hasArrow={false} />
          <View style={{paddingHorizontal: 16, paddingBottom: 12}}>
             <Text style={styles.subText}>Xóa tất cả dữ liệu và khởi tạo lại</Text>
          </View>
        </SectionGroup>

        {/* Section: Tài khoản */}
        <SectionGroup title="Tài khoản" styles={styles}>
           <ListItem theme={theme} styles={styles} Icon={Fingerprint} title="ID" value="cdd420...6bf0" hasArrow={false} isLast />
        </SectionGroup>

        {/* Section: Theo dõi */}
        <SectionGroup title="Theo dõi CalSnap" styles={styles}>
          <ListItem theme={theme} styles={styles} Icon={TiktokLogo} title="TikTok" value={<ArrowSquareOut size={18} color={arrowIconColor} />} hasArrow={false} />
          <ListItem theme={theme} styles={styles} Icon={FacebookLogo} title="Facebook" value={<ArrowSquareOut size={18} color={arrowIconColor} />} hasArrow={false} isLast />
        </SectionGroup>

        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>CalSnap 1.6.18+63</Text>
          <Text style={styles.footerText}>© 2025 CalSnap. All rights reserved.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

export default SettingProfileScreen;