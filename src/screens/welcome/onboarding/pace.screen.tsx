import React, { useState, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute, useTheme } from "@react-navigation/native";

// 1. SỬA IMPORT: Bỏ Tortoise, thêm PersonSimpleWalk
import { 
  PersonSimpleWalk, // <-- Thay thế cho Tortoise
  PersonSimpleRun, 
  RocketLaunch 
} from "phosphor-react-native";

import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";
import { SCREENS } from "constants";
import { PlanCalculationData, PlanResult, calculatePlan } from "@utils/plan.utils";
import { createStyles, getOnboardingColors } from "./onboarding.screen.style";
import { translations } from "@localization";

const defaultFormData: PlanCalculationData = {
  currentWeight: "",
  height: "",
  age: "",
  targetWeight: "",
  gender: "MALE",
  activityLevel: "MODERATELY_ACTIVE",
  pace: "NORMAL",
};

export interface PaceScreenProps {
  formData?: PlanCalculationData;
  onNext?: (planResult: PlanResult) => void;
  onBack?: () => void;
}

const PACE_OPTIONS: { key: PlanCalculationData["pace"]; Icon: typeof PersonSimpleWalk }[] = [
  { key: "SLOW", Icon: PersonSimpleWalk },
  { key: "NORMAL", Icon: PersonSimpleRun },
  { key: "FAST", Icon: RocketLaunch },
];

const PaceScreen: React.FC<PaceScreenProps> = (props) => {
  const theme = useTheme();
  const route = useRoute();
  const fromRoute = (route.params as any)?.formData as PlanCalculationData | undefined;
  const formData: PlanCalculationData = {
    ...defaultFormData,
    ...(props.formData ?? fromRoute ?? {}),
  };
  const [pace, setPace] = useState<PlanCalculationData["pace"]>(
    formData.pace || "NORMAL"
  );
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { cardSelected, borderSelected } = useMemo(() => getOnboardingColors(theme), [theme]);
  const { colors } = theme;

  const handleFinish = () => {
    const updatedData: PlanCalculationData = { ...formData, pace };
    const result = calculatePlan(updatedData);
    if (props.onNext) {
      props.onNext(result);
    } else {
      NavigationService.navigate(SCREENS.PLAN_RESULT, { planResult: result });
    }
  };

  const fromRouter = props.onNext == null;
  const Wrapper = fromRouter ? SafeAreaView : View;
  const t = (translations.onboarding ?? {}) as Record<string, string>;
  const getLabel = (key: PlanCalculationData["pace"]) =>
    ({ SLOW: t.paceSlowLabel, NORMAL: t.paceNormalLabel, FAST: t.paceFastLabel }[key] ?? key);
  const getDesc = (key: PlanCalculationData["pace"]) =>
    ({ SLOW: t.paceSlowDesc, NORMAL: t.paceNormalDesc, FAST: t.paceFastDesc }[key] ?? "");

  return (
    <Wrapper style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TextBase fontSize={24} fontWeight="700" color="text" style={styles.title}>
          {t.paceTitle ?? "Tốc độ thay đổi"}
        </TextBase>
        <TextBase
          fontSize={16}
          fontWeight="400"
          color="textOpacity8"
          style={styles.subtitle}
        >
          {t.paceSubtitle ?? "Bạn muốn đạt mục tiêu với tốc độ nào?"}
        </TextBase>

        <View style={styles.optionsContainer}>
          {PACE_OPTIONS.map((item) => {
            const isSelected = pace === item.key;
            const textColor = isSelected ? "white" : "text";
            const subTextColor = isSelected ? "white" : "textOpacity8";
            const iconColor = isSelected ? "#FFFFFF" : colors.text;
            const IconComponent = item.Icon;

            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.optionCard,
                  localStyles.cardRow,
                  {
                    borderColor: isSelected ? borderSelected : colors.border,
                    backgroundColor: isSelected ? cardSelected : colors.card,
                  },
                ]}
                onPress={() => setPace(item.key)}
              >
                <View style={localStyles.iconContainer}>
                  <IconComponent
                    size={32}
                    color={iconColor}
                    weight={isSelected ? "fill" : "regular"}
                  />
                </View>

                <View style={localStyles.textContainer}>
                  <TextBase
                    fontSize={18}
                    fontWeight="600"
                    color={textColor}
                  >
                    {getLabel(item.key)}
                  </TextBase>
                  <TextBase
                    fontSize={14}
                    fontWeight="400"
                    color={subTextColor}
                    style={styles.optionDesc}
                  >
                    {getDesc(item.key)}
                  </TextBase>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          type="primary"
          style={styles.button}
          text={t.viewResult ?? "Xem kết quả"}
          onPress={handleFinish}
        />
      </View>
    </Wrapper>
  );
};

const localStyles = StyleSheet.create({
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 16,
    width: 40,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  }
});

export default PaceScreen;