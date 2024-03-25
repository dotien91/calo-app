import React, { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import { Linking, Text, TouchableOpacity, View } from "react-native";

import Header from "@shared-components/header/Header";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import createStyles from "./about.me.style";
import { translations } from "@localization";
import useStore from "@services/zustand/store";

import { useUserHook } from "@helpers/hooks/useUserHook";
import CS from "@theme/styles";

const AboutMe = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const userData = useStore((state) => state.userData);
  const { logout } = useUserHook();

  const listAboutme = [
    {
      showItemisLogin: false,
      title: translations.aboutUs.aboutUs,
      action: () => {
        OpenURLButton("https://docs.ieltshunter.io/");
      },
    },
    {
      showItemisLogin: false,
      title: translations.aboutUs.termofus,
      action: () => {
        OpenURLButton("https://docs.ieltshunter.io/term-and-conditions");
      },
    },
    {
      showItemisLogin: false,
      title: translations.aboutUs.privacy,
      action: () => {
        OpenURLButton("https://docs.ieltshunter.io/privacy-policy");
      },
    },
    {
      showItemisLogin: false,
      title: translations.aboutUs.cookie,
      action: () => {
        OpenURLButton("https://docs.ieltshunter.io/cookie");
      },
    },
    {
      showItemisLogin: false,
      title: translations.aboutUs.return,
      action: () => {
        OpenURLButton("https://docs.ieltshunter.io/chinh-sach-hoan-tien");
      },
    },
  ];

  const OpenURLButton = (url: string) => {
    Linking.openURL(url);
  };

  const renderAboutMe = () => {
    return (
      <View style={{ flex: 1 }}>
        {listAboutme.map((item, index) => {
          if (item.showItemisLogin === false) {
            return (
              <TouchableOpacity
                onPress={item.action}
                style={[
                  styles.styleItemButtonAboutUs,
                  { borderBottomWidth: 1, borderColor: colors.grey2 },
                ]}
                key={index}
              >
                <Text style={styles.styleTextTitleItem}>{item.title}</Text>
                <Icon
                  name="chevron-forward-outline"
                  type={IconType.Ionicons}
                ></Icon>
              </TouchableOpacity>
            );
          } else if (item.showItemisLogin === true && userData?._id) {
            return (
              <TouchableOpacity
                onPress={item.action}
                style={[
                  styles.styleItemButtonAboutUs,
                  { borderBottomWidth: 1, borderColor: colors.grey2 },
                ]}
                key={index}
              >
                <Text style={styles.styleTextTitleItem}>{item.title}</Text>
                <Icon
                  name="chevron-forward-outline"
                  type={IconType.Ionicons}
                ></Icon>
              </TouchableOpacity>
            );
          }
        })}
      </View>
    );
  };

  return (
    <View style={{ ...CS.safeAreaView }}>
      <Header text={translations.settingUser.aboutus} />
      {renderAboutMe()}
    </View>
  );
};
export default AboutMe;
