import React from "react";
import * as NavigationService from "react-navigation-helpers";
import { useRoute } from "@react-navigation/native";
import { SCREENS } from "constants";
import { PlanCalculationData } from "@utils/plan.utils";
import { MeasurePicker } from "@shared-components/wheel-picker/MeasurePicker";

const AgeScreen: React.FC = () => {
  const route = useRoute();
  const formData = (route.params as any)?.formData as PlanCalculationData || {};
  const initialValue = parseFloat(String(formData.age)) || 25;

  const handleNext = (value: number) => {
    const updatedData = { ...formData, age: value };
    NavigationService.navigate(SCREENS.TARGET_WEIGHT, { formData: updatedData });
  };

  const handleBack = () => {
    NavigationService.goBack();
  };

  return (
    <MeasurePicker
      type="AGE"
      unit="tuổi"
      initialValue={initialValue}
      onNext={handleNext}
      onBack={handleBack}
      progress={42}
    />
  );
};

export default AgeScreen;
