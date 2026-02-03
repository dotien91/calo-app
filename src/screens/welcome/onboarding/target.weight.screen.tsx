import React, { useState, useMemo } from "react";
import { SafeAreaView, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute, useTheme } from "@react-navigation/native";
import { SCREENS } from "constants";
import { PlanCalculationData } from "@utils/plan.utils"; // Bỏ import calculateBMI ở đây
import { palette } from "@theme/themes";
import {
  MeasurePicker,
  MeasurePickerHeader,
} from "@shared-components/wheel-picker/MeasurePicker";
import Button from "@shared-components/button/Button";
import { createStyles } from "./onboarding.screen.style";
import { translations } from "@localization";

// Import Component mới vừa tạo (nhớ chỉnh đường dẫn import cho đúng vị trí file)
import BMIStatusView from "@shared-components/BMIStatusView"; 

export interface TargetWeightScreenProps {
  formData?: PlanCalculationData;
  onNext?: (value: number) => void;
  onBack?: () => void;
  progress?: number;
  skipHeader?: boolean;
}

const TargetWeightScreen: React.FC<TargetWeightScreenProps> = (props) => {
  const route = useRoute();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const bgColor = theme.colors.background;

  // Lấy dữ liệu
  const fromRoute = (route.params as any)?.formData as PlanCalculationData | undefined;
  const formData = (props.formData ?? fromRoute ?? {}) as PlanCalculationData;

  const initialValue = parseFloat(String(formData.targetWeight)) || 65;
  const heightVal = parseFloat(String(formData.height)) || 165; // Fallback height

  const [currentValue, setCurrentValue] = useState(initialValue);
  const progress = props.progress ?? 57;

  // --- LOGIC NAVIGATION ---
  const handleNext = (value: number) => {
    if (props.onNext) {
      props.onNext(value);
    } else {
      const updatedData = { ...formData, targetWeight: value };
      NavigationService.navigate(SCREENS.GENDER, { formData: updatedData });
    }
  };

  const handleBack = () => {
    if (props.onBack) props.onBack();
    else NavigationService.goBack();
  };

  const handleValueChange = (val: number) => {
    setCurrentValue(val);
  };

  // --- UI PARTS ---
  const picker = (
    <MeasurePicker
      type="WEIGHT"
      unit="kg"
      initialValue={initialValue}
      title={translations.onboarding?.targetWeightTitle ?? "Cân nặng mục tiêu của bạn là bao nhiêu?"}
      onNext={handleNext}
      onValueChange={handleValueChange}
    />
  );

  const footerButton = (
    <View style={styles.footer}>
      <Button
        style={styles.button}
        text={translations.next ?? "Tiếp theo"}
        backgroundColor={palette.primary}
        textColor="#FFFFFF"
        onPress={() => handleNext(currentValue)}
      />
    </View>
  );

  // --- CONTENT ---
  const content = (
    <>
      {!props.skipHeader && (
        <MeasurePickerHeader onBack={handleBack} progress={progress} />
      )}
      
      {picker}
      
      {/* Component BMI nằm gọn ở đây, tự xử lý logic và hiển thị */}
      <BMIStatusView weight={currentValue} height={heightVal} />
      
      {footerButton}
    </>
  );

  const containerStyle = { flex: 1, backgroundColor: bgColor };

  if (props.skipHeader) {
    return <View style={containerStyle}>{content}</View>;
  }

  const fromRouter = fromRoute != null;
  if (fromRouter) {
    return <SafeAreaView style={containerStyle}>{content}</SafeAreaView>;
  }
  return <View style={containerStyle}>{content}</View>;
};

export default TargetWeightScreen;