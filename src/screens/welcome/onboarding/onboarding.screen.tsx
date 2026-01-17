import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Text,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import IconSvg from "assets/svg";
import { updateSession } from "@services/api/notification.api";
import { LANG, _setJson } from "@services/local-storage";

import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";
import { SCREENS } from "constants";
import { palette } from "@theme/themes";

interface OnboardingScreenProps {}

const OnboardingScreen: React.FC<OnboardingScreenProps> = () => {
  const setLanguage = useStore((state) => state.setLanguage);
  const currentLanguage = useStore((state) => state.language);

  const languageList = [
    {
      label: "Vietnamese",
      value: "vi",
      flag: <IconSvg name="icFlagvi" size={20} />,
    },
    {
      label: "Japanese",
      value: "jp",
      flag: <IconSvg name="icFlagjp" size={20} />,
    },
    {
      label: "English",
      value: "en",
      flag: <IconSvg name="icFlagen" size={20} />,
    },
  ];

  const handleLanguageSelect = (value: string) => {
    translations.setLanguage(value);
    setLanguage(value);
    _setJson(LANG, value);
    updateSession({ picked_language: value });
  };

  const handleNext = () => {
    // Điều hướng đến màn hình đầu tiên của onboarding
    NavigationService.navigate(SCREENS.CURRENT_WEIGHT, {
      formData: {
        currentWeight: "",
        height: "",
        age: "",
        targetWeight: "",
        gender: "MALE",
        activityLevel: "MODERATELY_ACTIVE",
        pace: "NORMAL",
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.screenContainer}
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <TextBase
          fontSize={24}
          fontWeight="700"
          color="text"
          style={styles.title}
        >
          {translations.changeLanguage}
        </TextBase>
        <TextBase
          fontSize={16}
          fontWeight="400"
          color="textOpacity8"
          style={styles.subtitle}
        >
          Chọn ngôn ngữ bạn muốn sử dụng
        </TextBase>

        <View style={styles.optionsContainer}>
          {languageList.map((item) => {
            const isSelected = item.value === currentLanguage;
            return (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => handleLanguageSelect(item.value)}
              >
                <View style={styles.languageItem}>
                  <View style={styles.languageLeft}>
                    {item.flag}
                    <Text style={styles.languageText}>{item.label}</Text>
                  </View>
                  {isSelected && <IconSvg name="icCheckCircleFill" size={24} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Button
            text={translations.next || "Tiếp tục"}
            backgroundColor={palette.primary}
            textColor={palette.white}
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.white,
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  screenContent: {
    paddingTop: 40,
    paddingBottom: 20,
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
  },
  optionCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.grey1,
    backgroundColor: palette.white,
  },
  optionCardSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.secondColor,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  languageLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  languageText: {
    fontSize: 18,
    fontWeight: "600",
    color: palette.text,
  },
  footer: {
    paddingTop: 24,
    paddingBottom: 20,
  },
  nextButton: {
    borderRadius: 12,
    height: 50,
  },
});
