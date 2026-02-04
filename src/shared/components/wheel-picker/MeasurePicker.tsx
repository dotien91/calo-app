import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { Picker } from "react-native-wheel-pick";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { useTheme } from "@react-navigation/native";
import { palette } from "@theme/themes";
import TextBase from "@shared-components/TextBase";
import { translations } from "@localization";

// --- Theme-based colors (best practice: single source from navigation theme) ---
type ThemeLike = { dark?: boolean; colors: Record<string, string> };
export const getColorsFromTheme = (theme: ThemeLike) => ({
  bg: theme.colors.background ?? (theme.dark ? "#000000" : "#FFFFFF"),
  text: theme.colors.text ?? (theme.dark ? "#FFFFFF" : "#000000"),
  subText: theme.colors.textOpacity8 ?? theme.colors.text ?? (theme.dark ? "#A0A0A0" : palette.textOpacity8),
  progressBg: theme.dark ? "#333333" : (theme.colors.grey1 ?? palette.grey1),
});

/** @deprecated Use getColorsFromTheme(useTheme()) instead */
export const getColors = (isLightMode: boolean) =>
  getColorsFromTheme({ dark: !isLightMode, colors: {} });

// --- COMPONENT HEADER (Có Animation) ---
export interface MeasurePickerHeaderProps {
  onBack: () => void;
  progress: number;
  step: number;
}

export const MeasurePickerHeader: React.FC<MeasurePickerHeaderProps> = ({
  onBack,
  progress,
  step,
}) => {
  const theme = useTheme();
  const COLORS = getColorsFromTheme(theme);

  // 1. Tạo giá trị Animated khởi tạo bằng progress hiện tại
  const progressAnim = useRef(new Animated.Value(progress)).current;

  // 2. Chạy Animation khi progress thay đổi
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500, // Thời gian chạy animation (ms)
      useNativeDriver: false, // Bắt buộc false vì ta đang animate thuộc tính layout (width)
    }).start();
  }, [progress]);

  // 3. Chuyển đổi giá trị số (0-100) sang phần trăm ('0%' - '100%')
  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[headerStyles.wrapper, { backgroundColor: COLORS.bg }]}>
      <TouchableOpacity onPress={onBack} style={headerStyles.backButton}>
        <Icon
          name="chevron-left"
          type={IconType.Feather}
          size={28}
          color={COLORS.text}
        />
      </TouchableOpacity>
      {step !== 7 && <View style={[headerStyles.progressBg, { backgroundColor: COLORS.progressBg }]}>
        {/* Dùng Animated.View thay vì View thường */}
        <Animated.View
          style={[
            headerStyles.progressFill,
            { width: widthInterpolated }, 
          ]}
        />
      </View>}
      <View style={headerStyles.spacer} />
    </View>
  );
};

const headerStyles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    justifyContent: "space-between",
  },
  backButton: { padding: 4 },
  progressBg: {
    flex: 1,
    height: 4,
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: palette.primary,
    borderRadius: 2,
  },
  spacer: { width: 28 },
});

// --- COMPONENT CHÍNH ---
export interface MeasurePickerProps {
  type: "HEIGHT" | "WEIGHT" | "AGE";
  unit: string;
  initialValue: number;
  onNext: (value: number) => void;
  /** Gọi khi giá trị picker thay đổi — dùng ở component cha để render nút "Tiếp theo" */
  onValueChange?: (value: number) => void;
  title?: string;
}

