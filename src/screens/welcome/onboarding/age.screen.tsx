import React, { useMemo } from "react";
import { SafeAreaView, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute, useTheme } from "@react-navigation/native";
import { SCREENS } from "constants";
import { PlanCalculationData } from "@utils/plan.utils";
import {
  MeasurePicker,
  MeasurePickerHeader,
} from "@shared-components/wheel-picker/MeasurePicker";

export interface AgeScreenProps {
  formData?: PlanCalculationData;
  onNext?: (value: number) => void;
  onBack?: () => void;
  progress?: number;
  skipHeader?: boolean;
}

const AgeScreen: React.FC<AgeScreenProps> = (props) => {
  const route = useRoute();
  const fromRoute = (route.params as any)?.formData as PlanCalculationData | undefined;
  const formData = (props.formData ?? fromRoute ?? {}) as PlanCalculationData;
  const initialValue = parseFloat(String(formData.age)) || 25;
  const progress = props.progress ?? 42;
  const theme = useTheme();
  const bgColor = theme.colors.background;

  const handleNext = (value: number) => {
    if (props.onNext) {
      props.onNext(value);
    } else {
      const updatedData = { ...formData, age: value };
      NavigationService.navigate(SCREENS.TARGET_WEIGHT, { formData: updatedData });
    }
  };

  const handleBack = () => {
    if (props.onBack) props.onBack();
    else NavigationService.goBack();
  };

  const picker = (
    <MeasurePicker
      type="AGE"
      unit="tuổi"
      initialValue={initialValue}
      onNext={handleNext}
    />
  );

  if (props.skipHeader) {
    return <View style={{ flex: 1 }}>{picker}</View>;
  }

  const fromRouter = fromRoute != null;
  const content = (
    <>
      <MeasurePickerHeader onBack={handleBack} progress={progress} />
      {picker}
    </>
  );
  const containerStyle = { flex: 1, backgroundColor: bgColor };
  if (fromRouter) {
    return <SafeAreaView style={containerStyle}>{content}</SafeAreaView>;
  }
  return <View style={containerStyle}>{content}</View>;
};

export default AgeScreen;
