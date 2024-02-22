import React from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "@shared-components/header/Header";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { useTheme } from "@react-navigation/native";
import CS from "@theme/styles";
import Avatar from "@shared-components/user/Avatar";
import useStore from "@services/zustand/store";
import IconBtn from "@shared-components/button/IconBtn";
import PieChartCommon from "@shared-components/pie-chart/pie.chart";
import IconSvg from "assets/svg";
import TaskItemCommon from "@shared-components/task-item/task.item";
import { translations } from "@localization";
// import { useListData } from "@helpers/hooks/useListData";
// import { getListTask } from "@services/api/task.api";

const SettingProfileScreen = () => {
  const theme = useTheme();
  const { colors } = theme;
  const userData = useStore((state) => state.userData);

  // const {
  //   listData,
  // } = useListData({ limit: 5 }, getListTask);

  const listrenderPointCoin = [
    {
      icon: "icCoin",
      title: "adasdadasdasda",
    },
    {
      icon: "icCup",
      title: "adasdadasdasda",
    },
    {
      icon: "icCoinStar",
      title: "adasdadasdasda",
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

  const dataTask = [
    {
      typeTask: "Like",
      title: "Like commend",
      decs: "Like a post in Community",
      coinNum: 1,
    },
    {
      typeTask: "Comment",
      title: "Like commend",
      decs: "Like a post in Community",
      coinNum: 10,
    },
    {
      typeTask: "Buy",
      title: "Like commend",
      decs: "Like a post in Community",
      coinNum: 5,
    },
    {
      typeTask: "Post",
      title:
        "Like commend Like commend Like commend Like commend Like commend Like commend",
      decs: "Like a post in Community",
      coinNum: 20,
    },
    {
      typeTask: "Practive",
      title: "Like commend",
      decs: "Like a post in Community",
      coinNum: 20,
    },
  ];

  const listShow = [
    {
      icon: "icCoin",
      title: "Code active",
    },
    {
      icon: "icCoin",
      title: "Code active",
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
        key={index}
        style={{
          flexDirection: "row",
          borderWidth: 1,
          borderRadius: 8,
          width: 225,
          height: 66,
          alignItems: "center",
          marginHorizontal: 12,
          backgroundColor: colors.backgroundColorGrey,
          borderColor: colors.backgroundColorGrey,
        }}
      >
        <IconSvg
          style={{ marginHorizontal: 12 }}
          name={item.icon}
          color={colors.gold}
          size={26}
        ></IconSvg>
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
      <View>
        <FlatList
          // style={{height: 66}}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={listrenderPointCoin}
          renderItem={renderItemSelected}
        />
        <View
          style={{ flexDirection: "row", marginHorizontal: 16, marginTop: 16 }}
        >
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
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ ...CS.hnSemiBold, fontSize: 16, color: colors.text }}
              >
                {userData?.display_name}
              </Text>
              <Icon
                type={IconType.Ionicons}
                name="chevron-forward"
                color={colors.black}
                size={24}
              />
            </View>
            <Text
              style={{
                backgroundColor: colors.btnRedPrimary,
                width: 58,
                textAlign: "center",
                color: colors.white,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              Level 0
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPieChart = () => {
    return (
      <View style={{ marginHorizontal: 16 }}>
        <Text
          style={{
            ...CS.hnSemiBold,
            fontSize: 16,
            color: colors.text,
            marginVertical: 32,
          }}
        >
          {translations.task.yourscore}
        </Text>
        <PieChartCommon sections={data}></PieChartCommon>
        <View style={{ flexDirection: "row", marginTop: 32, marginLeft: 20 }}>
          <Text
            style={{
              ...CS.hnMedium,
              fontSize: 10,
              color: colors.textOpacity4,
              marginRight: 4,
            }}
          >
            {translations.task.powered}
          </Text>
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
          <Text style={{ ...CS.hnSemiBold, fontSize: 16, color: colors.text }}>
            Tasks
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                ...CS.hnMedium,
                fontSize: 14,
                color: colors.btnRedPrimary,
              }}
            >
              See all
            </Text>
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
          {dataTask.map((item, index) => {
            return <TaskItemCommon key={index} item={item}></TaskItemCommon>;
          })}
        </View>
      </View>
    );
  };

  const renderInviteFriend = () => {
    return (
      <View style={{ marginHorizontal: 16 }}>
        <Text
          style={{
            ...CS.hnSemiBold,
            fontSize: 16,
            color: colors.text,
            marginVertical: 16,
          }}
        >
          {translations.task.inviteFriend}
        </Text>
        <View
          style={{
            backgroundColor: colors.backgroundColorGrey,
            borderRadius: 8,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 16,
              paddingHorizontal: 16,
            }}
          >
            <View>
              <Text
                style={{
                  ...CS.hnMedium,
                  fontSize: 12,
                  color: colors.textOpacity6,
                }}
              >
                My code
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    ...CS.hnSemiBold,
                    fontSize: 16,
                    color: colors.btnRedPrimary,
                  }}
                >
                  ACVF1
                </Text>
                <Image
                  style={{ height: 15.3, width: 13.79, marginLeft: 4 }}
                  source={require("assets/images/CopyIcon.png")}
                ></Image>
              </View>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                backgroundColor: colors.btnRedPrimary,
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
              }}
            >
              <IconSvg name="icupLoad" width={32} height={18}></IconSvg>
              <Text
                style={{ ...CS.hnSemiBold, fontSize: 16, color: colors.white }}
              >
                Share
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: colors.grey3,
              marginVertical: 8,
              marginHorizontal: 16,
            }}
          ></View>
          <Text
            style={{
              ...CS.hnRegular,
              fontSize: 14,
              color: colors.textOpacity8,
              paddingHorizontal: 16,
              paddingBottom: 16,
              paddingTop: 8,
            }}
          >
            Got a component with the name renderTabNavigation for the screen
            Home. React Components must start with an uppercase letter. If youre
            pas
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
                style={{
                  borderRadius: 16,
                  backgroundColor: colors.btnRedPrimary,
                  height: 32,
                  width: 32,
                  justifyContent: "center",
                  alignItems: "center",
                  marginHorizontal: 16,
                }}
              >
                <IconSvg name="icupLoad" size={20}></IconSvg>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  marginRight: 16,
                  borderBottomColor: colors.grey3,
                }}
              >
                <Text
                  style={{
                    ...CS.hnSemiBold,
                    fontSize: 16,
                    color: colors.textOpacity8,
                  }}
                >
                  asdasdasdasd
                </Text>
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
      <Header customStyle={{ marginTop: 20 }} text="Profile" />
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
