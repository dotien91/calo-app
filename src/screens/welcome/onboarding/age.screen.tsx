import React, { useState, useMemo } from "react";
import { SafeAreaView, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute, useTheme } from "@react-navigation/native";
import { SCREENS } from "constants";
import { PlanCalculationData } from "@utils/plan.utils";
import { palette } from "@theme/themes";
import {
  MeasurePicker,
  MeasurePickerHeader,
} from "@shared-components/wheel-picker/MeasurePicker";
import Button from "@shared-components/button/Button";
import { createStyles } from "./onboarding.screen.style";
import { translations } from "@localization";

export interface AgeScreenProps {
  formData?: PlanCalculationData;
  onNext?: (value: number) => void;
  onBack?: () => void;
  progress?: number;
  skipHeader?: boolean;
}

const AgeScreen: React.FC<AgeScreenProps> = (props) => {
  const route = useRoute();
  const fromRoute = (route.params as any)?.formData as PlanCalculationData | undefined;
  const formData = (props.formData ?? fromRoute ?? {}) as PlanCalculationData;
  const initialValue = parseFloat(String(formData.age)) || 25;
  const progress = props.progress ?? 42;
  const theme = useTheme();
  const bgColor = theme.colors.background;
  const [currentValue, setCurrentValue] = useState(initialValue);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleNext = (value: number) => {
    if (props.onNext) {
      props.onNext(value);
    } else {
      const updatedData = { ...formData, age: value };
      NavigationService.navigate(SCREENS.TARGET_WEIGHT, { formData: updatedData });
    }
  };

  const handleBack = () => {
    if (props.onBack) props.onBack();
    else NavigationService.goBack();
  };

  const picker = (
    <MeasurePicker
      type="AGE"
      unit={translations.planResult?.ageUnit ?? "tuổi"}
      initialValue={initialValue}
      onNext={handleNext}
      onValueChange={setCurrentValue}
    />
  );

  const footerButton = (
    <View style={styles.footer}>
      <Button
        style={styles.button}
        text={translations.next ?? "Tiếp theo"}
        backgroundColor={palette.primary}
        textColor="#FFFFFF"
        onPress={() => handleNext(currentValue)}
      />
    </View>
  );

  if (props.skipHeader) {
    return (
      <View style={{ flex: 1, backgroundColor: bgColor }}>
        {picker}
        {footerButton}
      </View>
    );
  }

  const fromRouter = fromRoute != null;
  const content = (
    <>
      <MeasurePickerHeader onBack={handleBack} progress={progress} />
      {picker}
      {footerButton}
    </>
  );
  const containerStyle = { flex: 1, backgroundColor: bgColor };
  if (fromRouter) {
    return <SafeAreaView style={containerStyle}>{content}</SafeAreaView>;
  }
  return <View style={containerStyle}>{content}</View>;
};

export default AgeScreen;
