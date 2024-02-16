import React, { useMemo } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
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
import useStore from "@services/zustand/store";
import { useUserHook } from "@helpers/hooks/useUserHook";
import CS from "@theme/styles";

interface SettingScreenProps {}

const SettingScreen: React.FC<SettingScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const userData = useStore((state) => state.userData);

  const styles = useMemo(() => createStyles(theme), [theme]);
  const { logout, isLoggedIn, renderViewRequestLogin } = useUserHook();
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
      title: translations.settingUser.mycouse,
      icon: require("assets/images/book.png"),
      action: () => {
        NavigationService.navigate(SCREENS.MY_COURES);
      },
    },
    {
      title: translations.settingUser.blackList,
      icon: require("assets/images/blacklisticon.png"),
      action: () => {
        NavigationService.navigate(SCREENS.BLACK_LIST);
      },
    },
    {
      icon: require("assets/images/settingicon.png"),
      title: translations.settingUser.setting,
      action: () => {
        NavigationService.navigate(SCREENS.SETTING_USER);
      },
    },
    {
      title: translations.settingUser.private,
      icon: require("assets/images/securityicon.png"),
      action: () => {
        NavigationService.navigate(SCREENS.SMARTBANKING);
      },
    },
    {
      title: translations.settingUser.support,
      icon: require("assets/images/supporticon.png"),
      action: () => {
        NavigationService.navigate(SCREENS.CHAT_ROOM, {
          id: "6588f14e8d8b13bb432f7d2f",
        });
      },
    },
    {
      title: translations.settingUser.aboutus,
      icon: require("assets/images/aboutusicon.png"),
      action: () => {
        NavigationService.navigate(SCREENS.ABOUT_ME);
      },
    },
    {
      title: "Khoá học đã mua",
      icon: "book",
      action: () => {
        NavigationService.navigate(SCREENS.MY_COURES);
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
                <Image
                  style={{ height: 20, width: 20, marginRight: 8 }}
                  source={item.icon}
                ></Image>
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

  const editProfile = () => {
    NavigationService.navigate(SCREENS.EDIT_PROFILE);
  };

  return (
    <View style={{ ...CS.safeAreaView, backgroundColor: colors.white }}>
      <Header text="Setting"></Header>
      {isLoggedIn() ? (
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
              uri: userData?.user_avatar_thumbnail,
            }}
          />
          <View style={{ flexDirection: "row", marginVertical: 16 }}>
            <TouchableOpacity
              onPress={editProfile}
              style={styles.styleButtonEditProfile}
            >
              <Text style={styles.styleTextEditProfile}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // NavigationService.navigate(SCREENS.TAB_FOLLOW);
              }}
              style={styles.styleButtonViewProfile}
            >
              <Text style={styles.styleTextViewProfile}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        renderViewRequestLogin()
      )}
      {renderListSetting()}
      {isLoggedIn() && (
        <TouchableOpacity
          onPress={logout}
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
      )}
    </View>
  );
};

export default SettingScreen;
