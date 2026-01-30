import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text, Switch, SafeAreaView, Platform } from "react-native";
import { Picker } from "react-native-wheel-pick";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import { PlanCalculationData } from "@utils/plan.utils";
import TextBase from "@shared-components/TextBase";
import Button from "@shared-components/button/Button";
import { palette } from "@theme/themes";
import { MeasurePickerHeader, getColors } from "@shared-components/wheel-picker/MeasurePicker"; // Import helper màu từ file cũ
import useStore from "@services/zustand/store";

// Helper tạo mảng số
const createArray = (min: number, max: number) => {
  return Array.from({ length: max - min + 1 }, (_, i) => (min + i).toString());
};

export interface HeightWeightScreenProps {
  formData?: PlanCalculationData;
  onNext?: (height: number, weight: number) => void;
  onBack?: () => void;
  progress?: number;
  skipHeader?: boolean;
}

const HeightWeightScreen: React.FC<HeightWeightScreenProps> = (props) => {
  const isLightMode = useStore((state) => state.isLightMode);
  const theme = useTheme();
  const { colors } = theme;
  
  // 1. Tái sử dụng logic màu sắc của MeasurePicker để đồng bộ UI
  const COLORS = useMemo(() => getColors(isLightMode), [isLightMode]);
  const pickerTextColor = isLightMode ? "#000000" : "#FFFFFF";

  // Lấy dữ liệu ban đầu
  const initialHeight = parseFloat(String(props.formData?.height)) || 170;
  const initialWeight = parseFloat(String(props.formData?.currentWeight)) || 70;

  // State
  const [isImperial, setIsImperial] = useState(false); // Toggle Metric/Imperial
  const [heightVal, setHeightVal] = useState(Math.floor(initialHeight).toString());
  const [weightVal, setWeightVal] = useState(Math.floor(initialWeight).toString());

  // Data cho Picker
  const heightData = useMemo(() => createArray(100, 250), []);
  const weightData = useMemo(() => createArray(30, 200), []);

  const handleNext = () => {
    const h = parseInt(heightVal);
    const w = parseInt(weightVal);
    if (props.onNext) {
      props.onNext(h, w);
    }
  };

  const handleBack = () => {
    if (props.onBack) props.onBack();
    else NavigationService.goBack();
  };

  // Cấu hình Font size giống MeasurePicker cũ
  const FONT_SIZE = 23;

  const Content = (
    <View style={[styles.container, { backgroundColor: COLORS.bg }]}>
      
      {/* 1. Header Text */}
      <View style={styles.textContainer}>
        <TextBase 
            fontSize={24} 
            fontWeight="700" 
            style={[styles.title, { color: COLORS.text }]}
        >
          Height & Weight
        </TextBase>
        <TextBase 
            fontSize={16} 
            fontWeight="400" 
            style={[styles.subtitle, { color: COLORS.subText }]}
        >
          Thông tin này giúp chúng tôi tính toán lộ trình phù hợp cho bạn.
        </TextBase>
      </View>

      {/* 2. Switcher (Imperial / Metric) */}
      <View style={styles.switchContainer}>
        <Text style={[styles.switchLabel, { color: !isImperial ? COLORS.text : COLORS.subText }]}>
            Metric
        </Text>
        <Switch
          trackColor={{ false: palette.grey2, true: palette.grey2 }}
          thumbColor={palette.white}
          ios_backgroundColor={palette.grey2}
          onValueChange={() => setIsImperial(!isImperial)}
          value={isImperial}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
        <Text style={[styles.switchLabel, { color: isImperial ? COLORS.text : COLORS.subText }]}>
            Imperial
        </Text>
      </View>

      {/* 3. Labels Row */}
      <View style={styles.labelRow}>
        <Text style={[styles.columnLabel, { color: COLORS.text }]}>Height</Text>
        <Text style={[styles.columnLabel, { color: COLORS.text }]}>Weight</Text>
      </View>

      {/* 4. Dual Pickers */}
      <View style={styles.pickerContainer}>
        {/* Cột Chiều cao */}
        <View style={styles.pickerColumn}>
          <View style={styles.pickerRowInner}>
            <Picker
                style={styles.picker}
                selectedValue={heightVal}
                pickerData={heightData}
                onValueChange={setHeightVal}
                textColor={pickerTextColor}
                selectTextColor={pickerTextColor}
                backgroundColor="transparent"
                isShowSelectBackground={false}
                textSize={FONT_SIZE}
                itemStyle={{ color: pickerTextColor, fontSize: FONT_SIZE, fontWeight: '600' }}
            />
            <Text style={[styles.unitText, { color: COLORS.subText }]}>cm</Text>
          </View>
        </View>

        {/* Divider ảo ở giữa (tùy chọn) */}
        <View style={{ width: 1, height: 100, backgroundColor: COLORS.footerBorder }} />

        {/* Cột Cân nặng */}
        <View style={styles.pickerColumn}>
           <View style={styles.pickerRowInner}>
            <Picker
                style={styles.picker}
                selectedValue={weightVal}
                pickerData={weightData}
                onValueChange={setWeightVal}
                textColor={pickerTextColor}
                selectTextColor={pickerTextColor}
                backgroundColor="transparent"
                isShowSelectBackground={false}
                textSize={FONT_SIZE}
                itemStyle={{ color: pickerTextColor, fontSize: FONT_SIZE, fontWeight: '600' }}
            />
            <Text style={[styles.unitText, { color: COLORS.subText }]}>kg</Text>
          </View>
        </View>
      </View>

      {/* 5. Footer Button */}
      <View style={[styles.footer, { borderTopColor: COLORS.footerBorder }]}>
        <Button
          style={styles.button}
          text="Tiếp theo"
          backgroundColor={palette.primary}
          textColor="#FFFFFF"
          onPress={handleNext}
        />
      </View>
    </View>
  );

  if (props.skipHeader) return Content;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <MeasurePickerHeader onBack={handleBack} progress={props.progress || 0} />
      {Content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 20,
  },
  
  // Switch
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Labels
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  columnLabel: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },

  // Pickers Area
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    maxHeight: 250, // Giới hạn chiều cao khu vực picker
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    width: 70, // Nhỏ hơn một chút để vừa 2 cột
    height: 200,
    backgroundColor: 'transparent',
  },
  unitText: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 5,
    marginTop: 5,
  },

  // Footer
  footer: {
    padding: 16,
    borderTopWidth: 1,
    marginTop: 'auto', // Đẩy xuống đáy
    marginBottom: Platform.OS === "android" ? 10 : 0,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    height: 50,
  },
});

export default HeightWeightScreen;