import React, { useMemo } from "react";
import { SafeAreaView, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute } from "@react-navigation/native";
import { SCREENS } from "constants";
import { PlanCalculationData } from "@utils/plan.utils";
import useStore from "@services/zustand/store";
import {
  MeasurePicker,
  MeasurePickerHeader,
  getColors,
} from "@shared-components/wheel-picker/MeasurePicker";

export interface TargetWeightScreenProps {
  formData?: PlanCalculationData;
  onNext?: (value: number) => void;
  onBack?: () => void;
  progress?: number;
  skipHeader?: boolean;
}

const TargetWeightScreen: React.FC<TargetWeightScreenProps> = (props) => {
  const route = useRoute();
  const fromRoute = (route.params as any)?.formData as PlanCalculationData | undefined;
  const formData = (props.formData ?? fromRoute ?? {}) as PlanCalculationData;
  const initialValue = parseFloat(String(formData.targetWeight)) || 65;
  const progress = props.progress ?? 57;
  const isLightMode = useStore((state) => state.isLightMode);
  const COLORS = useMemo(() => getColors(isLightMode), [isLightMode]);

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

  const picker = (
    <MeasurePicker
      type="WEIGHT"
      unit="kg"
      initialValue={initialValue}
      title="Cân nặng mục tiêu của bạn là bao nhiêu?"
      onNext={handleNext}
    />
  );

  if (props.skipHeader) {
    return <View style={{ flex: 1 }}>{picker}</View>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <MeasurePickerHeader onBack={handleBack} progress={progress} />
      {picker}
    </SafeAreaView>
  );
};

export default TargetWeightScreen;
