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
import { translations } from '@localization';

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
  const setDarkMode = useStore((state) => state.setDarkMode); 
  const onboardingData = useStore((state) => state.onboardingData);
  const currentLanguage = useStore((state) => state.language);

  // --- Helper: Get current language name ---
  const getCurrentLanguageName = () => {
    const languageNames = {
      vi: { vi: "Tiếng Việt", en: "Vietnamese", jp: "ベトナム語" },
      en: { vi: "Anh", en: "English", jp: "英語" },
      jp: { vi: "Nhật", en: "Japanese", jp: "日本語" },
    };
    return languageNames[currentLanguage]?.[currentLanguage] || "Tiếng Việt";
  };

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
    if (setDarkMode) {
        setDarkMode(value); 
    }
  };

  // --- Navigation Logic ---
  const handleNavigateToGoal = (key: string) => {
    let params = {};
    switch (key) {
      case 'WEIGHT':
        params = { type: 'WEIGHT', title: translations.profile.weightGoalTitle, initialValue: 70.0, unit: 'kg' };
        break;
      case 'CALO':
        params = { type: 'INPUT', title: translations.profile.caloriesGoalTitle, description: '...', initialValue: '2045', unit: 'kcal', iconType: 'fire' };
        break;
      case 'DIET':
        params = { type: 'DIET', title: translations.profile.dietGoalTitle, initialValue: '1' };
        break;
      case 'STEP':
        params = { type: 'INPUT', title: translations.profile.stepsGoalTitle, description: '...', initialValue: '10000', unit: translations.profile.stepsUnit, iconType: 'step' };
        break;
      case 'WATER':
        params = { type: 'INPUT', title: translations.profile.waterGoalTitle, description: '...', initialValue: '2000', unit: translations.profile.waterUnit, iconType: 'water' };
        break;
      default: return; 
    }
    navigation.navigate(SCREENS.GOAL, params);
  };

  // --- Logic Restart Onboarding ---
  const handleRestartOnboarding = () => {
    // Navigate to the start of the onboarding flow (Current Weight)
    // We pass empty formData so user starts fresh, or could pass current data if we fetched it.
    navigation.navigate(SCREENS.CURRENT_WEIGHT, {
      formData: {
        currentWeight: "",
        height: "",
        age: "",
        targetWeight: "",
        gender: "MALE",
        activityLevel: "MODERATELY_ACTIVE",
        pace: "NORMAL",
      },
    });
  };

  console.log("onboard", onboardingData);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{translations.profile.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Banner PRO */}
        <View style={styles.proBanner}>
          <View style={styles.proHeaderRow}>
            <Aperture size={28} color={colors.primary} weight="duotone" />
            <Text style={styles.proTitle}>{translations.profile.proBannerTitle}</Text>
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>{translations.profile.proBadge}</Text>
            </View>
          </View>
          <Text style={styles.proDescription}>
            {translations.profile.proDescription}
          </Text>
          <TouchableOpacity style={styles.proButton}>
            <Text style={styles.proButtonText}>{translations.profile.proButton}</Text>
          </TouchableOpacity>
        </View>

        {/* Section: Mục tiêu */}
        <SectionGroup title={translations.profile.goals} styles={styles}>
          <ListItem theme={theme} styles={styles} Icon={Scales} title={translations.profile.weight} value={`${onboardingData?.target_weight || 70} kg`} onPress={() => handleNavigateToGoal('WEIGHT')} />
          <ListItem theme={theme} styles={styles} Icon={Fire} title={translations.profile.calories} value={`${onboardingData?.target_calories || 2045} kcal`} onPress={() => handleNavigateToGoal('CALO')} />
          <ListItem theme={theme} styles={styles} Icon={ChartPieSlice} title={translations.profile.nutrition} value={`${onboardingData?.target_protein || 102}/${onboardingData?.target_carbs || 256}/${onboardingData?.target_fat || 68} g`} />
          <ListItem theme={theme} styles={styles} Icon={ForkKnife} title={translations.profile.diet} value={translations.dietTypes[onboardingData?.diet_type] || onboardingData?.diet_type} onPress={() => handleNavigateToGoal('DIET')} />
          <ListItem theme={theme} styles={styles} Icon={Footprints} title={translations.profile.steps} value={`${onboardingData?.target_steps || 10000} bước`} onPress={() => handleNavigateToGoal('STEP')} />
          <ListItem theme={theme} styles={styles} Icon={Drop} title={translations.profile.water} value={`${onboardingData?.target_water || 2000} ml`} isLast onPress={() => handleNavigateToGoal('WATER')} />
        </SectionGroup>

        {/* Section: Tùy chỉnh */}
        <SectionGroup title={translations.profile.customization} styles={styles}>
          <ListItem 
            theme={theme} 
            styles={styles} 
            Icon={ArrowCounterClockwise} 
            title={translations.profile.restart} 
            onPress={handleRestartOnboarding}
          />
          <ListItem theme={theme} styles={styles} Icon={Bell} title={translations.profile.reminders} />
          
          {/* --- TOGGLE DARK MODE HIỂN THỊ Ở NGOÀI --- */}
          <ListItem 
            theme={theme} styles={styles}
            Icon={Moon} 
            title={translations.profile.darkMode} 
            isSwitch 
            switchValue={isDarkMode}
            onSwitchChange={handleToggleDarkMode}
          />
          
          <ListItem theme={theme} styles={styles} Icon={Translate} title={translations.profile.language} value={getCurrentLanguageName()} onPress={() => navigation.navigate(SCREENS.CHOOSE_LANGUAGE)} />
          
          <View style={styles.toggleItemWrapper}>
            <ListItem 
              theme={theme} styles={styles}
              Icon={FireSimple} 
              title={translations.profile.addBurnedCalories} 
              isSwitch 
              switchValue={isEnabledBurn}
              onSwitchChange={setIsEnabledBurn}
              isLast
            />
            <Text style={styles.subText}>{translations.profile.addBurnedCaloriesDesc}</Text>
          </View>
           <View style={styles.divider} />

          <View style={styles.toggleItemWrapper}>
            <ListItem 
              theme={theme} styles={styles}
              Icon={Ruler} 
              title={translations.profile.metricSystem} 
              isSwitch 
              switchValue={isEnabledMetric}
              onSwitchChange={setIsEnabledMetric}
              isLast
            />
             <Text style={styles.subText}>{translations.profile.metricSystemDesc}</Text>
          </View>
        </SectionGroup>

        {/* Section: Khác */}
        <SectionGroup title={translations.profile.other} styles={styles}>
          <ListItem theme={theme} styles={styles} Icon={Star} title={translations.profile.rateApp} />
          <ListItem theme={theme} styles={styles} Icon={Gift} title={translations.profile.freeQuota} />
          <ListItem theme={theme} styles={styles} Icon={ChatCircleDots} title={translations.profile.support} />
          <ListItem theme={theme} styles={styles} Icon={ShieldCheck} title={translations.profile.privacyPolicy} value={<ArrowSquareOut size={18} color={arrowIconColor} />} hasArrow={false} />
          <ListItem theme={theme} styles={styles} Icon={Info} title={translations.profile.termsOfUse} value={<ArrowSquareOut size={18} color={arrowIconColor} />} hasArrow={false} />
          <ListItem theme={theme} styles={styles} Icon={FileText} title={translations.profile.medicalSources} />
          <ListItem theme={theme} styles={styles} Icon={Trash} title={translations.profile.deleteAccount} color={colors.notification} isLast hasArrow={false} />
          <View style={{paddingHorizontal: 16, paddingBottom: 12}}>
             <Text style={styles.subText}>{translations.profile.deleteAccountDesc}</Text>
          </View>
        </SectionGroup>

        {/* Section: Tài khoản */}
        <SectionGroup title={translations.profile.account} styles={styles}>
           <ListItem theme={theme} styles={styles} Icon={Fingerprint} title={translations.profile.id} value="cdd420...6bf0" hasArrow={false} isLast />
        </SectionGroup>

        {/* Section: Theo dõi */}
        <SectionGroup title={translations.profile.followUs} styles={styles}>
          <ListItem theme={theme} styles={styles} Icon={TiktokLogo} title={translations.profile.tiktok} value={<ArrowSquareOut size={18} color={arrowIconColor} />} hasArrow={false} />
          <ListItem theme={theme} styles={styles} Icon={FacebookLogo} title={translations.profile.facebook} value={<ArrowSquareOut size={18} color={arrowIconColor} />} hasArrow={false} isLast />
        </SectionGroup>

        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>{translations.profile.footerVersion}</Text>
          <Text style={styles.footerText}>{translations.profile.footerCopyright}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

export default SettingProfileScreen;