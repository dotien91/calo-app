import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute } from "@react-navigation/native";
import { ScreenWidth } from "@freakycoder/react-native-helpers";

import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";
import { SCREENS } from "constants";
import { palette } from "@theme/themes";
import { PlanCalculationData } from "@utils/plan.utils";

const GenderScreen: React.FC = () => {
  const route = useRoute();
  const formData = (route.params as any)?.formData as PlanCalculationData || {};
  const [gender, setGender] = useState<"MALE" | "FEMALE">(formData.gender || "MALE");

  const handleNext = () => {
    const updatedData = { ...formData, gender };
    NavigationService.navigate(SCREENS.ACTIVITY_LEVEL, { formData: updatedData });
  };

  return (
    <SafeAreaView style={styles.container}>
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
              gender === "MALE" && styles.optionButtonSelected,
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
              gender === "FEMALE" && styles.optionButtonSelected,
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

      <View style={styles.footer}>
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
  container: {
    flex: 1,
    backgroundColor: palette.white,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 40,
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 16,
    marginTop: 20,
  },
  optionButton: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.grey1,
    alignItems: "center",
    backgroundColor: palette.white,
  },
  optionButtonSelected: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: palette.grey1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
});
