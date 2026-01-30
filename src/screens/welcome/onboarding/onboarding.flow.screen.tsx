import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute, useTheme } from "@react-navigation/native";
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
import { MeasurePickerHeader } from "@shared-components/wheel-picker/MeasurePicker";

// --- IMPORT CÁC MÀN HÌNH CON ---
import HeightWeightScreen from "./height.weight.screen"; // Màn hình mới gộp
import AgeScreen from "./age.screen";
import TargetWeightScreen from "./target.weight.screen";
import GenderScreen from "./gender.screen";
import ActivityLevelScreen from "./activity.level.screen";
import PaceScreen from "./pace.screen";
import PlanResultScreen from "./plan.result.screen";

// Cập nhật lại thanh progress (7 bước: 0 -> 6)
// Tỉ lệ % tương ứng: 15%, 30%, 45%, 60%, 75%, 90%, 100%
const PROGRESS_BY_STEP = [15, 30, 45, 60, 75, 90, 100]; 

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
  const theme = useTheme();
  const { colors } = theme;

  // --- ACTIONS ---

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      NavigationService.goBack();
    }
  };

  // Helper cập nhật form và next step
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
    // Reset lại form với dữ liệu hiện tại để người dùng sửa nếu muốn
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
    setStep(0); // Quay về bước đầu tiên
  };

  // Lấy giá trị progress bar hiện tại
  const progressValue = PROGRESS_BY_STEP[step] ?? 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header chung cho toàn bộ flow */}
      <MeasurePickerHeader onBack={handleBack} progress={progressValue} />
      
      {/* STEP 0: Height & Weight (Gộp) */}
      {step === 0 && (
        <HeightWeightScreen
          formData={formData}
          onNext={(height, weight) => updateFormAndNext({ 
            height: height, 
            currentWeight: weight 
          })}
          onBack={handleBack}
          progress={PROGRESS_BY_STEP[0]}
          skipHeader // Header đã render ở trên
        />
      )}

      {/* STEP 1: Age */}
      {step === 1 && (
        <AgeScreen
          formData={formData}
          onNext={(value) => updateFormAndNext({ age: value })}
          onBack={handleBack}
          progress={PROGRESS_BY_STEP[1]}
          skipHeader
        />
      )}

      {/* STEP 2: Target Weight */}
      {step === 2 && (
        <TargetWeightScreen
          formData={formData}
          onNext={(value) => updateFormAndNext({ targetWeight: value })}
          onBack={handleBack}
          progress={PROGRESS_BY_STEP[2]}
          skipHeader
        />
      )}

      {/* STEP 3: Gender */}
      {step === 3 && (
        <GenderScreen
          formData={formData}
          onNext={(updatedData) => {
            setFormData(updatedData);
            setStep(4);
          }}
          onBack={handleBack}
        />
      )}

      {/* STEP 4: Activity Level */}
      {step === 4 && (
        <ActivityLevelScreen
          formData={formData}
          onNext={(updatedData) => {
            setFormData(updatedData);
            setStep(5);
          }}
          onBack={handleBack}
        />
      )}

      {/* STEP 5: Pace (Tốc độ giảm cân) */}
      {step === 5 && (
        <PaceScreen
          formData={formData}
          onNext={(result) => {
            setPlanResult(result);
            setStep(6);
          }}
          onBack={handleBack}
        />
      )}

      {/* STEP 6: Result & Calculate */}
      {step === 6 && planResult && (
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