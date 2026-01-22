import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const createStyles = (isDarkMode: boolean) => {
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.bg,
    },
    // Header
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

    // Macros
    macroRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 12,
      marginBottom: 12,
    },
    macroCard: {
      backgroundColor: COLORS.card,
      width: (width - 48) / 3, // Updated for marginHorizontal: 12 (24 total margin + 24 spacing)
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

    // Daily Progress
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
      width: (width - 40) / 2, // Updated for marginHorizontal: 12 (24 total margin + 16 spacing)
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

    // Banner
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

  return { COLORS, styles };
};