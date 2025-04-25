import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import IconSvg from "assets/svg";
import createStyles from "./choose.language.screen.style";
import { SCREENS } from "constants";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import { updateSession } from "@services/api/notification.api";
import { palette } from "@theme/themes";
import TextBase from "@shared-components/TextBase";
import { LANG, _setJson } from "@services/local-storage";

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
    NavigationService.replace(SCREENS.INTRO);
    updateSession({ picked_language: value });
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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={[{ alignItems: "center" }]}>
          <IconSvg
            name="logoIkigaiCoach"
            width={108}
            height={95}
            color={palette.primary}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <TextBase
              title={translations.changeLanguage}
              fontSize={24}
              fontWeight="700"
            />
          </View>
          <View style={styles.child}>
            <View style={styles.viewItem}>
              {languageList.map((item, index: number) => {
                return <ItemLanguage key={index} item={item} />;
              })}
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
