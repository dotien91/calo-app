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
  const isLightMode = useStore((state) => state.isLightMode);
  const COLORS = useMemo(() => getColors(isLightMode), [isLightMode]);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <MeasurePickerHeader onBack={handleBack} progress={progress} />
      {picker}
    </SafeAreaView>
  );
};

export default AgeScreen;
