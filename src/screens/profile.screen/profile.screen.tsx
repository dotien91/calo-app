import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
// import Clipboard from "@react-native-community/clipboard";

import Header from "@shared-components/header/Header";
import { useTheme, useFocusEffect } from "@react-navigation/native";
import CS from "@theme/styles";
import Avatar from "@shared-components/user/Avatar";
import useStore from "@services/zustand/store";
import IconBtn from "@shared-components/button/IconBtn";
import PieChartCommon from "@shared-components/pie-chart/pie.chart";
import IconSvg from "assets/svg";
import { translations } from "@localization";
import { getListTaskByUser } from "@services/api/task.api";
import createStyles from "./profile.screen.style";
import { SCREENS } from "constants";
import PressableBtn from "@shared-components/button/PressableBtn";
import formatMoney from "@shared-components/input-money/format.money";
import { useUserHook } from "@helpers/hooks/useUserHook";
import useUserHelper from "@helpers/hooks/useUserHelper";
import { palette } from "@theme/themes";
import ListCodeActive from "@shared-components/code-active/list.code.active";
import InviteCode from "@shared-components/code-share/code.invite.share";
import eventEmitter from "@services/event-emitter";
import TashListItem from "@shared-components/task-item/task.list.item";
import { getListScore } from "@services/api/pie.chart.api";

