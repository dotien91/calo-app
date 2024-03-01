import React, { useMemo } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import Header from "@shared-components/header/Header";
import { useTheme } from "@react-navigation/native";
import CS from "@theme/styles";
import Avatar from "@shared-components/user/Avatar";
import useStore from "@services/zustand/store";
import IconBtn from "@shared-components/button/IconBtn";
import PieChartCommon from "@shared-components/pie-chart/pie.chart";
import IconSvg from "assets/svg";
import TaskItemCommon from "@shared-components/task-item/task.item";
import { translations } from "@localization";
import { useListData } from "@helpers/hooks/useListData";
import { getListRedeemMissionTask } from "@services/api/task.api";
import createStyles from "./profile.screen.style";
import { SCREENS } from "constants";

const SettingProfileScreen = () => {
  const theme = useTheme();
  const { colors } = theme;
  const userData = useStore((state) => state.userData);
  const userInfo = useStore((state) => state.userInfo);

  const { listData } = useListData({ limit: "5" }, getListRedeemMissionTask);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const listrenderPointCoin = [
    {
      icon: "icCoinStar",
      title: userInfo?.point,
    },
    {
      icon: "icCoin",
      title: userData?.current_coin,
    },
    {
      icon: "icCup",
      title: userData?.point,
    },
  ];

  const data = [
    {
      percentage: 10,
      color: colors.btnRedPrimary,
      title: "Listening",
    },
    {
      percentage: 20,
      color: colors.gold,
      title: "Reading",
    },
    {
      percentage: 30,
      color: colors.blueChart,
      title: "Writing",
    },
    {
      percentage: 40,
      color: colors.greenChart,
      title: "Listening",
    },
  ];

  const listShow = [
    {
      icon: "iconBookNote",
      title: "Code activations",
      backgroundIcon: colors.lightBlue,
    },
    {
      icon: "iconFriends",
      title: "Referrer",
      backgroundIcon: colors.gold,
    },
  ];

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
    return (
      <View key={index} style={styles.viewItemScrollMoney}>
        <IconSvg
          style={{ marginHorizontal: 12 }}
          name={item.icon}
          color={colors.gold}
          size={26}
        ></IconSvg>
        <Text style={styles.textNumberMoney}>{item.title}</Text>
      </View>
    );
  };

  const renderScrollPointCoin = () => {
    return (
      <View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={listrenderPointCoin}
          renderItem={renderItemSelected}
        />
        <View style={styles.viewInforuser}>
          <View>
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
            <IconBtn
              name="camera"
              color={colors.white}
              customStyle={{
                position: "absolute",
                zIndex: 1,
                bottom: 0,
                backgroundColor: colors.textOpacity6,
                borderRadius: 99,
                right: 0,
                padding: 3,
              }}
              // onPress={handleSwitchCamera}
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
            <Text style={styles.textLevel}>
              {translations.task.level} {userData?.level}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPieChart = () => {
    return (
      <View style={{ marginHorizontal: 16 }}>
        <Text style={styles.textYourScore}>{translations.task.yourscore}</Text>
        <PieChartCommon sections={data}></PieChartCommon>
        <View style={styles.viewPowered}>
          <Text style={styles.textPoweredBy}>{translations.task.powered}</Text>
          <IconSvg name="logoIeltsHunter" width={32} height={18} />
        </View>
      </View>
    );
  };

  const renderTask = () => {
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
            <Text style={styles.textSeeAll}>{translations.seeAll}</Text>
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
          {listData.map((item, index) => {
            return <TaskItemCommon key={index} item={item}></TaskItemCommon>;
          })}
        </View>
      </View>
    );
  };

  const renderInviteFriend = () => {
    return (
      <View style={{ marginHorizontal: 16 }}>
        <Text style={styles.textInviteFriend}>
          {translations.task.inviteFriend}
        </Text>
        <View style={styles.viewInviteFriend}>
          <View style={styles.viewInviteFriendTop}>
            <View>
              <Text style={styles.textMyCode}>{translations.task.mycode}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.textInviteCode}>
                  {userData?.invitation_code}
                </Text>
                <Image
                  style={{ height: 15.3, width: 13.79, marginLeft: 4 }}
                  source={require("assets/images/CopyIcon.png")}
                ></Image>
              </View>
            </View>
            <TouchableOpacity style={styles.touchShare}>
              <IconSvg name="icupLoad" width={32} height={18}></IconSvg>
              <Text style={styles.textShare}>{translations.post.share}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.viewLineInviteFriend}></View>
          <Text style={styles.textDesciption}>
            You will get 4000 points for each friend who activates oyur code and
            earns 10000 points. Your friend will also get 1000 points as a
            reward.
          </Text>
        </View>
      </View>
    );
  };

  const renderListCodeActive = () => {
    return (
      <View style={{ marginHorizontal: 16, marginVertical: 16 }}>
        {listShow.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View
                style={[
                  { backgroundColor: item.backgroundIcon },
                  styles.viewItemLeftCodeActive,
                ]}
              >
                <IconSvg name={item.icon} size={20}></IconSvg>
              </View>
              <View style={styles.viewTitleAndNumberCodeActive}>
                <Text style={styles.textTitleCodeActive}>{item.title}</Text>
                <Text
                  style={{ ...CS.hnRegular, fontSize: 14, color: colors.text }}
                >
                  01
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        hideBackBtn
        onPressRight={onPressHeaderRight}
        iconNameRight="settings"
        text="Profile"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, marginBottom: 20 }}>
          {renderScrollPointCoin()}
          {renderPieChart()}
          {renderTask()}
          {renderInviteFriend()}
          {renderListCodeActive()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default SettingProfileScreen;
