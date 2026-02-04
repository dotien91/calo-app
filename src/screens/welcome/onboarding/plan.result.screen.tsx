import React, { useState, useMemo } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute, useTheme } from "@react-navigation/native";
import { Info, Fire, Plus } from "phosphor-react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";

import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";
import MacroBadgeRow from "@shared-components/MacroBadgeRow";
import { SCREENS } from "constants";
import { palette } from "@theme/themes"; 
import { PlanResult } from "@utils/plan.utils";
import { _setJson, HAS_COMPLETED_ONBOARDING } from "@services/local-storage";
import { submitOnboarding, OnboardingData, Gender, ActivityLevel, WeightGoalPace } from "@services/api/calorie.api";
import useStore from "@services/zustand/store";
import { showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface PlanResultScreenProps {
  planResult?: PlanResult | null;
  onFinish?: () => void | Promise<void>;
  onRestart?: () => void;
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

  const { colors: themeColors } = theme;
  const PRIMARY_COLOR = themeColors?.primary ?? palette.primary;
  const textColor = themeColors?.text ?? "#FFFFFF";

  if (!planResult) return null;

  const t = translations.planResult ?? {} as Record<string, any>;

  // Tính toán spacing động để chart nằm gọn trong màn hình
  // 30 là padding trái (initialSpacing)
  // 30 là padding phải an toàn
  // 4 là số đoạn (giữa 5 điểm)
  const INITIAL_SPACING = 30;
  const CHART_SPACING = (SCREEN_WIDTH - INITIAL_SPACING - 30) / 4;

  // --- 1. LOGIC TÍNH TOÁN DATA BIỂU ĐỒ HEADER ---
  const lineData = useMemo(() => {
    const start = planResult.currentWeight;
    const end = planResult.targetWeight;
    const isGaining = start < end;
    
    return [
      { 
        value: start, 
        label: t.nowLabel,
        labelTextStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '500' },
      },
      
      // Point 1 & 2: Trung gian (Ẩn)
      { value: isGaining ? start + (end - start) * 0.4 : start - (start - end) * 0.4, hideDataPoint: true },
      { value: isGaining ? start + (end - start) * 0.8 : start - (start - end) * 0.8, hideDataPoint: true },
      
      // Point 3: MỤC TIÊU + Label DUY TRÌ
      { 
        value: end, 
        dataPointLabelComponent: () => (
          <View style={{ alignItems: 'flex-start', marginLeft: -20, width: 160 }}> 
             
             {/* 1. Bubble "Mục tiêu" - Căn giữa so với điểm */}
             <View style={{ 
                backgroundColor: PRIMARY_COLOR, 
                paddingHorizontal: 10, 
                paddingVertical: 5, 
                borderRadius: 12, 
                marginBottom: 6,
                alignSelf: 'flex-start',
                marginLeft: 14 // Tinh chỉnh để bubble giữa chấm tròn
              }}>
                 <TextBase fontSize={10} color="white" fontWeight="700">{t.goal}</TextBase>
             </View>
             <View style={{ position: 'absolute', left: 80, top: 22 }}>
                 <TextBase fontSize={10} color="rgba(255,255,255,0.6)" fontWeight="500" numberOfLines={1}>
                   {t.maintainWeight}
                 </TextBase>
             </View>
          </View>
        ),
        customDataPoint: () => (
            <View style={{ 
              width: 14, 
              height: 14, 
              borderRadius: 7, 
              backgroundColor: PRIMARY_COLOR, 
              borderWidth: 2, 
              borderColor: '#0B0F19' 
            }} />
        )
      },

      // Point 4: Điểm cuối (để vẽ đường thẳng ngang)
      {
        value: end, 
        hideDataPoint: true, 
      }
    ];
  }, [planResult, PRIMARY_COLOR, t.nowLabel, t.goal, t.maintainWeight]);

  // --- 2. DATA BIỂU ĐỒ TRÒN ---
  const pieData = [
    { value: planResult.carbs, color: '#3B82F6', text: '50%' }, 
    { value: planResult.fat, color: '#EAB308', text: '30%' },   
    { value: planResult.protein, color: '#EF4444', text: '20%' }, 
  ];

  const adjustmentMap: Record<string, number> = { SLOW: 250, NORMAL: 500, FAST: 1000 };
  const adjustmentVal = adjustmentMap[planResult.pace] || 500;
  const tdeeCalc = planResult.isGaining 
    ? planResult.dailyCalories - adjustmentVal 
    : planResult.dailyCalories + adjustmentVal;

  const handleFinish = async () => {
    if (props.onFinish) { await props.onFinish(); return; }
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
      if (!response.isError) {
        setOnboardingData(response.data.onboarding);
        _setJson(HAS_COMPLETED_ONBOARDING, true);
        NavigationService.replace(SCREENS.TABS);
      }
    }catch (error: any) {
      console.log("error", error);
      showToast({ type: "error", message: error.message });
    } finally {
      setInternalLoading(false);
    }
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
        {/* --- KHỐI 1: BIỂU ĐỒ HEADER --- */}
        <View style={{ paddingTop: 40, paddingBottom: 0 }}>
            <LineChart
                data={lineData}
                width={SCREEN_WIDTH} // Vừa khít màn hình
                height={160}
                curved
                areaChart
                color={PRIMARY_COLOR} 
                thickness={3}
                startFillColor={PRIMARY_COLOR} 
                endFillColor={PRIMARY_COLOR}   
                startOpacity={0.5}
                endOpacity={0.0}
                
                initialSpacing={INITIAL_SPACING} 
                spacing={CHART_SPACING} // Spacing động
                endSpacing={0} // Không cần endSpacing lớn nữa vì đã tính toán vừa khít
                
                showVerticalLines
                verticalLinesColor="rgba(255,255,255,0.15)"
                verticalLinesThickness={1}
                verticalLinesStrokeDashArray={[4, 4]}
                
                hideRules
                hideYAxisText
                hideAxesAndRules
                dataPointsColor={PRIMARY_COLOR}
                
                // Tắt scroll ngang
                scrollEnabled={false}
            />
        </View>

        <View style={styles.paddingLayout}>
            {/* Title */}
            <TextBase fontSize={22} fontWeight="700" color="white" style={{ textAlign: 'center', marginBottom: 20, marginTop: 10 }}>
                {t.title}
            </TextBase>

            <View style={styles.sectionHeader}>
                <TextBase fontSize={16} fontWeight="600" color="white">
                    {t.targetCalTitle}
                </TextBase>
                <Info size={18} color="#9CA3AF" style={{ marginLeft: 6 }} />
            </View>
            <TextBase fontSize={14} color="#9CA3AF" style={{ marginBottom: 12 }}>
                {planResult.isGaining ? t.caloGainingDesc : t.caloLosingDesc}
            </TextBase>

            <View style={styles.calorieRow}>
                <View style={[styles.highlightBox, { backgroundColor: PRIMARY_COLOR, marginRight: 8 }]}>
                    <TextBase fontSize={28} fontWeight="700" color="white">
                        {planResult.dailyCalories.toLocaleString('vi-VN')}
                    </TextBase>
                    <TextBase fontSize={13} fontWeight="500" color="rgba(255,255,255,0.8)">{t.caloPerDay}</TextBase>
                </View>
                <View style={[styles.highlightBox, { backgroundColor: PRIMARY_COLOR, marginLeft: 8 }]}>
                    <TextBase fontSize={28} fontWeight="700" color="white">
                        {(planResult.dailyCalories * 7).toLocaleString('vi-VN')}
                    </TextBase>
                    <TextBase fontSize={13} fontWeight="500" color="rgba(255,255,255,0.8)">{t.caloPerWeek}</TextBase>
                </View>
            </View>

            <TextBase fontSize={16} fontWeight="600" color="white" style={{ marginTop: 24, marginBottom: 10 }}>
                {t.includesLabel}
            </TextBase>

            <View style={styles.darkBox}>
                <TextBase fontSize={14} color="#D1D5DB">{t.tdeeLabel}</TextBase>
                <Info size={14} color="#6B7280" style={{ position: 'absolute', top: 16, right: 16 }} />
                <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4 }}>
                    <TextBase fontSize={24} fontWeight="700" color="white">{tdeeCalc}</TextBase>
                    <TextBase fontSize={14} color="#9CA3AF" style={{ marginLeft: 4 }}>{t.caloUnit}</TextBase>
                </View>
            </View>

            <View style={{ alignItems: 'center', marginVertical: -10, zIndex: 1 }}>
                <View style={styles.plusBadge}>
                    <Plus size={16} color="white" />
                </View>
            </View>

            <View style={styles.darkBox}>
                <TextBase fontSize={14} color="#D1D5DB">
                   {planResult.isGaining ? t.caloSurplus : t.caloDeficit} {t.fromDietAndExercise}
                </TextBase>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4 }}>
                    <TextBase fontSize={24} fontWeight="700" color="white">{adjustmentVal}</TextBase>
                    <TextBase fontSize={14} color="#9CA3AF" style={{ marginLeft: 4 }}>{t.caloUnit}</TextBase>
                </View>
            </View>

            <TextBase fontSize={14} color="#D1D5DB" style={{ marginTop: 24, marginBottom: 8 }}>
                {t.expectedTargetDesc}
            </TextBase>
            <View style={styles.targetBox}>
                <TextBase fontSize={18} fontWeight="700" color="white">
                    {planResult.targetWeight} {t.kgOn} {planResult.date}
                </TextBase>
            </View>

            <TextBase fontSize={18} fontWeight="700" color="white" style={{ marginTop: 24 }}>
                {t.macroTitle}
            </TextBase>
            <TextBase fontSize={14} color="#9CA3AF" style={{ marginTop: 8, marginBottom: 16 }}>
                {t.balancedDietPrefix} <TextBase fontWeight="700" color="white">{t.balancedDiet}</TextBase>
            </TextBase>

            <View style={styles.macroCard}>
                <View style={{ marginRight: 16 }}>
                    <PieChart
                        backgroundColor={"#161B28"}
                        donut
                        radius={60}
                        innerRadius={50}
                        data={pieData}
                        centerLabelComponent={() => {
                            return (
                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                    <Fire size={20} color={PRIMARY_COLOR} weight="fill" />
                                    <TextBase fontSize={16} fontWeight="700" style={{ color: textColor }}>
                                        {Math.round(planResult.dailyCalories)}
                                    </TextBase>
                                </View>
                            );
                        }}
                    />
                </View>
                
                <View style={{ flex: 1, justifyContent: 'center' }}>
                <MacroBadgeRow
                    carbs={planResult.carbs}
                    protein={planResult.protein}
                    fat={planResult.fat}
                    
                    // Cấu hình mới
                    layout="vertical"
                    showLabel={true}
                    percentages={{
                        carbs: 50, 
                        protein: 20, 
                        fat: 30 
                    }}
                    iconSize={20}
                    textColor="white" // Cho nền tối
                />
                </View>
            </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footerAbsolute}>
        <Button
          style={styles.button}
          text={t.start}
          backgroundColor={PRIMARY_COLOR}
          textColor="#FFFFFF"
          onPress={handleFinish}
          disabled={loading}
        />
      </View>
    </Wrapper>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  paddingLayout: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  highlightBox: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkBox: {
    backgroundColor: "#161B28",
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  plusBadge: {
    backgroundColor: "#374151",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "#0B0F19"
  },
  targetBox: {
    backgroundColor: "#161B28",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  macroCard: {
    backgroundColor: "#161B28",
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  footerAbsolute: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  button: {
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PlanResultScreen;