const SettingProfileScreen = () => {
  const theme = useTheme();
  const { colors } = theme;
  const userData = useStore((state) => state.userData);
  const userInfo = useStore((state) => state.userInfo);
  const userMedia = useStore((state) => state.userMedia);
  const { renderViewRequestLogin } = useUserHook();
  const { changeUserMedia } = useUserHelper();

  const styles = useMemo(() => createStyles(theme), [theme]);
  const listrenderPointCoin = [
    {
      icon: "icMoney",
      title: formatMoney(userInfo?.current_token || 0),
      onPress: () =>
        NavigationService.navigate(SCREENS.HOME_AFFILIATE, { type: "token" }),
      end: "VND",
      color: palette.colorMoney,
      hide: !(
        userData?.user_role === "teacher" || userData?.user_role === "admin"
      ),
    },
    {
      icon: "icCoinStar",
      title: userInfo?.point || 0,
      onPress: () => NavigationService.navigate(SCREENS.DISCOVERSCREEN),
      end: "Points",
    },
    {
      icon: "icCoin",
      title: userInfo?.current_coin || 0,
      onPress: () =>
        NavigationService.navigate(SCREENS.AFFILIATE, { type: "coin" }),
      end: "IHC",
    },
  ];

  const [data, setData] = useState([]);
  const [point, setPoint] = useState([]);

  const _getListScore = () => {
    const paramsRequest = {};
    getListScore(paramsRequest).then((res) => {
      if (!res.isError) {
        const {
          listening_percentage_average = 0,
          speaking_percentage_average = 0,
          reading_percentage_average = 0,
          writing_percentage_average = 0,
        } = res.data;
        const sum =
          listening_percentage_average +
          speaking_percentage_average +
          reading_percentage_average +
          writing_percentage_average;

        const average = sum / 4;
        setPoint(average ? average.toFixed(3) : 0);
        const data = [
          {
            percentage: Number(
              ((listening_percentage_average * 100) / (sum || 1)).toFixed(2),
            ),
            color: palette.btnRedPrimary,
            title: translations.task.listening,
          },
          {
            percentage: Number(
              ((speaking_percentage_average * 100) / (sum || 1)).toFixed(2),
            ),
            color: palette.gold,
            title: translations.task.speaking,
          },
          {
            percentage: Number(
              ((reading_percentage_average * 100) / (sum || 1)).toFixed(2),
            ),
            color: palette.blueChart,
            title: translations.task.reading,
          },
          {
            percentage: Number(
              ((writing_percentage_average * 100) / (sum || 1)).toFixed(2),
            ),
            color: palette.greenChart,
            title: translations.task.writing,
          },
        ];
        setData(data);
      } else {
        setPoint(0);
        setData([
          {
            percentage: 0,
            color: palette.btnRedPrimary,
            title: translations.task.listening,
          },
          {
            percentage: 0,
            color: palette.gold,
            title: translations.task.speaking,
          },
          {
            percentage: 0,
            color: palette.blueChart,
            title: translations.task.reading,
          },
          {
            percentage: 0,
            color: palette.greenChart,
            title: translations.task.writing,
          },
        ]);
      }
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      _getListScore();
    }, []),
  );
  const onPressHeaderRight = () => {
    NavigationService.navigate(SCREENS.SETTING);
  };
  const renderItemSelected = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    if (item.hide) return null;
    return (
      <PressableBtn
        onPress={item.onPress}
        key={index}
        style={[styles.viewItemScrollMoney]}
      >
        <IconSvg
          style={{ marginHorizontal: 12 }}
          name={item.icon}
          color={item.color || colors.gold}
          size={26}
        ></IconSvg>
        <Text
          style={styles.textNumberMoney}
        >{`${item.title} ${item.end}`}</Text>
      </PressableBtn>
    );
  };
  const openSetting = () => {
    NavigationService.navigate(SCREENS.SETTING);
  };

  const renderScrollPointCoin = () => {
    return (
      <View>
        <FlatList
          style={{ paddingHorizontal: 16 }}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={listrenderPointCoin}
          renderItem={renderItemSelected}
        />
        <PressableBtn onPress={openSetting} style={styles.viewInforuser}>
          <View>
            <Avatar
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
              }}
              sourceUri={{
                uri: userMedia?.user_avatar,
              }}
              resizeMode={"cover"}
            ></Avatar>
            <IconBtn
              name="camera"
              color={colors.white}
              onPress={() => changeUserMedia("user_avatar")}
              customStyle={{
                position: "absolute",
                zIndex: 1,
                bottom: 0,
                backgroundColor: colors.textOpacity6,
                borderRadius: 99,
                right: 0,
                padding: 4,
                width: "auto",
                height: "auto",
              }}
              size={12}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <View style={styles.viewDisplayname}>
              <Text style={styles.textDisplayName}>
                {userData?.display_name}
              </Text>
              <Icon
                type={IconType.Ionicons}
                name="chevron-forward"
                color={colors.black}
                size={24}
              />
            </View>
            <View style={styles.boxLevel}>
              <Text style={styles.textLevel}>
                {translations.task.level} {userData?.level}
              </Text>
            </View>
          </View>
        </PressableBtn>
      </View>
    );
  };

  const openHiddenPage = () => {
    NavigationService.navigate(SCREENS.HIDDEN_PAGE);
  };
  const renderPieChart = () => {
    return (
      <View style={{ marginHorizontal: 16 }}>
        <Text style={styles.textYourScore}>{translations.task.yourscore}</Text>
        <PieChartCommon sections={data} point={point}></PieChartCommon>
        <Pressable onLongPress={openHiddenPage} style={styles.viewPowered}>
          <Text style={styles.textPoweredBy}>{translations.task.powered}</Text>
          <IconSvg name="logoIeltsHunter" width={32} height={18} />
        </Pressable>
      </View>
    );
  };

  const renderInviteFriend = () => {
    return (
      <View style={{ marginHorizontal: 16 }}>
        <Text style={styles.textInviteFriend}>
          {translations.task.inviteFriend}
        </Text>
        <InviteCode />
      </View>
    );
  };

  if (!userData?._id) {
    return (
      <SafeAreaView style={CS.container}>
        <Header
          hideBackBtn
          onPressRight={onPressHeaderRight}
          iconNameRight="settings"
          text={translations.profile.profile}
        />
        {renderViewRequestLogin()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={CS.container}>
      <Header
        hideBackBtn
        onPressRight={onPressHeaderRight}
        iconNameRight="settings"
        text={translations.profile.profile}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, marginBottom: 20 }}>
          {renderScrollPointCoin()}
          {renderPieChart()}
          <Tasks />
          {renderInviteFriend()}
          <ListCodeActive />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Tasks = React.memo(() => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const onSeeAll = () => {
    NavigationService.navigate(SCREENS.TASK_SCREEN);
  };

  const [listData, setListData] = React.useState([]);
  useFocusEffect(
    React.useCallback(() => {
      getTask();
    }, []),
  );

  useEffect(() => {
    eventEmitter.on("reload_list_task", getTask);
    return () => {
      eventEmitter.off("reload_list_task", getTask);
    };
  }, []);

  const getTask = () => {
    getListTaskByUser({ order_by: "DESC" }).then((res) => {
      if (!res.isError) {
        setListData((res.data?.[0]?.missions || []).reverse());
      }
    });
  };

  return (
    <View style={{ marginTop: 16, marginHorizontal: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 16,
        }}
      >
        <Text style={styles.textTasks}>{translations.task.task}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <PressableBtn onPress={onSeeAll}>
            <Text style={styles.textSeeAll}>{translations.seeAll}</Text>
          </PressableBtn>
          <Icon
            name="chevron-forward-outline"
            type={IconType.Ionicons}
            color={colors.btnRedPrimary}
            size={16}
          ></Icon>
        </View>
      </View>
      <View
        style={{
          backgroundColor: colors.backgroundColorGrey,
          borderRadius: 8,
        }}
      >
        {listData.slice(0, 5).map((item, index) => {
          return <TashListItem key={index} item={item} />;
        })}
      </View>
    </View>
  );
});

export default SettingProfileScreen;
