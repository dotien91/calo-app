import React, { useState, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet, // <--- Import StyleSheet
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute, useTheme } from "@react-navigation/native";

// 1. IMPORT PHOSPHOR ICONS
import { 
  Armchair, 
  PersonSimpleWalk, 
  Barbell, 
  Lightning 
} from "phosphor-react-native";

import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";
import { SCREENS } from "constants";
import { palette } from "@theme/themes";
import { PlanCalculationData } from "@utils/plan.utils";
import { createStyles, getOnboardingColors } from "./onboarding.screen.style";
import { translations } from "@localization";

export interface ActivityLevelScreenProps {
  formData?: PlanCalculationData;
  onNext?: (updatedData: PlanCalculationData) => void;
  onBack?: () => void;
}

// 2. DATA: key + Icon (label/desc lấy từ translations)
const ACTIVITY_KEYS = ["SEDENTARY", "LIGHTLY_ACTIVE", "MODERATELY_ACTIVE", "VERY_ACTIVE"] as const;
const ACTIVITY_ICONS = [Armchair, PersonSimpleWalk, Barbell, Lightning];
const activities = ACTIVITY_KEYS.map((key, i) => ({ key, Icon: ACTIVITY_ICONS[i] }));

const ActivityLevelScreen: React.FC<ActivityLevelScreenProps> = (props) => {
  const theme = useTheme();
  const route = useRoute();
  const fromRoute = (route.params as any)?.formData as PlanCalculationData | undefined;
  const formData = props.formData ?? fromRoute ?? {};
  const [activityLevel, setActivityLevel] = useState<PlanCalculationData["activityLevel"]>(
    formData.activityLevel || "MODERATELY_ACTIVE"
  );
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { cardSelected, borderSelected } = useMemo(() => getOnboardingColors(theme), [theme]);
  const { colors } = theme;

  const handleNext = () => {
    const updatedData = { ...formData, activityLevel };
    if (props.onNext) {
      props.onNext(updatedData);
    } else {
      NavigationService.navigate(SCREENS.PACE, { formData: updatedData });
    }
  };

  const fromRouter = props.onNext == null;
  const Wrapper = fromRouter ? SafeAreaView : View;

  return (
    <Wrapper style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TextBase fontSize={24} fontWeight="700" color="text" style={styles.title}>
          {translations.onboarding?.activityTitle ?? "Mức độ hoạt động"}
        </TextBase>
        <TextBase
          fontSize={16}
          fontWeight="400"
          color="textOpacity8"
          style={styles.subtitle}
        >
          {translations.onboarding?.activitySubtitle ?? "Mô tả mức độ hoạt động hàng ngày của bạn"}
        </TextBase>

        <View style={styles.optionsContainer}>
          {activities.map((item) => {
            const isSelected = activityLevel === item.key;
            // Logic màu sắc
            const textColor = isSelected ? "white" : "text";
            const subTextColor = isSelected ? "white" : "textOpacity8";
            const iconColor = isSelected ? "#FFFFFF" : colors.text;
            
            // Lấy Component Icon
            const IconComponent = item.Icon;

            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.optionCard,
                  localStyles.cardRow, // <--- Style layout ngang
                  {
                    borderColor: isSelected ? borderSelected : colors.border,
                    backgroundColor: isSelected ? cardSelected : colors.card,
                  },
                ]}
                onPress={() =>
                  setActivityLevel(item.key as PlanCalculationData["activityLevel"])
                }
              >
                {/* 3. PHẦN ICON BÊN TRÁI */}
                <View style={localStyles.iconContainer}>
                   <IconComponent 
                      size={32} 
                      color={iconColor}
                      weight={isSelected ? "fill" : "regular"} 
                   />
                </View>

                {/* PHẦN TEXT BÊN PHẢI */}
                <View style={localStyles.textContainer}>
                  <TextBase
                    fontSize={18}
                    fontWeight="600"
                    color={textColor}
                  >
                    {translations.planResult?.activityLabels?.[item.key] ?? item.key}
                  </TextBase>
                  <TextBase
                    fontSize={14}
                    fontWeight="400"
                    color={subTextColor}
                    style={styles.optionDesc}
                  >
                    {translations.onboarding?.activityDescs?.[item.key] ?? ""}
                  </TextBase>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          style={styles.button}
          text={translations.onboarding?.continue ?? "Tiếp tục"}
          backgroundColor={palette.primary}
          textColor={palette.white}
          onPress={handleNext}
        />
      </View>
    </Wrapper>
  );
};

// 4. STYLE BỔ SUNG
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

export default ActivityLevelScreen;