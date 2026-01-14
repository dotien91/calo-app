import React, { useState, useMemo } from "react";
import { View, StyleSheet, Pressable, Text, SafeAreaView } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import {
  getBottomSpace,
  getStatusBarHeight,
} from "react-native-iphone-screen-helper";
import { isAndroid } from "@freakycoder/react-native-helpers";

import TextBase from "@shared-components/TextBase";
import Button from "@shared-components/button/Button";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import { updateSession } from "@services/api/notification.api";
import { LANG, _setJson } from "@services/local-storage";
import { SCREENS } from "constants";

interface TypeItemLanguage {
  label: string;
  value: string;
  flag: React.JSX.Element;
}

export default function ChooseLanguageScreen() {
  const languageList: TypeItemLanguage[] = [
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
  const [selected] = useState(useStore((state) => state.language));
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const setLanguage = useStore((state) => state.setLanguage);

  const handleKeepGoing = (value: string) => {
    translations.setLanguage(value);
    setLanguage(value);
    _setJson(LANG, value);
    updateSession({ picked_language: value });
    NavigationService.replace(SCREENS.ONBOARDING);
  };

  const ItemLanguage = ({ item }: { item: TypeItemLanguage }) => {
    const isSelect: boolean = item.value == selected;
    return (
      <Pressable
        onPress={() => handleKeepGoing(item.value)}
        style={
          isSelect
            ? styles.itemLanguageSelected
            : styles.itemLanguageNotSelected
        }
      >
        <View style={styles.contentItem}>
          <View style={styles.leftItem}>
            {item.flag}
            <Text style={styles.textLanguage}>{item.label}</Text>
          </View>
        </View>
        {item.value == selected && <IconSvg name="icCheckCircleFill" />}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TextBase
            fontSize={28}
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
        </View>

        <View style={styles.content}>
          {languageList.map((item, index) => (
            <ItemLanguage key={index} item={item} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: getStatusBarHeight() + 20,
    },
    header: {
      marginBottom: 40,
      alignItems: "center",
    },
    title: {
      textAlign: "center",
      marginBottom: 12,
    },
    subtitle: {
      textAlign: "center",
    },
    content: {
      flex: 1,
      gap: 16,
    },
    itemLanguageSelected: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 20,
      borderRadius: 12,
      backgroundColor: palette.secondColor,
      borderWidth: 2,
      borderColor: palette.primary,
    },
    itemLanguageNotSelected: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 20,
      borderRadius: 12,
      backgroundColor: palette.white,
      borderWidth: 2,
      borderColor: palette.grey1,
    },
    contentItem: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    leftItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    textLanguage: {
      fontSize: 18,
      fontWeight: "600",
      color: palette.text,
    },
  });
