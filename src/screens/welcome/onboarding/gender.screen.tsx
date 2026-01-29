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

const GenderScreen: React.FC = () => {
  const route = useRoute();
  const formData = (route.params as any)?.formData as PlanCalculationData || {};
  const [gender, setGender] = useState<"MALE" | "FEMALE">(formData.gender || "MALE");
  const isDarkMode = useStore((state) => state.isDarkMode);
  const { COLORS } = useMemo(() => createStyles(isDarkMode), [isDarkMode]);

  const handleNext = () => {
    const updatedData = { ...formData, gender };
    NavigationService.navigate(SCREENS.ACTIVITY_LEVEL, { formData: updatedData });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TextBase fontSize={24} fontWeight="700" color="text" style={styles.title}>
          Giới tính
        </TextBase>
        <TextBase
          fontSize={16}
          fontWeight="400"
          color="textOpacity8"
          style={styles.subtitle}
        >
          Chọn giới tính của bạn
        </TextBase>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              {
                borderColor: gender === "MALE" ? COLORS.borderSelected : COLORS.border,
                backgroundColor: gender === "MALE" ? COLORS.primary : COLORS.card,
              },
            ]}
            onPress={() => setGender("MALE")}
          >
            <TextBase
              fontSize={18}
              fontWeight="600"
              color={gender === "MALE" ? "white" : "text"}
            >
              Nam
            </TextBase>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              {
                borderColor: gender === "FEMALE" ? COLORS.borderSelected : COLORS.border,
                backgroundColor: gender === "FEMALE" ? COLORS.primary : COLORS.card,
              },
            ]}
            onPress={() => setGender("FEMALE")}
          >
            <TextBase
              fontSize={18}
              fontWeight="600"
              color={gender === "FEMALE" ? "white" : "text"}
            >
              Nữ
            </TextBase>
          </TouchableOpacity>
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

export default GenderScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  contentContainer: { padding: 16, paddingTop: 40 },
  title: { textAlign: "center", marginBottom: 12 },
  subtitle: { textAlign: "center", marginBottom: 32 },
  optionsContainer: { gap: 16, marginTop: 20 },
  optionButton: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  footer: { padding: 16, borderTopWidth: 1 },
  button: { alignItems: "center", justifyContent: "center", borderRadius: 12 },
});
