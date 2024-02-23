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
        NavigationService.navigate(SCREENS.PRIVATESETTING);
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
        NavigationService.navigate(SCREENS.SETTINGPROFILESCREEN);
      },
    },
  ];

  const renderListSetting = () => {
    return (
      <View style={{ backgroundColor: colors.white, flex: 1, marginTop: 20 }}>
        {listSetting.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={item.action}
              style={[
                styles.styleItemNaviSetting,
                { borderBottomWidth: 1, borderColor: colors.grey2 },
              ]}
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
          <View style={{ marginTop: 16 }}>
            <TouchableOpacity
              onPress={() => {
                NavigationService.navigate(SCREENS.PROFILE_CURRENT_USER, {
                  _id: userData?._id,
                });
              }}
            >
              <Avatar
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 99,
                  // marginRight: 10,
                  // marginTop: 20,
                }}
                sourceUri={{
                  uri: userData?.user_avatar_thumbnail,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={editProfile}
              style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.white,
                borderRadius: 16,
              }}
            >
              <Icon
                style={{ padding: 3 }}
                name="edit-3"
                type={IconType.Feather}
              ></Icon>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 16,
              color: colors.text,
              fontWeight: "600",
              marginTop: 8,
            }}
          >
            {userData?.display_name}
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 16,
                color: colors.btnRedPrimary,
                fontWeight: "600",
                marginTop: 5,
              }}
            >
              Become a tutor
            </Text>
          </TouchableOpacity>
          {/* <View style={{ flexDirection: "row", marginVertical: 16 }}>
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
          </View> */}
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
            backgroundColor: colors.grey3,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 50,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SettingScreen;
