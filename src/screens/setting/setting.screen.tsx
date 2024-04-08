import React, { useMemo } from "react";
import { View, TouchableOpacity, Text, Image, ScrollView } from "react-native";
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
// import { USER_TOKEN, _setJson } from "@services/local-storage";
import IconBtn from "@shared-components/button/IconBtn";
import useUserHelper from "@helpers/hooks/useUserHelper";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showToast,
  showWarningLogin,
} from "@helpers/super.modal.helper";
import { deleteUserById } from "@services/api/user.api";
import { USER_TOKEN, _getJson } from "@services/local-storage";
import PressableBtn from "@shared-components/button/PressableBtn";
import { SafeAreaView } from "react-native-safe-area-context";
import TextBase from "@shared-components/TextBase";

interface SettingScreenProps {}

const SettingScreen: React.FC<SettingScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const userData = useStore((state) => state.userData);
  // const linkAvatar = useStore((state) => state.linkAvatar);

  const styles = useMemo(() => createStyles(theme), [theme]);
  const { logout, isLoggedIn, renderViewRequestLogin } = useUserHook();
  const { isTeacher } = useUserHelper();
  const userMedia = useStore((state) => state.userMedia);

  const listSetting = [
    {
      title: translations.settingUser.purchaseCouse,
      icon: require("assets/images/book.png"),
      action: () => {
        if (userData?._id) {
          NavigationService.navigate(SCREENS.MY_COURES);
        } else {
          showWarningLogin();
        }
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
        if (userData?._id) {
          NavigationService.navigate(SCREENS.BLACK_LIST);
        } else {
          showWarningLogin();
        }
      },
    },
    {
      icon: require("assets/images/settingicon.png"),
      title: translations.settingUser.language,
      action: () => {
        NavigationService.navigate(SCREENS.CHANGELANGUAGE);
      },
    },
    // {
    //   title: translations.settingUser.private,
    //   icon: require("assets/images/securityicon.png"),
    //   action: () => {
    //     NavigationService.navigate(SCREENS.PRIVATESETTING);
    //   },
    // },
    {
      title: translations.settingUser.support,
      icon: require("assets/images/supporticon.png"),
      action: () => {
        if (userData?._id) {
          NavigationService.navigate(SCREENS.CHAT_ROOM, {
            partner_id: "65f7b1b3a22b22d7d3dcf078",
            partner_name: "Admin",
            isAdmin: true,
          });
        } else {
          showWarningLogin();
        }
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
      id: 2,
      action: () => {
        if (userData?._id) {
          NavigationService.navigate(SCREENS.COUPON_LIST);
        } else {
          showWarningLogin();
        }
      },
    },
    {
      showItemisLogin: true,
      title: translations.aboutUs.deleteacount,
      iconFont: "trash-2",
      id: 3,
      action: () => {
        deleteUser();
      },
    },
    // {
    //   title: translations.settingUser.codeActivations,
    //   iconFont: "package",
    //   action: () => {
    //     NavigationService.navigate(SCREENS.CODE_ACTIVATIONS_SCREEN);
    //   },
    // },
  ];
  // if(isTeacher){

  // }
  const becomeATutorial = () => {
    NavigationService.navigate(SCREENS.WEBVIEW_SCREEN, {
      txtHeader: translations.settingUser.becomeATutor,
      link: `https://ieltshunter.io/become-to-tutor?auth=${_getJson(
        USER_TOKEN,
      )}`,
    });
  };

  const deleteUser = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        title: translations.settings.deleteAccountConfirm,
        cb: () => deleteAccount(),
      },
    });
  };

  const deleteAccount = () => {
    deleteUserById(userData?._id)
      .then(() => {
        logout();
        showToast({
          type: "success",
          message: translations.settings.deleteAccountSuccess,
        });
      })
      .catch(() => {
        showToast({
          type: "error",
          message: translations.settings.deleteAccountFaild,
        });
      });
  };

  const renderListSetting = () => {
    return (
      <View style={{ backgroundColor: colors.white, flex: 1, marginTop: 20 }}>
        {listSetting.map((item, index) => {
          if (item?.id == 1 && !isTeacher && userData?.user_role != "admin")
            return null;
          if (item?.id == 2 && !isTeacher && userData?.user_role != "admin")
            return null;
          if (item?.id == 3 && !isLoggedIn()) return null;
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
    <SafeAreaView style={[CS.flex1]}>
      <Header text={translations.settingUser.setting}></Header>
      <ScrollView style={CS.flex1}>
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
                  sourceUri={
                    (userMedia?.user_avatar || "").trim().length > 0
                      ? { uri: userMedia?.user_avatar }
                      : require("@assets/images/default_avatar.jpg")
                  }
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
              <TouchableOpacity onPress={becomeATutorial}>
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
          </View>
        ) : (
          renderViewRequestLogin()
        )}
        {renderListSetting()}
      </ScrollView>
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
      <PressableBtn
        style={{
          width: 80,
          height: 36,
          position: "absolute",
          bottom: 0,
          zIndex: 1,
        }}
        onPress={openHiddenPage}
      >
        <TextBase>{"   "}</TextBase>
      </PressableBtn>
    </SafeAreaView>
  );
};

export default SettingScreen;
