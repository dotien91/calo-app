import React, { useState, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute, useTheme } from "@react-navigation/native";

import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";
import { SCREENS } from "constants";
import { palette } from "@theme/themes";
import { PlanCalculationData } from "@utils/plan.utils";
import { createStyles } from "./onboarding.screen.style";

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

  return (
    <Wrapper style={styles.container}>
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
                borderColor: gender === "MALE" ? colors.primary : colors.border,
                backgroundColor: gender === "MALE" ? colors.primary : colors.card,
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
                borderColor: gender === "FEMALE" ? colors.primary : colors.border,
                backgroundColor: gender === "FEMALE" ? colors.primary : colors.card,
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

      <View style={styles.footer}>
        <Button
          style={styles.button}
          text="Tiếp tục"
          backgroundColor={palette.primary}
          textColor={palette.white}
          onPress={handleNext}
        />
      </View>
    </Wrapper>
  );
};

export default GenderScreen;
