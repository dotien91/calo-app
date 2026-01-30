import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

type ThemeLike = { dark?: boolean; colors: Record<string, string> };

/**
 * Best practice: useTheme() + createStyles(theme) — single source from navigation theme.
 * Same pattern as ChooseLanguageView / onboarding flow.
 */
export const getHomeColors = (theme: ThemeLike) => {
  const c = theme.colors;
  const dark = theme.dark ?? false;
  return {
    bg: c.background ?? (dark ? '#000000' : '#FFFFFF'),
    card: c.card ?? (dark ? '#1C1C1E' : '#F5F5F5'),
    text: c.text ?? (dark ? '#FFFFFF' : '#000000'),
    subText: c.textOpacity8 ?? c.text ?? (dark ? '#A0A0A0' : '#666666'),
    primary: c.primary ?? '#84CC16',
    accent: '#FACC15',
    blue: '#3B82F6',
    red: '#EF4444',
    borderColor: c.border ?? (dark ? '#333' : '#E5E7EB'),
    activeDateBg: dark ? '#2C2C2E' : '#E5E7EB',
    activeDateText: dark ? '#FFFFFF' : '#000000',
    progressBarBg: dark ? '#333' : (c.grey1 ?? '#E5E7EB'),
    iconBadgeBg: dark ? '#333' : (c.grey1 ?? '#F0F0F0'),
    iconBg: dark ? '#3A3A3C' : (c.grey1 ?? '#F0F0F0'),
    cardBg: dark ? '#2C2C2E' : (c.grey1 ?? '#E5E7EB'),
    bannerBg: c.card ?? (dark ? '#1C1C1E' : '#FFFFFF'),
    bannerText: c.text ?? (dark ? '#FFFFFF' : '#000000'),
    emptyIconColor: dark ? '#333' : '#CCCCCC',
  };
};

export const createStyles = (theme: ThemeLike) => {
  const COLORS = getHomeColors(theme);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.bg,
    },
    headerSection: {
      paddingHorizontal: 12,
      marginBottom: 12,
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
      borderColor: COLORS.borderColor,
      backgroundColor: 'transparent',
    },
    activeDate: {
      backgroundColor: COLORS.activeDateBg,
      borderColor: COLORS.activeDateBg,
    },
    dateText: {
      color: COLORS.subText,
      fontSize: 14,
      fontWeight: '500',
    },
    dashboardCard: {
      backgroundColor: COLORS.card,
      marginHorizontal: 12,
      borderRadius: 24,
      padding: 20,
      marginBottom: 12,
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
    macroRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 12,
      marginBottom: 12,
    },
    macroCard: {
      backgroundColor: COLORS.card,
      width: (width - 48) / 3,
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
    dailyProgressRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 12,
      marginBottom: 12,
    },
    dailyProgressItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 16,
      width: (width - 40) / 2,
    },
    dailyProgressInfo: {
      marginLeft: 12,
      flex: 1,
    },
    dailyProgressLabel: {
      fontSize: 12,
      marginBottom: 4,
    },
    dailyProgressValue: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    bannerContainer: {
      marginHorizontal: 12,
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
      color: COLORS.bannerText,
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
    recentSection: {
      paddingHorizontal: 12,
    },
    sectionTitle: {
      color: COLORS.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
      opacity: 0.7,
    },
    emptyTitle: {
      color: COLORS.text,
      fontSize: 16,
      fontWeight: '600',
      marginTop: 4,
    },
    emptySub: {
      color: COLORS.subText,
      fontSize: 14,
      marginTop: 2,
      textAlign: 'center',
    },
  });
};
