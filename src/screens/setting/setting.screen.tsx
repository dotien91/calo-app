import React, { useMemo } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { useTheme } from "@react-navigation/native";
// import crashlytics from "@react-native-firebase/crashlytics";

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
import { USER_TOKEN, _setJson } from "@services/local-storage";
import IconBtn from "@shared-components/button/IconBtn";
import useUserHelper from "@helpers/hooks/useUserHelper";
import { openUrl } from "@helpers/file.helper";

interface SettingScreenProps {}

const SettingScreen: React.FC<SettingScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const userData = useStore((state) => state.userData);
  // const linkAvatar = useStore((state) => state.linkAvatar);

  const styles = useMemo(() => createStyles(theme), [theme]);
  const { logout, isLoggedIn, renderViewRequestLogin } = useUserHook();
  const { isTeacher } = useUserHelper();

  const listSetting = [
    {
      title: translations.settingUser.purchaseCouse,
      icon: require("assets/images/book.png"),
      action: () => {
        NavigationService.navigate(SCREENS.MY_COURES);
      },
    },
    {
      title: translations.course.manageClass,
      id: 1,
      iconFont: "book",
      action: () => {
        NavigationService.navigate(SCREENS.TEACHER_COURSES);
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
          id: "65f7b1b3a22b22d7d3dcf078",
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
      title: translations.settingUser.discount,
      iconFont: "gift",
      action: () => {
        NavigationService.navigate(SCREENS.COUPON_LIST);
      },
    },
    {
      title: translations.settingUser.codeActivations,
      iconFont: "package",
      action: () => {
        NavigationService.navigate(SCREENS.CODE_ACTIVATIONS_SCREEN);
      },
    },
  ];

  const hardCodeToken = () => {
    const token =
      // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDEwODAwMjMsImRhdGEiOnsiX2lkIjoiNjU5ZTU5ZDExNzc1YWJiZDZkOTlkMGIzIiwia2V5IjoiNTRhZjQxZGUxZTljNmNhZTFlYmI0ZjQ3NmI4NDg2ZmMiLCJzaWduYXR1cmUiOiIxY2Y2ODMwNWJkOTAyMjEyMDY1MTU3ODQyZWQ1ZTZjNiIsInNlc3Npb24iOiI2NWU1OTI1NzI0MGU1NWFmMTgwODFkMDIifSwiaWF0IjoxNzA5NTQ0MDIzfQ.URzn57HRI_hz_BZRM7HrV8VxSo5VZGqkT4EyPFFaDjk";
      // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDA2NDk0OTQsImRhdGEiOnsiX2lkIjoiNjU5MGVmNzEzZjlhMDQ2OGM4MjkwZWI5Iiwia2V5IjoiYTI0MTcxYzcxYjNjMjViZWI0OTQzMTQ1NjQyZjJmNTciLCJzaWduYXR1cmUiOiI4ZTJmODFmZjY1NmRjMjUyYzZhNmVlZGFkN2U3ZTc3OCIsInNlc3Npb24iOiI2NWRmMDA5NWMzMzE1ZjhjZmMwOTk2MWUifSwiaWF0IjoxNzA5MTEzNDk0fQ.bhcKT-0CbTascOTqne8ZzXE4bSTke4EzD9hArh7rX1Y";
      //dang11
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDIyODE4MjQsImRhdGEiOnsiX2lkIjoiNjVlYTg1ZjdiMzdiMTRkZjFmNWE2Mjc1Iiwia2V5IjoiZGQ5YjhjOTk1ODNiYjM4YWZhZGRmYTBiMWU4OTgzMTgiLCJzaWduYXR1cmUiOiI2ZGYwYjIyYWEzOWZkMmM2MzAwMDQ3MTNlNzU2ZGI4OCIsInNlc3Npb24iOiI2NWY3ZThlMDAzNzZlOGU1NzZmYmUyZGQifSwiaWF0IjoxNzEwNzQ1ODI0fQ.ADTQoZf7QfVpffj3r1lAnPa09RTw9qxfac_-BfvOTrw";
    _setJson(USER_TOKEN, token);
  };

  const renderListSetting = () => {
    return (
      <View style={{ backgroundColor: colors.white, flex: 1, marginTop: 20 }}>
        {listSetting.map((item, index) => {
          // if (item?.id == 1 && !isTeacher) return null;
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
                {item.iconFont ? (
                  <IconBtn
                    size={20}
                    name={item.iconFont}
                    customStyle={{ marginRight: 8 }}
                  />
                ) : (
                  <Image
                    style={{ height: 20, width: 20, marginRight: 8 }}
                    source={item.icon}
                  ></Image>
                )}
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
      <Header text={translations.settingUser.setting}></Header>
      <Text
        onPress={hardCodeToken}
        style={{
          fontSize: 16,
          fontWeight: "600",
          textAlign: "center",
          color: "#fff",
        }}
      >
        hard code token
      </Text>
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
            numberOfLines={1}
            style={{
              fontSize: 16,
              color: colors.text,
              fontWeight: "600",
              marginTop: 8,
              paddingHorizontal: 16,
            }}
          >
            {userData?.display_name}
          </Text>
          {!isTeacher && (
            <TouchableOpacity onPress={() => openUrl("test")}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.btnRedPrimary,
                  fontWeight: "600",
                  marginTop: 5,
                }}
              >
                {translations.settingUser.becomeATutor}
              </Text>
            </TouchableOpacity>
          )}
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
            {translations.signOut}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SettingScreen;
