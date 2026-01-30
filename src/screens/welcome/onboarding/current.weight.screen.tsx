import React from "react";
import { SafeAreaView, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute, useTheme } from "@react-navigation/native";
import { SCREENS } from "constants";
import { PlanCalculationData } from "@utils/plan.utils";
import { MeasurePicker } from "@shared-components/wheel-picker/MeasurePicker";

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
  const theme = useTheme();
  const bgColor = theme.colors.background;

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
      onNext={handleNext}
    />
  );

  if (props.skipHeader) {
    return <View style={{ flex: 1 }}>{picker}</View>;
  }

  const fromRouter = fromRoute != null;
  const containerStyle = { flex: 1, backgroundColor: bgColor };
  if (fromRouter) {
    return <SafeAreaView style={containerStyle}>{picker}</SafeAreaView>;
  }
  return <View style={containerStyle}>{picker}</View>;
};

export default CurrentWeightScreen;
