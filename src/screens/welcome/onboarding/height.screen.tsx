import React from "react";
import * as NavigationService from "react-navigation-helpers";
import { useRoute } from "@react-navigation/native";
import { SCREENS } from "constants";
import { PlanCalculationData } from "@utils/plan.utils";
import { MeasurePicker } from "@shared-components/wheel-picker/MeasurePicker";

const HeightScreen: React.FC = () => {
  const route = useRoute();
  const formData = (route.params as any)?.formData as PlanCalculationData || {};
  const initialValue = parseFloat(String(formData.height)) || 170;

  const handleNext = (value: number) => {
    const updatedData = { ...formData, height: value };
    NavigationService.navigate(SCREENS.AGE, { formData: updatedData });
  };

  const handleBack = () => {
    NavigationService.goBack();
  };

  return (
    <MeasurePicker
      type="HEIGHT"
      unit="cm"
      initialValue={initialValue}
      onNext={handleNext}
      onBack={handleBack}
      progress={28}
    />
  );
};

export default HeightScreen;
