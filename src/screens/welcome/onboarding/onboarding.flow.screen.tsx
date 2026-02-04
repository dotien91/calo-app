import React, { useState, useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute, useTheme } from "@react-navigation/native";
import { SCREENS } from "constants";
import { PlanCalculationData, PlanResult, calculatePlan } from "@utils/plan.utils";
import { _getJson, _setJson, HAS_COMPLETED_ONBOARDING, ONBOARDING_DRAFT } from "@services/local-storage";
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
import CurrentWeightScreen from "./current.weight.screen";
import HeightScreen from "./height.screen";
import AgeScreen from "./age.screen";
import TargetWeightScreen from "./target.weight.screen";
import GenderScreen from "./gender.screen";
import ActivityLevelScreen from "./activity.level.screen";
import PaceScreen from "./pace.screen";
import PlanResultScreen from "./plan.result.screen";

// 8 bước: Height -> Weight -> Age -> TargetWeight -> Gender -> Activity -> Pace -> Result
const PROGRESS_BY_STEP = [14, 28, 42, 57, 71, 85, 100, 100];

const defaultFormData: PlanCalculationData = {
  currentWeight: "",
  height: "",
  age: "",
  targetWeight: "",
  gender: "MALE",
  activityLevel: "MODERATELY_ACTIVE",
  pace: "NORMAL",
};

type OnboardingDraft = { formData: PlanCalculationData; step: number };

const loadDraft = (): OnboardingDraft | null => {
  const raw = _getJson(ONBOARDING_DRAFT);
  if (!raw || typeof raw !== "object") return null;
  const step = Number((raw as any).step);
  const formData = (raw as any).formData;
  if (!formData || typeof formData !== "object" || !Number.isInteger(step) || step < 0 || step > 7) return null;
  return { formData: { ...defaultFormData, ...formData }, step };
};

const OnboardingFlowScreen: React.FC = () => {
  const route = useRoute();
  const initialParams = (route.params as any)?.formData as PlanCalculationData | undefined;
  const savedDraft = useMemo(() => loadDraft(), []);

  const [step, setStep] = useState(() => {
    if (initialParams && !savedDraft) return 0;
    return savedDraft?.step ?? 0;
  });
  const [formData, setFormData] = useState<PlanCalculationData>(() => {
    if (initialParams) return { ...defaultFormData, ...initialParams };
    return savedDraft?.formData ?? defaultFormData;
  });
  const [planResult, setPlanResult] = useState<PlanResult | null>(() => {
    if (savedDraft?.step === 7 && savedDraft?.formData) {
      try {
        return calculatePlan(savedDraft.formData as PlanCalculationData);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  const setOnboardingData = useStore((state) => state.setOnboardingData);
  const theme = useTheme();
  const { colors } = theme;

  // Khi Profile gửi restart: true — reset state như mới vào flow (sạch như vừa cài app)
  useEffect(() => {
    const params = route.params as any;
    if (params?.restart === true && params?.formData) {
      setStep(0);
      setFormData({ ...defaultFormData, ...params.formData });
      setPlanResult(null);
    }
  }, [(route.params as any)?.restart, (route.params as any)?.formData]);

  // Lưu draft mỗi khi formData hoặc step thay đổi (để mở app lại vào đúng màn)
  useEffect(() => {
    _setJson(ONBOARDING_DRAFT, { formData, step });
  }, [formData, step]);

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
      if (!response.isError) {
        setOnboardingData(response.data.onboarding);
        _setJson(HAS_COMPLETED_ONBOARDING, true);
        _setJson(ONBOARDING_DRAFT, null);
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
      <MeasurePickerHeader step={step} onBack={handleBack} progress={progressValue} />
      
      {/* STEP 0: Height */}
      {step === 0 && (
        <HeightScreen
          formData={formData}
          onNext={(value) => updateFormAndNext({ height: value })}
          onBack={handleBack}
          progress={PROGRESS_BY_STEP[0]}
          skipHeader
        />
      )}

      {/* STEP 1: Current Weight */}
      {step === 1 && (
        <CurrentWeightScreen
          formData={formData}
          onNext={(value) => updateFormAndNext({ currentWeight: value })}
          onBack={handleBack}
          progress={PROGRESS_BY_STEP[1]}
          skipHeader
        />
      )}

      {/* STEP 2: Age */}
      {step === 2 && (
        <AgeScreen
          formData={formData}
          onNext={(value) => updateFormAndNext({ age: value })}
          onBack={handleBack}
          progress={PROGRESS_BY_STEP[2]}
          skipHeader
        />
      )}

      {/* STEP 3: Target Weight */}
      {step === 3 && (
        <TargetWeightScreen
          formData={formData}
          onNext={(value) => updateFormAndNext({ targetWeight: value })}
          onBack={handleBack}
          progress={PROGRESS_BY_STEP[3]}
          skipHeader
        />
      )}

      {/* STEP 4: Gender */}
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

      {/* STEP 5: Activity Level */}
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

      {/* STEP 6: Pace */}
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

      {/* STEP 7: Result & Calculate */}
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