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
import Header from "@shared-components/header/Header";
import { updateSession } from "@services/api/notification.api";

interface TypeItemLanguage {
  label: string;
  value: string;
  flag: React.JSX.Element;
}
export default function ChooseLanguageScreen() {
  const languageList: TypeItemLanguage[] = [
    {
      label: "Japanese",
      value: "jp",
      flag: <IconSvg name="icFlagjp" size={32} />,
    },
    {
      label: "English",
      value: "en",
      flag: <IconSvg name="icFlagen" size={32} />,
    },
    {
      label: "Vietnamese",
      value: "vi",
      flag: <IconSvg name="icFlagvi" size={32} />,
    },
  ];
  const [selected, setSelected] = useState(useStore((state) => state.language));
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const setLanguage = useStore((state) => state.setLanguage);

  const handleKeepGoing = () => {
    translations.setLanguage(selected);
    setLanguage(selected);
    NavigationService.replace(SCREENS.INTRO);
    updateSession({ picked_language: selected });
  };

  const ItemLanguage = ({ item }: { item: TypeItemLanguage }) => {
    const isSelect: boolean = item.value == selected;
    return (
      <Pressable
        onPress={() => setSelected(item.value)}
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
        <Header
          text={translations.changeLanguage}
          hideBackBtn
          onPressRight={handleKeepGoing}
          iconNameRight="check"
        />
        <View style={styles.child}>
          <View style={styles.viewItem}>
            {languageList.map((item, index: number) => {
              return <ItemLanguage key={index} item={item} />;
            })}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
