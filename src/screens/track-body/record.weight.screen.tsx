import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useTheme, ExtendedTheme } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

// --- Imports Components ---
import { MeasurePicker } from "@shared-components/wheel-picker/MeasurePicker";
import Button from "@shared-components/button/Button";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import { createTracking } from "@services/api/track.api";
import {
  showToast,
  showSuperModal,
  EnumModalContentType,
  EnumStyleModalType,
} from "@helpers/super.modal.helper";

// --- Interfaces ---
interface RecordWeightScreenProps {
  initialWeight?: number;
  onSave?: (weight: number, date: Date) => void;
}

// --- Main Component ---
const RecordWeightScreen: React.FC<RecordWeightScreenProps> = (props) => {
  const navigation = useNavigation();
  
  // 1. Hook Theme
  const theme = useTheme();
  const { colors, dark } = theme;

  // 2. Styles
  const styles = useMemo(() => createStyles(theme), [theme]);

  // 3. States
  const [currentWeight, setCurrentWeight] = useState(props.initialWeight || 70.0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [saving, setSaving] = useState(false);

  // 4. Formatted Date
  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("en-GB").format(selectedDate);
  }, [selectedDate]);

  // 5. Handlers
  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    if (props.onSave) {
      props.onSave(currentWeight, selectedDate);
    } else {
      try {
        setSaving(true);
        const res: any = await createTracking({
          type: "body",
          metric: "weight",
          value: Number(currentWeight),
          tracked_at: selectedDate.toISOString(),
        });

        if (!res?.isError) {
          showToast({ type: "success", message: translations.save ?? "Lưu thành công" });
          navigation.goBack();
          return;
        }
        showToast({ type: "error", message: res?.message || "Có lỗi xảy ra" });
      } catch (e: any) {
        showToast({ type: "error", message: e?.message || "Có lỗi xảy ra" });
      } finally {
        setSaving(false);
      }
    }
  };

  const buttonBgColor = dark ? "#FFFFFF" : "#000000";
  const buttonTextColor = dark ? "#000000" : "#FFFFFF";

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {translations?.recordWeight?.title || "Ghi lại cân nặng"}
        </Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Date Display (Click mở Picker) */}
      <TouchableOpacity 
        style={styles.dateContainer} 
        onPress={() =>
          showSuperModal({
            contentModalType: EnumModalContentType.CalendarPicker,
            styleModalType: EnumStyleModalType.Middle,
            data: {
              selectedDate,
              onDateSelect: (date: Date) => setSelectedDate(date),
            },
          })
        }
      >
        <MaterialIcon
          name="calendar-month"
          size={20}
          color={palette?.green2 || "#4ADE80"}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.dateText}>{formattedDate}</Text>
      </TouchableOpacity>

      {/* Weight Picker Section */}
      <View style={styles.pickerSection}>
        <MeasurePicker
          type="WEIGHT"
          unit="kg"
          initialValue={currentWeight}
          onNext={() => {}}
          onValueChange={setCurrentWeight}
          title=""
        />
      </View>

      {/* Footer Button */}
      <View style={styles.footer}>
        <Button
          style={styles.saveButton}
          text={saving ? "Đang lưu..." : (translations.save ?? "Lưu lại")}
          backgroundColor={buttonBgColor}
          textColor={buttonTextColor}
          onPress={handleSave}
          disabled={saving}
        />
      </View>

    </SafeAreaView>
  );
};

export default RecordWeightScreen;

// --- Styles Definition ---
interface Style {
  container: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  headerTitle: TextStyle;
  headerRightPlaceholder: ViewStyle;
  dateContainer: ViewStyle;
  dateText: TextStyle;
  pickerSection: ViewStyle;
  footer: ViewStyle;
  saveButton: ViewStyle;
}

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    // Header
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    headerRightPlaceholder: {
      width: 32,
    },
    
    // Date
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
      marginBottom: 20,
      paddingVertical: 8,
    },
    dateText: {
      fontSize: 16,
      color: palette?.green2 || "#4ADE80",
      fontWeight: "500",
    },

    // Picker
    pickerSection: {
      flex: 1,
      justifyContent: "center",
    },

    // Footer
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      paddingTop: 10,
    },
    saveButton: {
      borderRadius: 30,
      height: 56,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
  });
};