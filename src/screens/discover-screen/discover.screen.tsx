import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";

import { useTheme } from "@react-navigation/native";
import IconSvg from "assets/svg";
import Avatar from "@shared-components/user/Avatar";
import CS from "@theme/styles";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { getListLeaderBoard } from "@services/api/user.api";

const DiscoverScreen = () => {
  const screenWidth = Dimensions.get("window").width;
  const theme = useTheme();
  const { colors } = theme;

  const [listRank, setListRank] = useState([]);
  const [rankUser, setRankUser] = useState({});

  const getData = () => {
    const param = {
      limit: 3,
    };
    getListLeaderBoard(param).then((res) => {
      setListRank(res.data.other_users);
      setRankUser(res.data.user_id);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const first = useRef(new Animated.Value(0)).current;
  const second = useRef(new Animated.Value(0)).current;
  const third = useRef(new Animated.Value(0)).current;
  const four = useRef(new Animated.Value(0)).current;

  const hig = useRef(new Animated.Value(0)).current;

  const listFeature = [
    {
      icon: "icThreeBook",
      title: "Study",
      opa: first,
    },
    {
      icon: "icGradution",
      title: "Dictionary",
      opa: second,
    },
    {
      icon: "icShop",
      title: "Shop",
      opa: third,
    },
    {
      icon: "icFind",
      title: "Find User",
      opa: four,
    },
  ];

  useEffect(() => {
    Animated.timing(hig, {
      toValue: 1,
      duration: 1200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(first, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(second, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(third, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(four, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
        <IconSvg name="icStudent" size={32} color={colors.gold}></IconSvg>
        <View style={{ marginLeft: 8 }}>
          <Text style={{ ...CS.hnSemiBold, fontSize: 20, color: colors.text }}>
            {rankUser?.point} Coins
          </Text>
          <Text
            style={{
              ...CS.hnRegular,
              fontSize: 14,
              color: colors.textOpacity8,
            }}
          >
            Level: {rankUser?.level}
          </Text>
        </View>
      </View>
    );
  };

  const renderLeaderBoard = () => {
    return (
      <View style={{ height: 270, marginHorizontal: 16, marginVertical: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ ...CS.hnSemiBold, fontSize: 16, color: colors.text }}>
            Leader Board
          </Text>
          <Text
            style={{ ...CS.hnMedium, color: colors.textOpacity6, fontSize: 14 }}
          >
            See all
          </Text>
        </View>
        <Animated.View style={{ flex: 1, flexDirection: "row", opacity: hig }}>
          <View style={{ flex: 1 / 3, justifyContent: "flex-end" }}>
            <View>
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
                }}
                sourceUri={{
                  uri: `${listRank[1]?.user_avatar_thumbnail}`,
                }}
                resizeMode={"cover"}
              ></Avatar>
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
                  Points
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 / 3, justifyContent: "flex-end" }}>
            <View>
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
                  Points
                </Text>
              </View>
            </View>
          </View>

          <View style={{ flex: 1 / 3, justifyContent: "flex-end" }}>
            <View>
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
                  Points
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
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
          Features
        </Text>
        <View>
          {listFeature.map((item, index) => {
            return (
              <Animated.View
                key={index}
                style={{
                  opacity: item.opa,
                  backgroundColor: colors.grey2,
                  marginVertical: 4,
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // opacity: item.opa,
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
              </Animated.View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: 25 }}>
        {renderHeader()}
        {renderLeaderBoard()}
        {renderFeature()}
      </View>
    </SafeAreaView>
  );
};
export default DiscoverScreen;