export const MeasurePicker: React.FC<MeasurePickerProps> = ({
  type,
  unit,
  initialValue,
  onNext: _onNext,
  onValueChange,
  title: titleOverride,
}) => {
  const theme = useTheme();
  const COLORS = getColorsFromTheme(theme);
  const pickerTextColor = COLORS.text;
  
  const isDecimal = type === "WEIGHT";
  const isAge = type === "AGE";

  // Cấu hình hiển thị
  const FONT_SIZE = 23;
  const ITEM_SPACE = 28; 

  // Logic tạo mảng dữ liệu
  const minVal = isAge ? 10 : type === "HEIGHT" ? 100 : 30;
  const maxVal = isAge ? 100 : type === "HEIGHT" ? 250 : 300;
  
  const integers = useMemo(() => 
    Array.from({ length: maxVal - minVal + 1 }, (_, i) => (minVal + i).toString()),
    [maxVal, minVal]
  );
  const decimals = useMemo(() => 
    Array.from({ length: 10 }, (_, i) => i.toString()),
    []
  );

  const [selectedInt, setSelectedInt] = useState(
    Math.floor(initialValue || minVal).toString()
  );
  const [selectedDec, setSelectedDec] = useState(
    Math.round(((initialValue || 0) - Math.floor(initialValue || 0)) * 10).toString()
  );

  const currentValue = useMemo(() => {
    if (isDecimal) return parseFloat(`${selectedInt}.${selectedDec}`);
    return parseInt(selectedInt, 10);
  }, [isDecimal, selectedInt, selectedDec]);

  useEffect(() => {
    onValueChange?.(currentValue);
  }, [currentValue, onValueChange]);

  const getTitle = () => {
    if (titleOverride) return titleOverride;
    if (type === "HEIGHT") return translations.onboarding?.heightTitle ?? "Chiều cao của bạn là bao nhiêu?";
    if (type === "WEIGHT") return translations.onboarding?.currentWeightTitle ?? "Cân nặng hiện tại của bạn là bao nhiêu?";
    return translations.onboarding?.ageTitle ?? "Bạn bao nhiêu tuổi?";
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.bg }]}>
      
      {/* Text Section - Không dùng Animated */}
      <View style={styles.textContainer}>
        <TextBase 
            fontSize={24} 
            fontWeight="700" 
            style={{ ...styles.title, color: COLORS.text }}
        >
          {getTitle()}
        </TextBase>
        {type === "WEIGHT" && <TextBase 
            fontSize={16} 
            fontWeight="400" 
            style={{ ...styles.subtitle, color: COLORS.subText }}
        >
          {translations.onboarding?.changeAnytimeHint ?? "Đừng lo lắng, bạn có thể thay đổi điều này bất cứ lúc nào"}
        </TextBase>}
      </View>

      {/* Picker Section */}
      <View style={styles.pickerWrapper}>
        <View style={styles.row}>
          
          {/* Picker SỐ NGUYÊN */}
          <Picker
            style={styles.picker}
            selectedValue={selectedInt}
            pickerData={integers}
            onValueChange={setSelectedInt}
            
            textColor={pickerTextColor}
            selectTextColor={pickerTextColor}
            backgroundColor="transparent"
            isShowSelectBackground={false}
            
            textSize={FONT_SIZE} 
            itemSpace={ITEM_SPACE}
            itemStyle={{
                color: pickerTextColor, 
                fontSize: FONT_SIZE, 
                fontWeight: '600'
            }}
          />

          {isDecimal && (
            <>
              <Text style={[styles.dot, { color: COLORS.text, fontSize: FONT_SIZE }]}>.</Text>
              
              {/* Picker THẬP PHÂN */}
              <Picker
                style={styles.pickerDecimal}
                selectedValue={selectedDec}
                pickerData={decimals}
                onValueChange={setSelectedDec}
                
                textColor={pickerTextColor}
                selectTextColor={pickerTextColor}
                backgroundColor="transparent"
                isShowSelectBackground={false}
                
                textSize={FONT_SIZE}
                itemSpace={ITEM_SPACE}
                itemStyle={{
                    color: pickerTextColor, 
                    fontSize: FONT_SIZE,
                    fontWeight: '600'
                }}
              />
            </>
          )}

          <Text style={[styles.unitLabel, { color: COLORS.subText }]}>{unit}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 20,
  },
  pickerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 250,
    width: "100%",
  },
  picker: {
    width: 100,
    height: 200,
    backgroundColor: "transparent",
  },
  pickerDecimal: {
    width: 80,
    height: 200,
    backgroundColor: "transparent",
  },
  dot: {
    fontWeight: "600",
    marginBottom: 8,
    marginHorizontal: 5,
  },
  unitLabel: {
    fontSize: 18,
    marginLeft: 15,
    marginBottom: 5,
    marginTop: 18,
    fontWeight: "500",
  },
});