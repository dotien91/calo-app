import { StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';
import { ExtendedTheme } from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  scrollContent: ViewStyle;
  // Banner
  proBanner: ViewStyle;
  proHeaderRow: ViewStyle;
  proTitle: TextStyle;
  proBadge: ViewStyle;
  proBadgeText: TextStyle;
  proDescription: TextStyle;
  proButton: ViewStyle;
  proButtonText: TextStyle;
  // Section
  sectionWrapper: ViewStyle;
  sectionHeader: TextStyle;
  sectionContainer: ViewStyle;
  // List Item
  itemContainer: ViewStyle;
  itemLeft: ViewStyle;
  itemIcon: ViewStyle;
  itemTitle: TextStyle;
  itemRight: ViewStyle;
  itemValue: TextStyle;
  divider: ViewStyle;
  // Toggle & Misc
  toggleItemWrapper: ViewStyle;
  subText: TextStyle;
  footerInfo: ViewStyle;
  footerText: TextStyle;
}

export const createStyles = (theme: ExtendedTheme) => {
  const { colors, dark } = theme;

  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background, // Theme: Đen (Dark) / Trắng (Light)
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginTop: Platform.OS === 'android' ? 10 : 0,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 100,
    },
    // --- Pro Banner Styles ---
    proBanner: {
      backgroundColor: dark ? '#151515' : '#F0F0F0', // Tự chỉnh màu nền banner theo mode
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: dark ? '#333' : '#E0E0E0',
      alignItems: 'center',
    },
    proHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    proTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
      marginLeft: 8,
      marginRight: 8,
    },
    proBadge: {
      backgroundColor: colors.notification, // Thường là màu đỏ
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    proBadgeText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 12,
    },
    proDescription: {
      color: dark ? '#CCCCCC' : '#666666',
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 20,
    },
    proButton: {
      backgroundColor: colors.primary, // Màu xanh nõn chuối (được config trong theme)
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 25,
      width: '100%',
      alignItems: 'center',
    },
    proButtonText: {
      color: dark ? '#000000' : '#FFFFFF', // Chữ trên nút
      fontWeight: 'bold',
      fontSize: 16,
    },
    // --- Section Styles ---
    sectionWrapper: {
      marginBottom: 24,
    },
    sectionHeader: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      marginLeft: 4,
    },
    sectionContainer: {
      backgroundColor: colors.card, // Theme: #1C1C1E (Dark) / #F2F2F7 (Light)
      borderRadius: 16,
      overflow: 'hidden',
    },
    // --- List Item Styles ---
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    itemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemIcon: {
      marginRight: 12,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    itemRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemValue: {
      color: dark ? '#8E8E93' : '#888888', // Màu phụ
      fontSize: 15,
      marginRight: 8,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border, // Theme: Border color
      marginLeft: 52,
    },
    toggleItemWrapper: {},
    subText: {
      color: dark ? '#8E8E93' : '#888888',
      fontSize: 13,
      paddingLeft: 52,
      paddingRight: 16,
      paddingBottom: 12,
      marginTop: -8,
    },
    // --- Footer Info ---
    footerInfo: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    footerText: {
      color: dark ? '#555555' : '#999999',
      fontSize: 12,
      marginBottom: 4,
    },
  });
};