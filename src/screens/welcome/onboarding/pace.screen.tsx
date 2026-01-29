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
import { PlanCalculationData, calculatePlan } from "@utils/plan.utils";
import useStore from "@services/zustand/store";
import { createStyles } from "./onboarding.screen.style";

const PaceScreen: React.FC = () => {
  const route = useRoute();
  const formData = (route.params as any)?.formData as PlanCalculationData || {};
  const [pace, setPace] = useState<PlanCalculationData["pace"]>(
    formData.pace || "NORMAL"
  );
  const isDarkMode = useStore((state) => state.isDarkMode);
  const { COLORS } = useMemo(() => createStyles(isDarkMode), [isDarkMode]);

  const handleFinish = () => {
    const updatedData = { ...formData, pace };
    const result = calculatePlan(updatedData);
    NavigationService.navigate(SCREENS.PLAN_RESULT, { planResult: result });
  };

  const paces = [
    { key: "SLOW", label: "Chậm", desc: "0.25 kg/tuần - An toàn và bền vững" },
    { key: "NORMAL", label: "Bình thường", desc: "0.5 kg/tuần - Cân bằng" },
    { key: "FAST", label: "Nhanh", desc: "1 kg/tuần - Cần kiên trì" },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TextBase fontSize={24} fontWeight="700" color="text" style={styles.title}>
          Tốc độ thay đổi
        </TextBase>
        <TextBase
          fontSize={16}
          fontWeight="400"
          color="textOpacity8"
          style={styles.subtitle}
        >
          Bạn muốn đạt mục tiêu với tốc độ nào?
        </TextBase>

        <View style={styles.optionsContainer}>
          {paces.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.optionCard,
                {
                  borderColor: pace === item.key ? COLORS.borderSelected : COLORS.border,
                  backgroundColor: pace === item.key ? COLORS.cardSelected : COLORS.card,
                },
              ]}
              onPress={() =>
                setPace(item.key as PlanCalculationData["pace"])
              }
            >
              <TextBase
                fontSize={18}
                fontWeight="600"
                color={pace === item.key ? "primary" : "text"}
              >
                {item.label}
              </TextBase>
              <TextBase
                fontSize={14}
                fontWeight="400"
                color={pace === item.key ? "primary" : "textOpacity8"}
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
          text="Xem kết quả"
          backgroundColor={palette.primary}
          textColor={palette.white}
          onPress={handleFinish}
        />
      </View>
    </SafeAreaView>
  );
};

export default PaceScreen;

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
