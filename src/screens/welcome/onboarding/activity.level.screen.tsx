import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute } from "@react-navigation/native";

import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";
import { SCREENS } from "constants";
import { palette } from "@theme/themes";
import { PlanCalculationData } from "@utils/plan.utils";
import useStore from "@services/zustand/store";
import { createStyles } from "./onboarding.screen.style";

export interface ActivityLevelScreenProps {
  formData?: PlanCalculationData;
  onNext?: (updatedData: PlanCalculationData) => void;
  onBack?: () => void;
}

const activities = [
  { key: "SEDENTARY" as const, label: "Ít vận động", desc: "Ngồi nhiều, ít tập thể dục" },
  { key: "LIGHTLY_ACTIVE" as const, label: "Vận động nhẹ", desc: "Tập thể dục 1-3 lần/tuần" },
  { key: "MODERATELY_ACTIVE" as const, label: "Vận động vừa", desc: "Tập thể dục 3-5 lần/tuần" },
  { key: "VERY_ACTIVE" as const, label: "Vận động nhiều", desc: "Tập thể dục 6-7 lần/tuần" },
];

const ActivityLevelScreen: React.FC<ActivityLevelScreenProps> = (props) => {
  const route = useRoute();
  const fromRoute = (route.params as any)?.formData as PlanCalculationData | undefined;
  const formData = props.formData ?? fromRoute ?? {};
  const [activityLevel, setActivityLevel] = useState<PlanCalculationData["activityLevel"]>(
    formData.activityLevel || "MODERATELY_ACTIVE"
  );
  const isLightMode = useStore((state) => state.isLightMode);
  const { COLORS } = useMemo(() => createStyles(isLightMode), [isLightMode]);

  const handleNext = () => {
    const updatedData = { ...formData, activityLevel };
    if (props.onNext) {
      props.onNext(updatedData);
    } else {
      NavigationService.navigate(SCREENS.PACE, { formData: updatedData });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TextBase fontSize={24} fontWeight="700" color="text" style={styles.title}>
          Mức độ hoạt động
        </TextBase>
        <TextBase
          fontSize={16}
          fontWeight="400"
          color="textOpacity8"
          style={styles.subtitle}
        >
          Mô tả mức độ hoạt động hàng ngày của bạn
        </TextBase>

        <View style={styles.optionsContainer}>
          {activities.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.optionCard,
                {
                  borderColor: activityLevel === item.key ? COLORS.borderSelected : COLORS.border,
                  backgroundColor: activityLevel === item.key ? COLORS.cardSelected : COLORS.card,
                },
              ]}
              onPress={() =>
                setActivityLevel(item.key as PlanCalculationData["activityLevel"])
              }
            >
              <TextBase
                fontSize={18}
                fontWeight="600"
                color={activityLevel === item.key ? "primary" : "text"}
              >
                {item.label}
              </TextBase>
              <TextBase
                fontSize={14}
                fontWeight="400"
                color={activityLevel === item.key ? "primary" : "textOpacity8"}
                style={styles.optionDesc}
              >
                {item.desc}
              </TextBase>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: COLORS.footerBorder }]}>
        <Button
          style={styles.button}
          text="Tiếp tục"
          backgroundColor={palette.primary}
          textColor={palette.white}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
};

export default ActivityLevelScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  contentContainer: { padding: 16, paddingTop: 40 },
  title: { textAlign: "center", marginBottom: 12 },
  subtitle: { textAlign: "center", marginBottom: 32 },
  optionsContainer: { gap: 16, marginTop: 20 },
  optionCard: { padding: 20, borderRadius: 12, borderWidth: 2 },
  optionDesc: { marginTop: 4 },
  footer: { padding: 16, borderTopWidth: 1 },
  button: { alignItems: "center", justifyContent: "center", borderRadius: 12 },
});
