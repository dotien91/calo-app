import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Platform,
} from "react-native";
import { Picker } from "react-native-wheel-pick";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { palette } from "@theme/themes";
import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";
import useStore from "@services/zustand/store";

import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useAnimatedStyle, 
  withTiming,
  Easing
} from "react-native-reanimated";

// --- CẤU HÌNH MÀU SẮC ---
export const getColors = (isLightMode: boolean) => ({
  bg: isLightMode ? "#FFFFFF" : "#000000",
  text: isLightMode ? "#000000" : "#FFFFFF",
  subText: isLightMode ? palette.textOpacity8 : "#A0A0A0",
  progressBg: isLightMode ? palette.grey1 : "#333333",
  footerBorder: isLightMode ? palette.grey1 : "#333333",
});

// --- COMPONENT HEADER ---
export interface MeasurePickerHeaderProps {
  onBack: () => void;
  progress: number;
}

export const MeasurePickerHeader: React.FC<MeasurePickerHeaderProps> = ({
  onBack,
  progress,
}) => {
  const isLightMode = useStore((state) => state.isLightMode);
  const COLORS = useMemo(() => getColors(isLightMode), [isLightMode]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${progress}%`, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    };
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
      <View style={[headerStyles.progressBg, { backgroundColor: COLORS.progressBg }]}>
        <Animated.View
          style={[headerStyles.progressFill, animatedProgressStyle]}
        />
      </View>
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
interface MeasurePickerProps {
  type: "HEIGHT" | "WEIGHT" | "AGE";
  unit: string;
  initialValue: number;
  onNext: (value: number) => void;
  title?: string;
}

export const MeasurePicker: React.FC<MeasurePickerProps> = ({
  type,
  unit,
  initialValue,
  onNext,
  title: titleOverride,
}) => {
  const isLightMode = useStore((state) => state.isLightMode);
  const COLORS = useMemo(() => getColors(isLightMode), [isLightMode]);
  const pickerTextColor = isLightMode ? "#000000" : "#FFFFFF";
  
  const isDecimal = type === "WEIGHT";
  const isAge = type === "AGE";

  // --- CẤU HÌNH CỠ CHỮ ---
  const FONT_SIZE = 18; // Đã giảm từ 32 xuống 23
  const ITEM_SPACE = 28; // Khoảng cách giữa các số

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

  const handleNextPress = () => {
    let finalValue: number;
    if (isDecimal) {
      finalValue = parseFloat(`${selectedInt}.${selectedDec}`);
    } else {
      finalValue = parseInt(selectedInt);
    }
    onNext(finalValue);
  };

  const getTitle = () => {
    if (titleOverride) return titleOverride;
    if (type === "HEIGHT") return "Bạn cao bao nhiêu?";
    if (type === "WEIGHT") return "Cân nặng hiện tại của bạn là bao nhiêu?";
    return "Bạn bao nhiêu tuổi?";
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
      
      <Animated.View
        style={styles.textContainer}
        entering={FadeInDown.delay(100).duration(500).springify()}
      >
        <TextBase 
            fontSize={24} 
            fontWeight="700" 
            style={[styles.title, { color: COLORS.text }]}
        >
          {getTitle()}
        </TextBase>
        <TextBase 
            fontSize={16} 
            fontWeight="400" 
            style={[styles.subtitle, { color: COLORS.subText }]}
        >
          Đừng lo lắng, bạn có thể thay đổi điều này bất cứ lúc nào
        </TextBase>
      </Animated.View>

      <Animated.View
        style={styles.pickerWrapper}
        entering={FadeInUp.delay(300).duration(600).springify()}
      >
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
            
            // --- SỬA CỠ CHỮ Ở ĐÂY ---
            textSize={FONT_SIZE} 
            itemSpace={ITEM_SPACE}
            itemStyle={{
                color: pickerTextColor, 
                fontSize: FONT_SIZE, // Cập nhật style item
                fontWeight: '600'
            }}
          />

          {isDecimal && (
            <>
              {/* Dấu chấm cũng phải nhỏ theo */}
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
                
                // --- SỬA CỠ CHỮ Ở ĐÂY ---
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
      </Animated.View>

      <Animated.View
        style={[styles.footer, { borderTopColor: COLORS.footerBorder }]}
        entering={FadeInUp.delay(500).duration(500)}
      >
        <Button
          style={styles.button}
          text="Tiếp theo"
          backgroundColor={palette.primary}
          textColor="#FFFFFF"
          onPress={handleNextPress}
        />
      </Animated.View>
    </SafeAreaView>
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
    // fontSize sẽ được ghi đè bởi style inline trong component
    fontWeight: "600",
    marginBottom: 8,
    marginHorizontal: 5,
  },
  unitLabel: {
    fontSize: 18,
    marginLeft: 15,
    marginBottom: 5,
    fontWeight: "500",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    marginBottom: Platform.OS === "android" ? 10 : 0,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    height: 50,
  },
});