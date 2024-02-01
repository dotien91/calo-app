import React, { useMemo } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */

import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";
import Header from "@shared-components/header/Header";
import Avatar from "@shared-components/user/Avatar";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import createStyles from "./setting.screen.style";
import { translations } from "@localization";

interface SettingScreenProps {}

const SettingScreen: React.FC<SettingScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;

  const styles = useMemo(() => createStyles(theme), [theme]);
  // const isDarkMode = useStore((state) => state.isDarkMode);
  // const setDarkMode = useStore((state) => state.setDarkMode);

  // const toggleDarkmode = useCallback(
  //   (value) => {
  //     setDarkMode(value);
  //   },
  //   [setDarkMode],
  // );

  const listSetting = [
    {
      title: translations.settingUser.blackList,
      icon: "person-remove-outline",
      action: () => {},
    },
    {
      icon: "cog-outline",
      title: translations.settingUser.setting,
      action: () => {
        NavigationService.navigate(SCREENS.SETTING_USER);
      },
    },
    {
      title: translations.settingUser.private,
      icon: "lock-closed-outline",
      action: () => {
        NavigationService.navigate(SCREENS.PAYMENT_COURES);
      },
    },
    {
      title: translations.settingUser.support,
      icon: "people-circle-outline",
      action: () => {},
    },
    {
      title: translations.settingUser.aboutus,
      icon: "information-outline",
      action: () => {
        NavigationService.navigate(SCREENS.ABOUT_ME);
      },
    },
  ];

  const renderListSetting = () => {
    return (
      <View style={{ backgroundColor: colors.white, flex: 1 }}>
        {listSetting.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={item.action}
              style={styles.styleItemNaviSetting}
              key={index}
            >
              <View style={styles.styleViewItemTitle}>
                <Icon
                  style={{ marginRight: 5 }}
                  name={item.icon}
                  type={IconType.Ionicons}
                ></Icon>
                <Text style={styles.styleTextItemTitle}>{item.title}</Text>
              </View>
              <Icon
                name="chevron-forward-outline"
                type={IconType.Ionicons}
              ></Icon>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header text="Setting"></Header>
      <View style={{ alignItems: "center", backgroundColor: colors.white }}>
        <Avatar
          style={{
            width: 80,
            height: 80,
            borderRadius: 99,
            marginRight: 10,
            marginTop: 20,
          }}
          sourceUri={{
            uri: "https://ropkeyarmormuseum.com/wp-content/uploads/2023/03/All-about-Roronoa-Zoro-One-Pieces-Most-beloved-Character.jpg",
          }}
        />
        <View style={{ flexDirection: "row", marginVertical: 16 }}>
          <TouchableOpacity style={styles.styleButtonEditProfile}>
            <Text style={styles.styleTextEditProfile}>Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.styleButtonViewProfile}>
            <Text style={styles.styleTextViewProfile}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      {renderListSetting()}
      <TouchableOpacity
        style={{
          marginHorizontal: 16,
          height: 46,
          backgroundColor: colors.grey1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 50,
          borderRadius: 16,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingScreen;
