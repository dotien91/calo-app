import React, { useMemo } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import TextBase from "@shared-components/TextBase";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import { LANG, _setJson } from "@services/local-storage";
import { updateSession } from "@services/api/notification.api";
import createStyles from "./ChooseLanguageView.style";

const languageList = [
  { value: "vi", label: "Vietnamese", flag: "🇻🇳" },
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "jp", label: "Japanese", flag: "🇯🇵" },
];

interface ChooseLanguageViewProps {
  closeModal?: () => void;
}

const ChooseLanguageView: React.FC<ChooseLanguageViewProps> = ({ closeModal }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const setLanguage = useStore((state) => state.setLanguage);
  const currentLanguage = useStore((state) => state.language);

  const handleSelect = (value: string) => {
    translations.setLanguage(value);
    setLanguage(value);
    _setJson(LANG, value);
    try {
      updateSession({ picked_language: value });
    } catch (_) {}
    closeModal?.();
  };

  return (
    <View style={styles.container}>
      <TextBase
        fontSize={20}
        fontWeight="700"
        color="text"
        style={styles.title}
      >
        {translations.changeLanguage ?? "Chọn ngôn ngữ"}
      </TextBase>
      <TextBase
        fontSize={14}
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
                {
                  backgroundColor: isSelected ? colors.secondColor : colors.card,
                  borderColor: isSelected ? colors.primary : (colors.border ?? colors.grey1),
                },
              ]}
              onPress={() => handleSelect(item.value)}
              activeOpacity={0.8}
            >
              <Text style={styles.flag}>{item.flag}</Text>
              <TextBase
                fontSize={16}
                fontWeight="600"
                color={isSelected ? "primary" : "text"}
              >
                {item.label}
              </TextBase>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ChooseLanguageView;
