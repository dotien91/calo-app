import React, { useState, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute, useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";
import { SCREENS } from "constants";
import { PlanCalculationData } from "@utils/plan.utils";
import { createStyles } from "./onboarding.screen.style";
import { translations } from "@localization";

export interface GenderScreenProps {
  formData?: PlanCalculationData;
  onNext?: (updatedData: PlanCalculationData) => void;
  onBack?: () => void;
}

const GenderScreen: React.FC<GenderScreenProps> = (props) => {
  const theme = useTheme();
  const route = useRoute();
  const fromRoute = (route.params as any)?.formData as PlanCalculationData | undefined;
  const formData = props.formData ?? fromRoute ?? {};
  const [gender, setGender] = useState<"MALE" | "FEMALE">(formData.gender || "MALE");
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;
  const primaryDark = colors.primaryDark ?? colors.primary;

  const handleNext = () => {
    const updatedData = { ...formData, gender };
    if (props.onNext) {
      props.onNext(updatedData);
    } else {
      NavigationService.navigate(SCREENS.ACTIVITY_LEVEL, { formData: updatedData });
    }
  };

  const fromRouter = props.onNext == null;
  const Wrapper = fromRouter ? SafeAreaView : View;
  const t = translations.onboarding ?? {} as Record<string, string>;

  return (
    <Wrapper style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TextBase fontSize={24} fontWeight="700" color="text" style={styles.title}>
          {t.genderTitle ?? "Giới tính"}
        </TextBase>
        <TextBase
          fontSize={16}
          fontWeight="400"
          color="textOpacity8"
          style={styles.subtitle}
        >
          {t.genderSubtitle ?? "Chọn giới tính của bạn"}
        </TextBase>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              {
                borderColor: gender === "MALE" ? colors.primary : colors.border,
                backgroundColor: gender === "MALE" ? primaryDark : colors.card,
              },
            ]}
            onPress={() => setGender("MALE")}
          >
            <Icon
              type={IconType.Ionicons}
              name="male"
              size={40}
              color={gender === "MALE" ? "#FFFFFF" : colors.text}
              style={{ marginBottom: 8 }}
            />
            <TextBase
              fontSize={18}
              fontWeight="600"
              color={gender === "MALE" ? "white" : "text"}
            >
              {t.genderMale ?? "Nam"}
            </TextBase>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              {
                borderColor: gender === "FEMALE" ? colors.primary : colors.border,
                backgroundColor: gender === "FEMALE" ? primaryDark : colors.card,
              },
            ]}
            onPress={() => setGender("FEMALE")}
          >
            <Icon
              type={IconType.Ionicons}
              name="female"
              size={40}
              color={gender === "FEMALE" ? "#FFFFFF" : colors.text}
              style={{ marginBottom: 8 }}
            />
            <TextBase
              fontSize={18}
              fontWeight="600"
              color={gender === "FEMALE" ? "white" : "text"}
            >
              {t.genderFemale ?? "Nữ"}
            </TextBase>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          type="primary"
          style={styles.button}
          text={t.continue ?? translations.next ?? "Tiếp tục"}
          onPress={handleNext}
        />
      </View>
    </Wrapper>
  );
};

export default GenderScreen;
