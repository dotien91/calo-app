import React, { useEffect, useMemo, useState } from "react";
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
import Clipboard from "@react-native-clipboard/clipboard";

import Header from "@shared-components/header/Header";
import { useTheme, useFocusEffect } from "@react-navigation/native";
import CS from "@theme/styles";
import Avatar from "@shared-components/user/Avatar";
import useStore from "@services/zustand/store";
import IconBtn from "@shared-components/button/IconBtn";
import PieChartCommon from "@shared-components/pie-chart/pie.chart";
import IconSvg from "assets/svg";
import TaskItemCommon from "@shared-components/task-item/task.item";
import { translations } from "@localization";
import { getListTaskByUser } from "@services/api/task.api";
import createStyles from "./profile.screen.style";
import { SCREENS } from "constants";
import PressableBtn from "@shared-components/button/PressableBtn";
import { getReferralByMe, getReferralMe } from "@services/api/user.api";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { formatPrice } from "@helpers/string.helper";

const SettingProfileScreen = () => {
  const theme = useTheme();
  const { colors } = theme;
  const userData = useStore((state) => state.userData);
  const userInfo = useStore((state) => state.userInfo);
  const [referralByMe, setReferralByMe] = useState([]);
  const [referralMe, setReferralMe] = useState([]);

  //call api:
  const params = {};

  const _getReferralByMe = () => {
    getReferralByMe(params).then((res) => {
      setReferralByMe(res.data);
    });
  };
  const _getReferralMe = () => {
    getReferralMe(params).then((res) => {
      setReferralMe(res.data);
    });
  };
  useEffect(() => {
    _getReferralByMe();
    _getReferralMe();
  }, []);

  const styles = useMemo(() => createStyles(theme), [theme]);
  console.log("userData", userData);
  const listrenderPointCoin = [
    {
      icon: "icCoinStar",
      title: userData?.point,
    },
    {
      icon: "icCoin",
      title: formatPrice(userData?.current_token || 0),
    },
    // {
    //   icon: "icCup",
    //   title: userData?.point,
    // },
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

  // const listShow = [
  //   {
  //     icon: "iconBookNote",
  //     title: "Code activations",
  //     backgroundIcon: colors.lightBlue,
  //     onPress: () =>
  //       NavigationService.navigate(SCREENS.CODE_ACTIVATIONS_SCREEN),
  //   },
  //   {
  //     icon: "iconFriends",
  //     title: "Referrer",
  //     backgroundIcon: colors.gold,
  //     onPress: () => {},
  //   },
  // ];

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

  const uploadAvatar = () => {};

  const openSetting = () => {
    NavigationService.navigate(SCREENS.SETTING);
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
        <PressableBtn onPress={openSetting} style={styles.viewInforuser}>
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
                padding: 4,
                width: "auto",
                height: "auto",
              }}
              onPress={uploadAvatar}
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

  const renderInviteFriend = () => {
    const coppyClipboard = () => {
      Clipboard.setString(userData?.invitation_code || "");
    };
    return (
      <View style={{ marginHorizontal: 16 }}>
        <Text style={styles.textInviteFriend}>
          {translations.task.inviteFriend}
        </Text>
        <View style={styles.viewInviteFriend}>
          <View style={styles.viewInviteFriendTop}>
            <View>
              <Text style={styles.textMyCode}>{translations.task.mycode}</Text>
              <PressableBtn
                onPress={coppyClipboard}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Text style={styles.textInviteCode}>
                  {userData?.invitation_code}
                </Text>
                <Image
                  style={{ height: 15.3, width: 13.79, marginLeft: 4 }}
                  source={require("assets/images/CopyIcon.png")}
                ></Image>
              </PressableBtn>
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

  const ItemCodeActive = ({ backgroundIcon, icon, title, onPress, count }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <View
          style={[
            { backgroundColor: backgroundIcon },
            styles.viewItemLeftCodeActive,
          ]}
        >
          <IconSvg name={icon} size={20}></IconSvg>
        </View>
        <View style={styles.viewTitleAndNumberCodeActive}>
          <Text style={styles.textTitleCodeActive}>{title}</Text>
          {!!count && (
            <Text style={{ ...CS.hnRegular, fontSize: 14, color: colors.text }}>
              {count}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const showReferrer = () => {
    if (referralMe.length > 0) {
      showSuperModal({
        contentModalType: EnumModalContentType.Referral,
        styleModalType: EnumStyleModalType.Bottom,
        data: referralMe[0]?.from_user_id,
      });
    }
  };

  const renderListCodeActive = () => {
    return (
      <View style={{ marginHorizontal: 16, marginVertical: 16 }}>
        <ItemCodeActive
          icon="iconBookNote"
          title="Code activations"
          backgroundIcon={colors.lightBlue}
          onPress={() =>
            NavigationService.navigate(SCREENS.CODE_ACTIVATIONS_SCREEN)
          }
          count={referralByMe.length}
        />

        <ItemCodeActive
          icon="iconFriends"
          title="Referrer"
          backgroundIcon={colors.gold}
          onPress={showReferrer}
          count={""}
        />
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
          <Tasks />
          {renderInviteFriend()}
          {renderListCodeActive()}
          {/* <ReferralPopup /> */}
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
          return <TaskItemCommon key={index} item={item}></TaskItemCommon>;
        })}
      </View>
    </View>
  );
});

export default SettingProfileScreen;
