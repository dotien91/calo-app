import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute } from "@react-navigation/native";

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
  const route = useRoute();
  const fromRoute = (route.params as any)?.planResult as PlanResult | undefined;
  const planResult = props.planResult ?? fromRoute;
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = props.loading ?? internalLoading;
  const setOnboardingData = useStore((state) => state.setOnboardingData);
  const isLightMode = useStore((state) => state.isLightMode);
  const { COLORS } = useMemo(() => createStyles(isLightMode), [isLightMode]);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
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

        <View style={[styles.card, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
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

        <View style={[styles.card, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
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

        <View style={[styles.card, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
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

        <View style={[styles.card, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
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

        <View style={[styles.infoCard, { backgroundColor: COLORS.infoCardBg }]}>
          <TextBase fontSize={14} fontWeight="400" color="textOpacity8" style={styles.infoText}>
            💡 Lưu ý: Đây là kế hoạch tham khảo dựa trên công thức Mifflin-St Jeor. 
            Kết quả có thể khác nhau tùy theo cơ địa và chế độ tập luyện của bạn.
          </TextBase>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: COLORS.footerBg, borderTopColor: COLORS.footerBorder }]}>
        <Button
          style={styles.button}
          text="Bắt đầu"
          backgroundColor={palette.primary}
          textColor={palette.white}
          onPress={handleFinish}
          disabled={loading}
        />
        
        <Button
          style={[styles.button, styles.restartButton, { borderColor: COLORS.borderSelected }] as any}
          text="Bắt đầu lại"
          backgroundColor={COLORS.card}
          textColor={palette.primary}
          onPress={handleRestart}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default PlanResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 160,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    textAlign: "center",
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 16,
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  goalItem: {
    flex: 1,
    alignItems: "center",
  },
  goalArrow: {
    paddingHorizontal: 16,
  },
  goalValue: {
    marginTop: 4,
  },
  goalInfo: {
    marginTop: 12,
    alignItems: "center",
  },
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  caloriesContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  caloriesValue: {
    marginBottom: 8,
  },
  macroContainer: {
    gap: 16,
  },
  macroItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  macroBar: {
    width: 4,
    height: 60,
    borderRadius: 2,
  },
  macroContent: {
    flex: 1,
  },
  macroValue: {
    marginTop: 4,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  restartButton: {
    marginTop: 12,
    borderWidth: 1,
  },
});
