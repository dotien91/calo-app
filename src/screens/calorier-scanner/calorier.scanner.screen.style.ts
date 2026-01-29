import { StyleSheet } from 'react-native';

export const createStyles = (isDarkMode: boolean) => {
  const COLORS = {
    bg: isDarkMode ? '#000000' : '#FFFFFF',
    card: isDarkMode ? '#1C1C1E' : '#F5F5F5',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    subText: isDarkMode ? '#8E8E93' : '#666666',
    border: isDarkMode ? '#2C2C2E' : '#E5E7EB',
    separator: isDarkMode ? '#2C2C2E' : '#E5E7EB',
    cardSecondary: isDarkMode ? '#2C2C2E' : '#EEEEEE',
    textSecondary: isDarkMode ? '#D1D1D6' : '#333333',
    saveBtnBg: isDarkMode ? '#FFFFFF' : '#000000',
    saveBtnText: isDarkMode ? '#000000' : '#FFFFFF',
    accent: '#2ECC71',
    iconMuted: isDarkMode ? '#3A3A3C' : '#888888',
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.bg,
    },
  });

  return { COLORS, styles };
};
