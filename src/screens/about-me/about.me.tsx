import React, { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import Header from "@shared-components/header/Header";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import createStyles from "./about.me.style";
import { translations } from "@localization";
import { deleteUserById } from "@services/api/user.api";
import useStore from "@services/zustand/store";

const AboutMe = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const userData = useStore((state) => state.userData);

  const listAboutme = [
    {
      title: translations.aboutUs.aboutUs,
      action: () => {},
    },
    {
      title: translations.aboutUs.termofus,
      action: () => {},
    },
    {
      title: translations.aboutUs.privacy,
      action: () => {},
    },
    {
      title: translations.aboutUs.cookie,
      action: () => {},
    },
    {
      title: translations.aboutUs.return,
      action: () => {},
    },
    {
      title: translations.aboutUs.deleteacount,
      action: () => {
        deleteUser();
      },
    },
  ];

  const deleteUser = () => {
    deleteUserById(userData?._id)
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderAboutMe = () => {
    return (
      <View style={{ flex: 1 }}>
        {listAboutme.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={item.action}
              style={styles.styleItemButtonAboutUs}
              key={index}
            >
              <Text style={styles.styleTextTitleItem}>{item.title}</Text>
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
    <View style={{ flex: 1 }}>
      <Header text="About me" />
      {renderAboutMe()}
    </View>
  );
};
export default AboutMe;
