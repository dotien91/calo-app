import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import IconSvg from "assets/svg";
import CS from "@theme/styles";
import { getListLeaderBoard } from "@services/api/user.api";
import { translations } from "@localization";
import { SCREENS } from "constants";
import useStore from "@services/zustand/store";
import LoadingList from "@shared-components/loading.list.component";
import { palette } from "@theme/themes";
import ItemLeaderBoard from "./components/item.leader.board";

const DiscoverScreen = () => {
  const theme = useTheme();
  const { colors } = theme;

  const [listRank, setListRank] = useState([]);
  const [loading, setLoading] = useState(false);

  const userInfo = useStore((state) => state.userInfo);

  const countPressHiddenPageBtn = React.useRef(0);

  const openHiddenPage = () => {
    countPressHiddenPageBtn.current += 1;
    if (countPressHiddenPageBtn.current == 3) {
      NavigationService.navigate(SCREENS.HIDDEN_PAGE);
      countPressHiddenPageBtn.current = 0;
    }
  };

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
      icon: "icAudio",
      title: translations.podcast.listPodcast,
      screen: SCREENS.AUDIO_BOOK,
    },
    {
      icon: "icThreeBook",
      title: translations.discover.study,
      screen: SCREENS.COURSE_LIST,
    },
    // {
    //   icon: "icGradution",
    //   title: translations.discover.ieltsPractice,
    //   screen: SCREENS.IELTS_PRACTICE_HOME,
    // },
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
    {
      icon: "icPersonSearch",
      title: translations.discover.findTutor,
      screen: SCREENS.COURSE_CATEGORY,
      params: { defaultIndex: 1 },
    },
  ];

  const seeAllLeader = () => {
    NavigationService.navigate(SCREENS.LEADERBOARD);
  };

  const renderHeader = () => {
    return (
      <View style={styles.viewHeader}>
        <IconSvg name="icCoinStar" size={32} color={colors.gold}></IconSvg>
        <View style={{ marginLeft: 8 }}>
          <Text style={{ ...CS.hnSemiBold, fontSize: 20, color: colors.text }}>
            {userInfo?.point} {translations.discover.poits}
          </Text>
          <Pressable
            style={{
              position: "absolute",
              right: -10,
              bottom: 0,
              width: 40,
              height: 40,
              zIndex: 1,
              opacity: 0,
            }}
            onPress={openHiddenPage}
          >
            <Text style={{ color: "#fff" }}>.......</Text>
          </Pressable>
          <Text style={styles.txtHeader}>
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
        <ItemLeaderBoard />
      </View>
    );
  };

  const renderFeature = () => {
    return (
      <View style={{ marginTop: 20, marginHorizontal: 16 }}>
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
    <SafeAreaView style={{ ...CS.safeAreaView }}>
      <View style={{ flex: 1 }}>
        {renderHeader()}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {renderLeaderBoard()}
          {renderFeature()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default DiscoverScreen;

const styles = StyleSheet.create({
  viewHeader: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.white,
    paddingHorizontal: 16,
    shadowColor: "rgba(0,0,0,0.8)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    elevation: 1,
    shadowRadius: 5,
  },
  txtHeader: {
    ...CS.hnRegular,
    fontSize: 14,
    color: palette.textOpacity8,
  },
});
