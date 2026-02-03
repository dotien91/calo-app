import React, { useState, useMemo } from "react";
import { SafeAreaView, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute, useTheme } from "@react-navigation/native";
import { SCREENS } from "constants";
import { PlanCalculationData } from "@utils/plan.utils";
import { palette } from "@theme/themes";
import { MeasurePicker } from "@shared-components/wheel-picker/MeasurePicker";
import Button from "@shared-components/button/Button";
import { createStyles } from "./onboarding.screen.style";
import { translations } from "@localization";

// Import component BMI đã tách riêng
import BMIStatusView from "@shared-components/BMIStatusView";

export interface CurrentWeightScreenProps {
  formData?: PlanCalculationData;
  onNext?: (value: number) => void;
  onBack?: () => void;
  progress?: number;
  /** Khi true: chỉ render MeasurePicker (header render ở flow) */
  skipHeader?: boolean;
}

const CurrentWeightScreen: React.FC<CurrentWeightScreenProps> = (props) => {
  const route = useRoute();
  const fromRoute = (route.params as any)?.formData as PlanCalculationData | undefined;
  const formData = (props.formData ?? fromRoute ?? {}) as PlanCalculationData;
  
  const initialValue = parseFloat(String(formData.currentWeight)) || 70;
  // Lấy chiều cao để tính BMI (nếu chưa có thì truyền 0 hoặc fallback tùy logic của bạn)
  const heightVal = parseFloat(String(formData.height)) || 0;

  const theme = useTheme();
  const bgColor = theme.colors.background;
  const [currentValue, setCurrentValue] = useState(initialValue);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleNext = (value: number) => {
    if (props.onNext) {
      props.onNext(value);
    } else {
      const updatedData = { ...formData, currentWeight: value };
      NavigationService.navigate(SCREENS.HEIGHT, { formData: updatedData });
    }
  };

  const picker = (
    <MeasurePicker
      type="WEIGHT"
      unit="kg"
      initialValue={initialValue}
      title={translations.onboarding?.currentWeightTitle ?? "Cân nặng hiện tại của bạn?"}
      onNext={handleNext}
      onValueChange={setCurrentValue}
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

  const content = (
    <>
      {picker}
      
      {/* Component hiển thị BMI realtime */}
      <BMIStatusView weight={currentValue} height={heightVal} />
      
      {footerButton}
    </>
  );

  if (props.skipHeader) {
    return <View style={{ flex: 1, backgroundColor: bgColor }}>{content}</View>;
  }

  const fromRouter = fromRoute != null;
  const containerStyle = { flex: 1, backgroundColor: bgColor };
  if (fromRouter) {
    return <SafeAreaView style={containerStyle}>{content}</SafeAreaView>;
  }
  return <View style={containerStyle}>{content}</View>;
};

export default CurrentWeightScreen;