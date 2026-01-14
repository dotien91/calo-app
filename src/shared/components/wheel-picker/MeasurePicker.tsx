import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Text,
} from "react-native";
import { Picker } from "react-native-wheel-pick";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { palette } from "@theme/themes";
import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";

interface MeasurePickerProps {
  type: "HEIGHT" | "WEIGHT" | "AGE";
  unit: string;
  initialValue: number;
  onNext: (value: number) => void;
  onBack: () => void;
  progress?: number;
}

export const MeasurePicker: React.FC<MeasurePickerProps> = ({
  type,
  unit,
  initialValue,
  onNext,
  onBack,
  progress = 0,
}) => {
  const isDecimal = type === "WEIGHT";
  const isAge = type === "AGE";

  const minVal = isAge ? 10 : type === "HEIGHT" ? 100 : 30;
  const maxVal = isAge ? 100 : type === "HEIGHT" ? 250 : 300;
  const integers = Array.from(
    { length: maxVal - minVal + 1 },
    (_, i) => (minVal + i).toString()
  );
  const decimals = Array.from({ length: 10 }, (_, i) => i.toString());

  const [selectedInt, setSelectedInt] = useState(
    Math.floor(initialValue || minVal).toString()
  );
  const [selectedDec, setSelectedDec] = useState(
    Math.round(
      ((initialValue || 0) - Math.floor(initialValue || 0)) * 10
    ).toString()
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
    if (type === "HEIGHT") return "Bạn cao bao nhiêu?";
    if (type === "WEIGHT") return "Cân nặng hiện tại của bạn là bao nhiêu?";
    return "Bạn bao nhiêu tuổi?";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon
            name="chevron-left"
            type={IconType.Feather}
            size={28}
            color={palette.text}
          />
        </TouchableOpacity>

        <View style={styles.progressBg}>
          <View
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.textContainer}>
        <TextBase fontSize={24} fontWeight="700" color="text" style={styles.title}>
          {getTitle()}
        </TextBase>
        <TextBase
          fontSize={16}
          fontWeight="400"
          color="textOpacity8"
          style={styles.subtitle}
        >
          Đừng lo lắng, bạn có thể thay đổi điều này bất cứ lúc nào
        </TextBase>
      </View>

      <View style={styles.pickerWrapper}>
        <View style={styles.row}>
          <Picker
            style={styles.picker}
            selectedValue={selectedInt}
            pickerData={integers}
            onValueChange={setSelectedInt}
            textColor={palette.text}
            textSize={32}
            selectTextColor={palette.primary}
            isShowSelectBackground={false}
            selectBackgroundColor={palette.secondColor}
          />

          {isDecimal && (
            <>
              <Text style={styles.dot}>.</Text>
              <Picker
                style={styles.pickerDecimal}
                selectedValue={selectedDec}
                pickerData={decimals}
                onValueChange={setSelectedDec}
                textColor={palette.text}
                textSize={32}
                selectTextColor={palette.primary}
                isShowSelectBackground={false}
                selectBackgroundColor={palette.secondColor}
              />
            </>
          )}

          <Text style={styles.unitLabel}>{unit}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          style={styles.button}
          text="Tiếp theo"
          backgroundColor={palette.primary}
          textColor={palette.white}
          onPress={handleNextPress}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  progressBg: {
    flex: 1,
    height: 4,
    backgroundColor: palette.grey1,
    marginHorizontal: 20,
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: palette.primary,
    borderRadius: 2,
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
    height: 200,
  },
  picker: {
    width: 100,
    height: 180,
    backgroundColor: "transparent",
  },
  pickerDecimal: {
    width: 80,
    height: 180,
    backgroundColor: "transparent",
  },
  dot: {
    fontSize: 32,
    color: palette.text,
    fontWeight: "600",
    marginTop: 10,
  },
  unitLabel: {
    fontSize: 18,
    color: palette.textOpacity8,
    marginLeft: 10,
    marginTop: 10,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: palette.grey1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
});
