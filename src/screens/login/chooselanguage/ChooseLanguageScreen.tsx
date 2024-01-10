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

import CommonStyle from "shared/theme/styles";
import IconSvg from "assets/svg";
import Button from "@shared-components/button/Button";
import createStyles from "./ChooseLanguageScreen.style";
import { SCREENS } from "constants";
import { translations } from "@localization";
import useStore from "@services/zustand/store";

interface TypeItemLanguage {
  label: string;
  value: string;
  flag: React.JSX.Element;
}
export default function ChooseLanguageScreen() {
  const languageList: TypeItemLanguage[] = [
    {
      label: "English",
      value: "en",
      flag: <IconSvg name="icFlagen" size={48} />,
    },
    {
      label: "Vietnamese",
      value: "vi",
      flag: <IconSvg name="icFlagvi" size={48} />,
    },
  ];
  const [selected, setSelected] = useState(useStore((state) => state.language));
  // const [txtSearch, setTxtSearch] = useState("");
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const setLanguage = useStore((state) => state.setLanguage);

  const handleKeepGoing = () => {
    translations.setLanguage(selected);
    setLanguage(selected);

    NavigationService.replace(SCREENS.LOGINWELCOME);
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
        <View style={CommonStyle.row}>
          {item.flag}
          <Text style={styles.textLanguage}>{item.label}</Text>
        </View>
        {item.value == selected && <IconSvg name="icCheckCircleFill" />}
      </Pressable>
    );
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.textHeader}>Choose the language</Text>
        {/* <View style={styles.viewSearch}>
          <TextInput
            placeholder="Find a language"
            style={styles.textSearch}
            value={txtSearch}
            onChangeText={(text) => setTxtSearch(text)}
          />
          <Pressable style={CommonStyle.center}>
            <IconSvg name="icSearch" />
          </Pressable>
        </View> */}
        <View style={styles.child}>
          <View style={CommonStyle.flex1}>
            {languageList.map((item, index: number) => {
              return <ItemLanguage key={index} item={item} />;
            })}
          </View>
          <Button
            style={{ paddingHorizontal: 20 }}
            onPress={handleKeepGoing}
            text="Keep going"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
