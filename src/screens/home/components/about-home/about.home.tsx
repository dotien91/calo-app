import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import createStyles from "./about.home.style";
import { useTheme } from "@react-navigation/native";

const AboutHome = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const listCategory = [
    {
      title: translations.listCategory.course,
      textColor: "#E14242",
      iconColor: "#E14242",
      icon: "book",
      action: () => {},
      color: "#FFEDED",
    },
    {
      title: translations.listCategory.tutor,
      textColor: "#FFA347",
      iconColor: "#FFA347",
      icon: "graduate-outline",
      action: () => {},
      color: "#FFF3DA",
    },
    {
      title: translations.listCategory.shop,
      textColor: "#35AEFF",
      iconColor: "#35AEFF",
      icon: "icShop",
      action: () => {},
      color: "#D6F8FF",
    },
    {
      title: translations.listCategory.affiliate,
      textColor: "#2BC456",
      iconColor: "#2BC456",
      icon: "icAffiliate",
      action: () => {},
      color: "#E8F7EF",
    },
  ];

  return (
    <View>
      <View style={CommonStyle.flex2}>
        <Text style={styles.styleTxtText}>{translations.welcomeBack}</Text>
        <Text style={styles.styleTxtText2}>Khanh Bui</Text>
      </View>
      <View style={CommonStyle.flex2}>
        <Text style={styles.styleTxtTitle}>
          {translations.listCategory.descriptionTitle}
        </Text>
      </View>
      <View>
        {listCategory.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={item.action}
              style={[
                styles.styleItemNaviCategory,
                { backgroundColor: item.color },
              ]}
              key={index}
            >
              <Icon
                style={{
                  paddingLeft: 16,
                  paddingRight: 2,
                  alignContent: "center",
                  justifyContent: "center",
                }}
                type={IconType.Ionicons}
                color={item.iconColor}
                name={item.icon}
                size={24}
              ></Icon>
              <View style={styles.styleViewItemTitle}>
                <Text
                  style={[styles.styleTextItemTitle, { color: item.textColor }]}
                >
                  {item.title}
                </Text>
                <View
                  style={[
                    styles.styleViewIcon,
                    { backgroundColor: item.iconColor },
                  ]}
                >
                  <Icon
                    name="chevron-forward-outline"
                    type={IconType.Ionicons}
                    color="#FFF"
                    size={24}
                  ></Icon>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default AboutHome;
