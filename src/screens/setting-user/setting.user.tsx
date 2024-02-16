import React, { useState, useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import { Text, TouchableOpacity, View, Switch } from "react-native";
import Header from "@shared-components/header/Header";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import useStore from "@services/zustand/store";
import createStyles from "./setting.user.style";
import { translations } from "@localization";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";
import CS from "@theme/styles";

const SettingUser = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [isEnabledNoti, setisEnabledNoti] = useState(false);
  const [isEnabledHidden, setisEnabledHidden] = useState(false);
  const [isEnabledBlock, setisEnabledBlock] = useState(false);

  // const [languageSelected, setLanguageSelected] = useState(
  //   useStore((state) => state.language),
  // );

  const language = useStore((state) => state.language);
  // const setLanguage = useStore((state) => state.setLanguage);

  // const changeLanguage = () => {
  //   console.log("change");
  //   if (language === "vi") {
  //     setLanguage("en");
  //   } else {
  //     setLanguage("vi");
  //   }
  // };

  const listSettingUser = [
    {
      title: translations.settingUser.language,
      detail: language === "vi" ? "Tiếng Việt" : "Tiếng Anh",
      action: () => {
        NavigationService.navigate(SCREENS.CHANGELANGUAGE);
      },
    },
    // {
    //   title: translations.settingUser.hightandweigh,
    //   detail: "cm/kg",
    //   action: () => {
    //     console.log("asd");
    //   },
    // },
    // {
    //   title: translations.settingUser.space,
    //   detail: "km",
    //   action: () => {
    //     console.log("asd");
    //   },
    // },
    // {
    //   title: translations.settingUser.deletecache,
    //   detail: " ",
    //   action: () => {
    //     console.log("asd");
    //   },
    // },
    {
      title: translations.settingUser.noti,
      action: () => {},
      state: isEnabledNoti,
      changeState: () => {
        setisEnabledNoti(!isEnabledNoti);
      },
    },
    // {
    //   title: translations.settingUser.hidden,
    //   action: () => {},
    //   state: isEnabledHidden,
    //   changeState: () => {
    //     setisEnabledHidden(!isEnabledHidden);
    //   },
    // },
    // {
    //   title: translations.settingUser.block,
    //   action: () => {},
    //   state: isEnabledBlock,
    //   changeState: () => {
    //     setisEnabledBlock(!isEnabledBlock);
    //   },
    // },
  ];

  const renderSettingUser = () => {
    return (
      <View style={{ flex: 1 }}>
        {listSettingUser.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={item.action}
              style={styles.styleItemButtonListSettingUser}
              key={index}
            >
              <Text style={styles.styleTextTitle}>{item.title}</Text>
              <View style={{ flexDirection: "row" }}>
                {item.detail ? (
                  <Text style={styles.styleTextDetail}>{item.detail}</Text>
                ) : (
                  <></>
                )}
                {item.detail ? (
                  <Icon
                    name="chevron-forward-outline"
                    type={IconType.Ionicons}
                    color={colors.black}
                  ></Icon>
                ) : (
                  <Switch
                    trackColor={{ false: colors.grey3, true: colors.green }}
                    thumbColor={item.state ? colors.white : colors.white}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={item.changeState}
                    value={item.state}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={{ ...CS.safeAreaView }}>
      <Header text="Setting" />
      {renderSettingUser()}
    </View>
  );
};
export default SettingUser;
