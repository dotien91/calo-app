import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import IconSvg from "assets/svg";
import Avatar from "@shared-components/user/Avatar";
import CS from "@theme/styles";
import { getListLeaderBoard } from "@services/api/user.api";
import { translations } from "@localization";
import { SCREENS } from "constants";
import useStore from "@services/zustand/store";
import LoadingList from "@shared-components/loading.list.component";

const DiscoverScreen = () => {
  const screenWidth = Dimensions.get("window").width;
  const theme = useTheme();
  const { colors } = theme;

  const [listRank, setListRank] = useState([]);
  const [loading, setLoading] = useState(false);

  const userInfo = useStore((state) => state.userInfo);

  const getData = () => {
    const param = {
      limit: 3,
    };
    setLoading(true);
    getListLeaderBoard(param).then((res) => {
      setLoading(false);
      if (!res.isError) {
        setListRank(res.data.other_users);
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const listFeature = [
    {
      icon: "icThreeBook",
      title: translations.discover.study,
      screen: SCREENS.COURSE_LIST,
    },
    {
      icon: "icGradution",
      title: translations.discover.ieltsPractice,
      screen: SCREENS.IELTS_PRACTICE_HOME,
    },
    // {
    //   icon: "icShop",
    //   title: translations.discover.shop,
    // },
    {
      icon: "icFind",
      title: translations.discover.finduser,
      screen: SCREENS.COURSE_CATEGORY,
      params: { defaultIndex: 3 },
    },
  ];

  const seeAllLeader = () => {
    NavigationService.navigate(SCREENS.LEADERBOARD);
  };

  const renderHeader = () => {
    return (
      <View
        style={{
          height: 80,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.white,
          paddingHorizontal: 16,
          shadowColor: "rgba(0,0,0,0.8)",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.1,
          elevation: 1,
          shadowRadius: 5,
        }}
      >
        <IconSvg name="icCoinStar" size={32} color={colors.gold}></IconSvg>
        <View style={{ marginLeft: 8 }}>
          <Text style={{ ...CS.hnSemiBold, fontSize: 20, color: colors.text }}>
            {userInfo?.point} {translations.discover.poits}
          </Text>
          <Text
            style={{
              ...CS.hnRegular,
              fontSize: 14,
              color: colors.textOpacity8,
            }}
          >
            {translations.discover.level}: {userInfo?.level || "-"}
          </Text>
        </View>
      </View>
    );
  };

  const renderLeaderBoard = () => {
    if (loading) return <LoadingList numberItem={3} />;
    if (!listRank.length) return null;
    return (
      <View style={{ height: 270, marginHorizontal: 16, marginVertical: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ ...CS.hnSemiBold, fontSize: 16, color: colors.text }}>
            {translations.discover.leaderboard}
          </Text>
          <TouchableOpacity
            onPress={seeAllLeader}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text
              style={{
                ...CS.hnMedium,
                color: colors.textOpacity6,
                fontSize: 14,
              }}
            >
              {translations.seeAll}
            </Text>
            <Icon
              name="chevron-forward-outline"
              type={IconType.Ionicons}
              color={colors.textOpacity6}
            ></Icon>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1 / 3, justifyContent: "flex-end" }}>
            <View style={{ zIndex: 1 }}>
              <Avatar
                style={{
                  zIndex: 99,
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  position: "absolute",
                  bottom: -25,
                  left: screenWidth / 6 - 32 - 4,
                  borderWidth: 3,
                  borderColor: colors.blueBorder,
                  zIndex: 1,
                }}
                sourceUri={{
                  uri: `${listRank[1]?.user_avatar}`,
                }}
                resizeMode={"cover"}
              ></Avatar>
              <View
                style={{
                  zIndex: 99,
                  backgroundColor: colors.blueBorder,
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  bottom: -25,
                  right: screenWidth / 6 - 32 - 4,
                }}
              >
                <Text
                  style={{ ...CS.hnRegular, fontSize: 14, color: colors.white }}
                >
                  2
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: colors.skyblue,
                flex: 1 / 2,
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
              }}
            >
              <View style={{ alignItems: "center", marginTop: 30 }}>
                <Text
                  numberOfLines={2}
                  style={{ ...CS.hnRegular, fontSize: 14, color: colors.text }}
                >
                  {listRank[1]?.display_name}
                </Text>
                <Text
                  style={{
                    ...CS.hnSemiBold,
                    fontSize: 20,
                    color: colors.blueBorder,
                  }}
                >
                  {listRank[1]?.point}
                </Text>
                <Text
                  style={{
                    ...CS.hnRegular,
                    fontSize: 14,
                    color: colors.textOpacity8,
                  }}
                >
                  {translations.discover.poits}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 / 3, justifyContent: "flex-end" }}>
            <View style={{ zIndex: 1 }}>
              <Avatar
                style={{
                  zIndex: 99,
                  width: 88,
                  height: 88,
                  borderRadius: 44,
                  position: "absolute",
                  bottom: -40,
                  left: screenWidth / 6 - 44 - 4,
                  borderWidth: 3,
                  borderColor: colors.gold,
                }}
                sourceUri={{
                  uri: `${listRank[0]?.user_avatar_thumbnail}`,
                }}
                resizeMode={"cover"}
              ></Avatar>

              <IconSvg
                style={{
                  position: "absolute",
                  bottom: 50,
                  left: screenWidth / 6 - 13 - 8,
                  zIndex: 99,
                }}
                name="icKing"
                size={30}
                color={colors.gold}
              ></IconSvg>
              <View
                style={{
                  zIndex: 99,
                  backgroundColor: colors.gold,
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  bottom: -38,
                  right: screenWidth / 6 - 44 - 4,
                }}
              >
                <Text
                  style={{ ...CS.hnRegular, fontSize: 14, color: colors.white }}
                >
                  1
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: colors.skin,
                flex: 0.7,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 32,
              }}
            >
              <View style={{ alignItems: "center", marginTop: 45 }}>
                <Text
                  numberOfLines={3}
                  style={{ ...CS.hnRegular, fontSize: 14, color: colors.text }}
                >
                  {listRank[0]?.display_name}
                </Text>
                <Text
                  style={{ ...CS.hnSemiBold, fontSize: 20, color: colors.gold }}
                >
                  {listRank[0]?.point}
                </Text>
                <Text
                  style={{
                    ...CS.hnRegular,
                    fontSize: 14,
                    color: colors.textOpacity8,
                  }}
                >
                  {translations.discover.poits}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 / 3, justifyContent: "flex-end" }}>
            <View style={{ zIndex: 1 }}>
              <Avatar
                style={{
                  zIndex: 99,
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  position: "absolute",
                  bottom: -22,
                  left: screenWidth / 6 - 28 - 4,
                  borderWidth: 3,
                  borderColor: colors.green,
                }}
                sourceUri={{
                  uri: `${listRank[2]?.user_avatar_thumbnail}`,
                }}
                resizeMode={"cover"}
              ></Avatar>
              <View
                style={{
                  zIndex: 99,
                  backgroundColor: colors.green,
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  bottom: -22,
                  right: screenWidth / 6 - 28 - 8,
                }}
              >
                <Text
                  style={{ ...CS.hnRegular, fontSize: 14, color: colors.white }}
                >
                  3
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: colors.greenOpa,
                flex: 0.4,
                borderTopRightRadius: 12,
                borderBottomRightRadius: 12,
              }}
            >
              <View style={{ alignItems: "center", marginTop: 30 }}>
                <Text
                  numberOfLines={1}
                  style={{ ...CS.hnRegular, fontSize: 14, color: colors.text }}
                >
                  {listRank[2]?.display_name}
                </Text>
                <Text
                  style={{
                    ...CS.hnSemiBold,
                    fontSize: 20,
                    color: colors.greenText,
                  }}
                >
                  {listRank[2]?.point}
                </Text>
                <Text
                  style={{
                    ...CS.hnRegular,
                    fontSize: 14,
                    color: colors.textOpacity8,
                  }}
                >
                  {translations.discover.poits}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderFeature = () => {
    return (
      <View style={{ marginHorizontal: 16 }}>
        <Text
          style={{
            ...CS.hnSemiBold,
            fontSize: 16,
            color: colors.text,
            marginVertical: 8,
          }}
        >
          {translations.discover.feature}
        </Text>
        <View>
          {listFeature.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  backgroundColor: colors.grey2,
                  marginVertical: 4,
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    NavigationService.navigate(item.screen, item.params)
                  }
                  style={{
                    flexDirection: "row",
                    alignItems: "center",

                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <IconSvg
                      name={item.icon}
                      size={24}
                      color={colors.btnRedPrimary}
                    ></IconSvg>
                    <Text
                      style={{
                        ...CS.hnMedium,
                        marginLeft: 8,
                        fontSize: 16,
                        color: colors.btnRedPrimary,
                      }}
                    >
                      {item.title}
                    </Text>
                  </View>
                  <View
                    style={{
                      padding: 8,
                      backgroundColor: colors.btnRedPrimary,
                      borderRadius: 99,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      name="chevron-forward-outline"
                      type={IconType.Ionicons}
                      color={colors.white}
                    ></Icon>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ ...CS.safeAreaView, marginBottom: getBottomSpace() }}
    >
      <View style={{ flex: 1 }}>
        {renderHeader()}
        <ScrollView>
          {renderLeaderBoard()}
          {renderFeature()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default DiscoverScreen;
