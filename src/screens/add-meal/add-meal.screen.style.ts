import { StyleSheet } from 'react-native';

export const createStyles = (isDarkMode: boolean) => {
  const COLORS = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    card: isDarkMode ? '#1C1C1E' : '#F5F5F5',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    subText: isDarkMode ? '#A0A0A0' : '#666666',
    border: isDarkMode ? '#333333' : '#E5E7EB',
    primary: '#84CC16',
  };

  return {
    COLORS: COLORS,
    styles: StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: COLORS.background,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
      },
      backButton: {
        padding: 8,
      },
      headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
      },
      saveButton: {
        padding: 8,
      },
      saveButtonDisabled: {
        opacity: 0.5,
      },
      scrollView: {
        flex: 1,
        paddingHorizontal: 16,
      },
      imageSection: {
        marginTop: 20,
        marginBottom: 24,
      },
      sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 12,
      },
      imageContainer: {
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: COLORS.card,
      },
      image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
      },
      removeImageButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 16,
        padding: 6,
      },
      imagePicker: {
        height: 200,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: COLORS.border,
        backgroundColor: COLORS.card,
        justifyContent: 'center',
        alignItems: 'center',
      },
      imagePickerText: {
        marginTop: 8,
        fontSize: 14,
        color: COLORS.subText,
        textAlign: 'center',
      },
      formSection: {
        marginBottom: 24,
      },
      inputContainer: {
        marginBottom: 16,
      },
      inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 8,
      },
      textInput: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: COLORS.text,
        backgroundColor: COLORS.card,
      },
      subSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 12,
        marginTop: 8,
      },
      macrosRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      macroInput: {
        flex: 1,
        marginHorizontal: 4,
      },
    }),
  };
};