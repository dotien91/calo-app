import React from "react";
import * as NavigationService from "react-navigation-helpers";
import { useRoute } from "@react-navigation/native";
import { SCREENS } from "constants";
import { PlanCalculationData } from "@utils/plan.utils";
import { MeasurePicker } from "@shared-components/wheel-picker/MeasurePicker";

const CurrentWeightScreen: React.FC = () => {
  const route = useRoute();
  const formData = (route.params as any)?.formData as PlanCalculationData || {};
  const initialValue = parseFloat(String(formData.currentWeight)) || 70;

  const handleNext = (value: number) => {
    const updatedData = { ...formData, currentWeight: value };
    NavigationService.navigate(SCREENS.HEIGHT, { formData: updatedData });
  };

  const handleBack = () => {
    NavigationService.goBack();
  };

  return (
    <MeasurePicker
      type="WEIGHT"
      unit="kg"
      initialValue={initialValue}
      onNext={handleNext}
      onBack={handleBack}
      progress={14}
    />
  );
};

export default CurrentWeightScreen;
