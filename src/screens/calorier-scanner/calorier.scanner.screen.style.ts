import { StyleSheet } from 'react-native';

export const createStyles = (isLightMode: boolean) => {
  const COLORS = {
    bg: isLightMode ? '#FFFFFF' : '#000000',
    card: isLightMode ? '#F5F5F5' : '#1C1C1E',
    text: isLightMode ? '#000000' : '#FFFFFF',
    subText: isLightMode ? '#666666' : '#8E8E93',
    border: isLightMode ? '#E5E7EB' : '#2C2C2E',
    separator: isLightMode ? '#E5E7EB' : '#2C2C2E',
    cardSecondary: isLightMode ? '#EEEEEE' : '#2C2C2E',
    textSecondary: isLightMode ? '#333333' : '#D1D1D6',
    saveBtnBg: isLightMode ? '#000000' : '#FFFFFF',
    saveBtnText: isLightMode ? '#FFFFFF' : '#000000',
    accent: '#2ECC71',
    iconMuted: isLightMode ? '#888888' : '#3A3A3C',
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.bg,
    },
  });

  return { COLORS, styles };
};
