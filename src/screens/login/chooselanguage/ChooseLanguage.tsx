import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import CommonStyle from "shared/theme/styles";
import { CheckCircleFill, Flagen, Flagvi, Search } from "assets/svg";
import { SvgProps } from "react-native-svg";
import Button from "@shared-components/button/Button";
import createStyles from "./ChooseLanguage.style";
import { SCREENS } from "@shared-constants";

interface TypeItemLanguage {
  label: string;
  value: string;
  flag: React.FC<SvgProps>;
}
export default function ChooseLanguage() {
  const languageList: TypeItemLanguage[] = [
    { label: "English", value: "en", flag: Flagen },
    // { label: "Chinese", value: "cn" },
    // { label: "Japanese", value: "jp" },
    // { label: "Korean", value: "kr" },
    { label: "Vietnamese", value: "vi", flag: Flagvi },
  ];
  const [selected, setSelected] = useState("en");
  const [search, setSearch] = useState("");
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleKeepGoing = () => {
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
          {<item.flag />}
          <Text style={styles.textLanguage}>{item.label}</Text>
        </View>
        {item.value == selected && <CheckCircleFill />}
      </Pressable>
    );
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.textHeader}>Choose the language</Text>
        <View style={styles.viewSearch}>
          <TextInput
            placeholder="Find a language"
            style={styles.textSearch}
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
          <Pressable style={CommonStyle.center}>
            <Search />
          </Pressable>
        </View>
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
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
