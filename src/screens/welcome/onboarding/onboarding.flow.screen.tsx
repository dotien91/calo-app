import React, { useState, useMemo } from "react";
import { SafeAreaView } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute } from "@react-navigation/native";
import { SCREENS } from "constants";
import { PlanCalculationData, PlanResult } from "@utils/plan.utils";
import { _setJson, HAS_COMPLETED_ONBOARDING } from "@services/local-storage";
import {
  submitOnboarding,
  OnboardingData,
  Gender,
  ActivityLevel,
  WeightGoalPace,
} from "@services/api/calorie.api";
import useStore from "@services/zustand/store";
import { showToast } from "@helpers/super.modal.helper";
import { MeasurePickerHeader, getColors } from "@shared-components/wheel-picker/MeasurePicker";

import CurrentWeightScreen from "./current.weight.screen";
import HeightScreen from "./height.screen";
import AgeScreen from "./age.screen";
import TargetWeightScreen from "./target.weight.screen";
import GenderScreen from "./gender.screen";
import ActivityLevelScreen from "./activity.level.screen";
import PaceScreen from "./pace.screen";
import PlanResultScreen from "./plan.result.screen";

const PROGRESS_BY_STEP = [14, 28, 42, 57, 71, 85, 100, 100]; // 8 bước (0–7)

const defaultFormData: PlanCalculationData = {
  currentWeight: "",
  height: "",
  age: "",
  targetWeight: "",
  gender: "MALE",
  activityLevel: "MODERATELY_ACTIVE",
  pace: "NORMAL",
};

const OnboardingFlowScreen: React.FC = () => {
  const route = useRoute();
  const initialParams = (route.params as any)?.formData as PlanCalculationData | undefined;
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<PlanCalculationData>(() =>
    initialParams ? { ...defaultFormData, ...initialParams } : defaultFormData
  );
  const [planResult, setPlanResult] = useState<PlanResult | null>(null);
  const [loading, setLoading] = useState(false);

  const setOnboardingData = useStore((state) => state.setOnboardingData);
  const isLightMode = useStore((state) => state.isLightMode);
  const COLORS = useMemo(() => getColors(isLightMode), [isLightMode]);

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else NavigationService.goBack();
  };

  const updateFormAndNext = (updates: Partial<PlanCalculationData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setStep((prev) => prev + 1);
  };

  const handleFinishResult = async () => {
    if (!planResult) return;
    const onboardingData: OnboardingData = {
      gender: planResult.gender as Gender,
      age: planResult.age,
      height: planResult.height,
      currentWeight: planResult.currentWeight,
      targetWeight: planResult.targetWeight,
      activityLevel: planResult.activityLevel as ActivityLevel,
      pace: planResult.pace as WeightGoalPace,
    };
    try {
      setLoading(true);
      const response = await submitOnboarding(onboardingData);
      if (response.success) {
        setOnboardingData(response.data.onboarding);
        _setJson(HAS_COMPLETED_ONBOARDING, true);
        NavigationService.replace(SCREENS.TABS);
      } else {
        showToast({ type: "error", message: response.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRestartResult = () => {
    setFormData({
      currentWeight: planResult!.currentWeight,
      height: planResult!.height,
      age: planResult!.age.toString(),
      targetWeight: planResult!.targetWeight,
      gender: planResult!.gender,
      activityLevel: planResult!.activityLevel,
      pace: planResult!.pace,
    });
    setPlanResult(null);
    setStep(0);
  };

  // Một layout chung: thanh progress cho tất cả 8 bước, content bên dưới
  const progressValue = PROGRESS_BY_STEP[step] ?? 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <MeasurePickerHeader onBack={handleBack} progress={progressValue} />
      {step === 0 && (
        <CurrentWeightScreen
          formData={formData}
          onNext={(value) => updateFormAndNext({ currentWeight: value })}
          onBack={handleBack}
          progress={PROGRESS_BY_STEP[0]}
          skipHeader
        />
      )}
      {step === 1 && (
        <HeightScreen
          formData={formData}
          onNext={(value) => updateFormAndNext({ height: value })}
          onBack={handleBack}
          progress={PROGRESS_BY_STEP[1]}
          skipHeader
        />
      )}
      {step === 2 && (
        <AgeScreen
          formData={formData}
          onNext={(value) => updateFormAndNext({ age: value })}
          onBack={handleBack}
          progress={PROGRESS_BY_STEP[2]}
          skipHeader
        />
      )}
      {step === 3 && (
        <TargetWeightScreen
          formData={formData}
          onNext={(value) => updateFormAndNext({ targetWeight: value })}
          onBack={handleBack}
          progress={PROGRESS_BY_STEP[3]}
          skipHeader
        />
      )}
      {step === 4 && (
        <GenderScreen
          formData={formData}
          onNext={(updatedData) => {
            setFormData(updatedData);
            setStep(5);
          }}
          onBack={handleBack}
        />
      )}
      {step === 5 && (
        <ActivityLevelScreen
          formData={formData}
          onNext={(updatedData) => {
            setFormData(updatedData);
            setStep(6);
          }}
          onBack={handleBack}
        />
      )}
      {step === 6 && (
        <PaceScreen
          formData={formData}
          onNext={(result) => {
            setPlanResult(result);
            setStep(7);
          }}
          onBack={handleBack}
        />
      )}
      {step === 7 && planResult && (
        <PlanResultScreen
          planResult={planResult}
          onFinish={handleFinishResult}
          onRestart={handleRestartResult}
          loading={loading}
        />
      )}
    </SafeAreaView>
  );
};

export default OnboardingFlowScreen;
