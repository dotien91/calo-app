import { StyleSheet, ViewStyle, TextStyle, Platform, Dimensions } from 'react-native';
import { ExtendedTheme } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface Style {
  container: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  backButton: ViewStyle;
  content: ViewStyle;
  // --- Type: Input ---
  iconWrapper: ViewStyle;
  descriptionBox: ViewStyle;
  descriptionText: TextStyle;
  inputWrapper: ViewStyle;
  textInput: TextStyle;
  unitText: TextStyle;
  underline: ViewStyle;
  // --- Type: Selection (Diet) ---
  selectionListContent: ViewStyle;
  dietCard: ViewStyle;
  dietCardActive: ViewStyle;
  dietHeaderRow: ViewStyle;
  dietTitle: TextStyle;
  dietDesc: TextStyle;
  dietMacros: TextStyle;
  // --- Type: Wheel Picker (Weight) ---
  pickerContainer: ViewStyle;
  pickerWrapper: ViewStyle;
  pickerColumn: ViewStyle;
  pickerItem: ViewStyle;
  pickerText: TextStyle;
  pickerUnit: TextStyle;
  pickerOverlay: ViewStyle;
  // --- Footer ---
  buttonContainer: ViewStyle;
  saveButton: ViewStyle;
  saveButtonText: TextStyle;
}

export const createStyles = (theme: ExtendedTheme) => {
  const { colors, dark } = theme;

  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background, // Quan trọng: Đen (Dark) / Trắng (Light)
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: Platform.OS === 'android' ? 10 : 0,
      height: 50,
      marginBottom: 10,
    },
    backButton: {
      position: 'absolute',
      left: 16,
      padding: 8,
      zIndex: 10,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    
    // --- Type: Input (Step/Water) ---
    iconWrapper: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primary, // Màu xanh nõn chuối
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      marginTop: 20,
    },
    descriptionBox: {
      backgroundColor: colors.card, // Màu xám đậm (#1C1C1E) trong Darkmode
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 16,
      width: '100%',
      marginBottom: 40,
    },
    descriptionText: {
      color: dark ? '#CCCCCC' : '#666666',
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 22,
    },
    inputWrapper: {
      alignItems: 'center',
      width: '100%',
      marginBottom: 40,
    },
    textInput: {
      fontSize: 48,
      fontWeight: 'bold',
      color: colors.text, // Chữ trắng (Dark) / đen (Light)
      textAlign: 'center',
      minWidth: 150,
      padding: 0,
    },
    underline: {
      height: 2,
      width: 120,
      backgroundColor: colors.primary,
      marginTop: 8,
      marginBottom: 12,
    },
    unitText: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.6,
    },

    // --- Type: Selection (Diet) ---
    selectionListContent: {
      paddingBottom: 120, 
      width: '100%',
    },
    dietCard: {
      backgroundColor: colors.card, // Nền card xám
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    dietCardActive: {
      backgroundColor: colors.primary, // Nền xanh khi Active
    },
    dietHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    dietTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    dietDesc: {
      fontSize: 14,
      color: dark ? '#AAAAAA' : '#666666',
      marginBottom: 8,
    },
    dietMacros: {
      fontSize: 13,
      color: colors.primary, // Chữ xanh khi chưa active
      fontWeight: '500',
    },

    // --- Type: Wheel Picker (Weight) ---
    pickerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    pickerWrapper: {
      flexDirection: 'row',
      height: 200,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    pickerColumn: {
      height: 200,
      width: 80,
    },
    pickerItem: {
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pickerText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
    },
    pickerUnit: {
      fontSize: 18,
      color: colors.text,
      opacity: 0.6,
      marginLeft: 10,
      marginBottom: 8,
    },
    pickerOverlay: {
      position: 'absolute',
      height: 50,
      width: width - 48,
      backgroundColor: colors.card, // Vệt sáng highlight ở giữa wheel
      borderRadius: 25,
      zIndex: -1, 
    },

    // --- Footer ---
    buttonContainer: {
      position: 'absolute',
      bottom: 30,
      left: 24,
      right: 24,
    },
    saveButton: {
      backgroundColor: colors.text, // Nút Trắng (Dark)
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveButtonText: {
      color: colors.background, // Chữ Đen (Dark)
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
};