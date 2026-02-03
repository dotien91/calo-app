import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, G } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";
import { SCREENS } from "constants";
import { navigate } from "@helpers/navigation.helper";
import {
  showSuperModal,
  EnumModalContentType,
  EnumStyleModalType,
} from "@helpers/super.modal.helper";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import Button from "@shared-components/button/Button";
import createStyles, {
  FRAME_SIZE,
  STROKE_WIDTH,
  CORNER_LENGTH,
  CORNER_RADIUS,
} from "./intro.screen.style";

const LANGUAGE_BUTTON_MAP: Record<string, { shortCode: string; flag: string }> =
  {
    vi: { shortCode: "VI", flag: "🇻🇳" },
    en: { shortCode: "EN", flag: "🇺🇸" },
    jp: { shortCode: "JP", flag: "🇯🇵" },
  };

const IntroScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const currentLanguage = useStore((state) => state.language);
  const langDisplay =
    LANGUAGE_BUTTON_MAP[currentLanguage] ?? LANGUAGE_BUTTON_MAP.en;

  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors: themeColors } = theme;

  const handleStart = () => {
    navigate(SCREENS.ONBOARDING_FLOW);
  };

  const handleChangeLanguage = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.ChooseLanguage,
      styleModalType: EnumStyleModalType.Bottom,
    });
  };

  const handleSignIn = () => {
    navigate(SCREENS.LOGIN_PAGE);
  };

  const ScannerFrame = useMemo(
    () => (
      <View style={styles.frameContainer} pointerEvents="none">
        <Svg
          width={FRAME_SIZE}
          height={FRAME_SIZE}
          viewBox={`0 0 ${FRAME_SIZE} ${FRAME_SIZE}`}
        >
          <G
            fill="none"
            stroke={themeColors.primary ?? "#5ED90B"}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path
              d={`M 0 ${CORNER_LENGTH} V ${CORNER_RADIUS} Q 0 0 ${CORNER_RADIUS} 0 H ${CORNER_LENGTH}`}
            />
            <Path
              d={`M ${FRAME_SIZE - CORNER_LENGTH} 0 H ${FRAME_SIZE - CORNER_RADIUS} Q ${FRAME_SIZE} 0 ${FRAME_SIZE} ${CORNER_RADIUS} V ${CORNER_LENGTH}`}
            />
            <Path
              d={`M ${FRAME_SIZE} ${FRAME_SIZE - CORNER_LENGTH} V ${FRAME_SIZE - CORNER_RADIUS} Q ${FRAME_SIZE} ${FRAME_SIZE} ${FRAME_SIZE - CORNER_RADIUS} ${FRAME_SIZE} H ${FRAME_SIZE - CORNER_LENGTH}`}
            />
            <Path
              d={`M ${CORNER_LENGTH} ${FRAME_SIZE} H ${CORNER_RADIUS} Q 0 ${FRAME_SIZE} 0 ${FRAME_SIZE - CORNER_RADIUS} V ${FRAME_SIZE - CORNER_LENGTH}`}
            />
          </G>
        </Svg>
      </View>
    ),
    [theme, themeColors.primary, styles.frameContainer]
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.dark ? "light-content" : "dark-content"}
        backgroundColor={themeColors.background}
      />

      <TouchableOpacity
        style={[styles.langButton, { top: insets.top + 10 }]}
        onPress={handleChangeLanguage}
      >
        <Text style={{ fontSize: 14 }}>{langDisplay.flag}</Text>
        <Text style={styles.langText}>{langDisplay.shortCode}</Text>
      </TouchableOpacity>

      <View style={styles.centerContainer}>
        <View style={styles.phoneMockup}>
          <View style={styles.phoneNotch} />
          <View style={styles.phoneScreen}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop",
              }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={StyleSheet.absoluteFillObject}
            />
            {ScannerFrame}
            <View style={styles.fakeShutterButton} />
          </View>
        </View>
      </View>

      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 20 }]}>
        <Text style={styles.title}>
          {translations.intro?.title ?? "Calorie tracking\nmade easy"}
        </Text>

        <Button
          text={translations.intro?.getStarted ?? "Get Started"}
          onPress={handleStart}
          backgroundColor={themeColors.primary ?? "#5ED90B"}
          textColor="#000000"
          style={styles.startButton}
        />

        <View style={styles.signInRow}>
          <Text style={styles.signInText}>
            {translations.intro?.alreadyHaveAccount ??
              "Already have an account? "}
          </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.signInLink}>
              {translations.intro?.signIn ?? "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default IntroScreen;
