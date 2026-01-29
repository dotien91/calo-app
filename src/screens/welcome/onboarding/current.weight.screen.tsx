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
  const progress = props.progress ?? 14;
  const isLightMode = useStore((state) => state.isLightMode);
  const COLORS = useMemo(() => getColors(isLightMode), [isLightMode]);

  const handleNext = (value: number) => {
    if (props.onNext) {
      props.onNext(value);
    } else {
      const updatedData = { ...formData, currentWeight: value };
      NavigationService.navigate(SCREENS.HEIGHT, { formData: updatedData });
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

export default CurrentWeightScreen;
