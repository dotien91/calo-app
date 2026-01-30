import React, { useState, useMemo } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute, useTheme } from "@react-navigation/native";

import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";
import { SCREENS } from "constants";
import { palette } from "@theme/themes";
import { PlanResult } from "@utils/plan.utils";
import { _setJson, HAS_COMPLETED_ONBOARDING } from "@services/local-storage";
import { submitOnboarding, OnboardingData, Gender, ActivityLevel, WeightGoalPace } from "@services/api/calorie.api";
import useStore from "@services/zustand/store";
import { createStyles } from "./onboarding.screen.style";
import { showToast } from "@helpers/super.modal.helper";

export interface PlanResultScreenProps {
  /** Khi có props: dùng như view trong flow */
  planResult?: PlanResult | null;
  onFinish?: () => void | Promise<void>;
  onRestart?: () => void;
  /** Loading từ parent (flow) khi gọi API */
  loading?: boolean;
}

const PlanResultScreen: React.FC<PlanResultScreenProps> = (props) => {
  const theme = useTheme();
  const route = useRoute();
  const fromRoute = (route.params as any)?.planResult as PlanResult | undefined;
  const planResult = props.planResult ?? fromRoute;
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = props.loading ?? internalLoading;
  const setOnboardingData = useStore((state) => state.setOnboardingData);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;

  if (!planResult) {
    return null;
  }

  // Mapping labels
  const genderLabels: Record<string, string> = {
    MALE: "Nam",
    FEMALE: "Nữ",
  };

  const activityLabels: Record<string, string> = {
    SEDENTARY: "Ít vận động",
    LIGHTLY_ACTIVE: "Vận động nhẹ",
    MODERATELY_ACTIVE: "Vận động vừa",
    VERY_ACTIVE: "Vận động nhiều",
  };

  const paceLabels: Record<string, string> = {
    SLOW: "Chậm (0.25 kg/tuần)",
    NORMAL: "Bình thường (0.5 kg/tuần)",
    FAST: "Nhanh (1 kg/tuần)",
  };

  const handleFinish = async () => {
    if (props.onFinish) {
      await props.onFinish();
      return;
    }
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
      setInternalLoading(true);
      const response = await submitOnboarding(onboardingData);
      if (response.success) {
        setOnboardingData(response.data.onboarding);
        _setJson(HAS_COMPLETED_ONBOARDING, true);
        NavigationService.replace(SCREENS.TABS);
      } else {
        showToast({ type: "error", message: response.message });
      }
    } finally {
      setInternalLoading(false);
    }
  };

  const handleRestart = () => {
    if (props.onRestart) {
      props.onRestart();
      return;
    }
    NavigationService.navigate(SCREENS.CURRENT_WEIGHT, {
      formData: {
        currentWeight: planResult.currentWeight,
        height: planResult.height,
        age: planResult.age.toString(),
        targetWeight: planResult.targetWeight,
        gender: planResult.gender,
        activityLevel: planResult.activityLevel,
        pace: planResult.pace,
      },
    });
  };

  const fromRouter = props.onFinish == null;
  const Wrapper = fromRouter ? SafeAreaView : View;

  return (
    <Wrapper style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TextBase fontSize={28} fontWeight="700" color="text" style={styles.title}>
            Kế hoạch của bạn
          </TextBase>
          <TextBase
            fontSize={16}
            fontWeight="400"
            color="textOpacity8"
            style={styles.subtitle}
          >
            Dựa trên thông tin bạn cung cấp, đây là kế hoạch dinh dưỡng phù hợp
          </TextBase>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <TextBase fontSize={20} fontWeight="700" color="text">
              Thông tin của bạn
            </TextBase>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
                Giới tính:
              </TextBase>
              <TextBase fontSize={14} fontWeight="600" color="text">
                {genderLabels[planResult.gender]}
              </TextBase>
            </View>
            <View style={styles.infoRow}>
              <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
                Tuổi:
              </TextBase>
              <TextBase fontSize={14} fontWeight="600" color="text">
                {planResult.age} tuổi
              </TextBase>
            </View>
            <View style={styles.infoRow}>
              <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
                Chiều cao:
              </TextBase>
              <TextBase fontSize={14} fontWeight="600" color="text">
                {planResult.height} cm
              </TextBase>
            </View>
            <View style={styles.infoRow}>
              <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
                Mức độ hoạt động:
              </TextBase>
              <TextBase fontSize={14} fontWeight="600" color="text">
                {activityLabels[planResult.activityLevel]}
              </TextBase>
            </View>
            <View style={styles.infoRow}>
              <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
                Tốc độ thay đổi:
              </TextBase>
              <TextBase fontSize={14} fontWeight="600" color="text">
                {paceLabels[planResult.pace]}
              </TextBase>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <TextBase fontSize={20} fontWeight="700" color="text">
              Mục tiêu
            </TextBase>
          </View>
          <View style={styles.goalRow}>
            <View style={styles.goalItem}>
              <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
                Cân nặng hiện tại
              </TextBase>
              <TextBase fontSize={24} fontWeight="700" color="text" style={styles.goalValue}>
                {planResult.currentWeight} kg
              </TextBase>
            </View>
            <View style={styles.goalArrow}>
              <TextBase fontSize={20} fontWeight="700" color="primary">
                →
              </TextBase>
            </View>
            <View style={styles.goalItem}>
              <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
                Cân nặng mục tiêu
              </TextBase>
              <TextBase fontSize={24} fontWeight="700" color="text" style={styles.goalValue}>
                {planResult.targetWeight} kg
              </TextBase>
            </View>
          </View>
          <View style={styles.goalInfo}>
            <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
              {planResult.isGaining ? "Tăng cân" : "Giảm cân"} • Dự kiến đạt vào{" "}
              {planResult.date}
            </TextBase>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <TextBase fontSize={20} fontWeight="700" color="text">
              Calories hàng ngày
            </TextBase>
          </View>
          <View style={styles.caloriesContainer}>
            <TextBase fontSize={48} fontWeight="700" color="primary" style={styles.caloriesValue}>
              {planResult.dailyCalories}
            </TextBase>
            <TextBase fontSize={18} fontWeight="400" color="textOpacity8">
              kcal/ngày
            </TextBase>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <TextBase fontSize={20} fontWeight="700" color="text">
              Phân bổ Macro
            </TextBase>
          </View>
          <View style={styles.macroContainer}>
            <View style={styles.macroItem}>
              <View style={[styles.macroBar, { backgroundColor: palette.primary }]} />
              <View style={styles.macroContent}>
                <TextBase fontSize={16} fontWeight="600" color="text">
                  Carb
                </TextBase>
                <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
                  50%
                </TextBase>
                <TextBase fontSize={20} fontWeight="700" color="text" style={styles.macroValue}>
                  {planResult.carbs} g
                </TextBase>
              </View>
            </View>

            <View style={styles.macroItem}>
              <View style={[styles.macroBar, { backgroundColor: palette.green }]} />
              <View style={styles.macroContent}>
                <TextBase fontSize={16} fontWeight="600" color="text">
                  Protein
                </TextBase>
                <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
                  20%
                </TextBase>
                <TextBase fontSize={20} fontWeight="700" color="text" style={styles.macroValue}>
                  {planResult.protein} g
                </TextBase>
              </View>
            </View>

            <View style={styles.macroItem}>
              <View style={[styles.macroBar, { backgroundColor: palette.yellow }]} />
              <View style={styles.macroContent}>
                <TextBase fontSize={16} fontWeight="600" color="text">
                  Fat
                </TextBase>
                <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
                  30%
                </TextBase>
                <TextBase fontSize={20} fontWeight="700" color="text" style={styles.macroValue}>
                  {planResult.fat} g
                </TextBase>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <TextBase fontSize={14} fontWeight="400" color="textOpacity8" style={styles.infoText}>
            💡 Lưu ý: Đây là kế hoạch tham khảo dựa trên công thức Mifflin-St Jeor. 
            Kết quả có thể khác nhau tùy theo cơ địa và chế độ tập luyện của bạn.
          </TextBase>
        </View>
      </ScrollView>

      <View style={styles.footerAbsolute}>
        <Button
          style={styles.button}
          text="Bắt đầu"
          backgroundColor={palette.primary}
          textColor={palette.white}
          onPress={handleFinish}
          disabled={loading}
        />
        
        <Button
          style={[styles.button, styles.restartButton, { borderColor: colors.primary }] as any}
          text="Bắt đầu lại"
          backgroundColor={colors.card}
          textColor={palette.primary}
          onPress={handleRestart}
          disabled={loading}
        />
      </View>
    </Wrapper>
  );
};

export default PlanResultScreen;
