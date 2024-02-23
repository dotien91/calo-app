import React, { useMemo } from "react";
import { translations } from "@localization";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import Header from "@shared-components/header/Header";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { useTheme } from "@react-navigation/native";
import CS from "@theme/styles";
import Avatar from "@shared-components/user/Avatar";

import useStore from "@services/zustand/store";

const SettingProfileScreen = () => {
  const theme = useTheme();
  const { colors } = theme;
  const userData = useStore((state) => state.userData);

  const listrenderPointCoin = [
    {
      icon: "trophy",
      title: "adasdadasdasda",
    },
    {
      icon: "trophy",
      title: "adasdadasdasda",
    },
    {
      icon: "trophy",
      title: "adasdadasdasda",
    },
  ];

  const renderItemSelected = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          borderWidth: 1,
          borderRadius: 8,
          width: 225,
          height: 66,
          alignItems: "center",
          marginHorizontal: 12,
        }}
      >
        <Icon
          // style={{height: 32, width: 32}}
          style={{ marginHorizontal: 12 }}
          type={IconType.Ionicons}
          name={item.icon}
          color={colors.gold}
        ></Icon>
        <Text
          style={{ ...CS.hnSemiBold, fontSize: 16, color: colors.textOpacity8 }}
        >
          {item.title}
        </Text>
      </View>
    );
  };

  const renderScrollPointCoin = () => {
    return (
      <FlatList
        // style={{height: 66}}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={listrenderPointCoin}
        renderItem={renderItemSelected}
      />
    );
  };

  const renderAvataProfile = () => {
    return (
      <View style={{ flex: 1 }}>
        <Avatar
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
          }}
          sourceUri={{
            uri: userData?.user_avatar_thumbnail,
          }}
          resizeMode={"cover"}
        ></Avatar>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Header customStyle={{ marginTop: 20 }} text="Profile" />
        {renderScrollPointCoin()}
        {renderAvataProfile()}
      </View>
    </SafeAreaView>
  );
};
export default SettingProfileScreen;
