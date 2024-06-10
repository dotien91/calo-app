import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import createStyle from "./ikiCoachTeacher.screen.style";
import useStore from "@services/zustand/store";
import TextBase from "@shared-components/TextBase";
import IconBtn from "@shared-components/button/IconBtn";
import { IconType } from "react-native-dynamic-vector-icons";
import { EnumColors } from "models";
import { formatCoin } from "@helpers/string.helper";
import formatMoney from "@shared-components/input-money/format.money";
import { translations } from "@localization";
import ItemMonth from "../affiliate/components/affiliate.item.month";
import { getUserIncome } from "@services/api/affiliate.api";
import Avatar from "@shared-components/user/Avatar";
import { Tasks } from "./profile.screen";
import { itemType, utilities } from "constants/coachTeacher.constant";
import IconSvg from "assets/svg";
import LinearGradient from "react-native-linear-gradient";
import * as NavigationService from "react-navigation-helpers";
import CS from "@theme/styles";

interface ItemIncomeType {
  count: number;
  total_coin: number;
  total_token: number;
}
interface UserIncomeType {
  current_month?: ItemIncomeType;
  current_week?: ItemIncomeType;
  last_month?: ItemIncomeType;
  today?: ItemIncomeType;
  yesterday?: ItemIncomeType;
}
const TeacherScreen = () => {
  const [userIncome, setUserIncome] = React.useState<UserIncomeType>();
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyle(theme), [theme]);
  const userData = useStore((state) => state.userData);
  const type = useStore((state) => state.type);
  const userMedia = useStore((state) => state.userMedia);
  const setType = useStore((state) => state.setType);

  const _getUserIncome = () => {
    const paramsRequest = {};
    getUserIncome(paramsRequest).then((res) => {
      if (!res.isError) {
        setUserIncome(res.data);
      }
    });
  };

  React.useEffect(() => {
    _getUserIncome();
    setType("token");
  }, []);
  const HeaderStatistical = () => {
    return (
      <View style={styles.styleViewTotalAff}>
        <View style={styles.styleTotalToday}>
          <View style={styles.bgStatistical}>
            <Text style={styles.txtToday}>{translations.affiliate.today}</Text>
            <Text style={styles.txtCommissionToday}>
              {type === "coin"
                ? formatCoin(userIncome?.today?.total_coin || 0)
                : formatMoney(userIncome?.today?.total_token, {
                    suffix: " IHC",
                  })}
            </Text>
            <IconSvg
              name="icMoney2"
              size={40}
              style={{
                position: "absolute",
                bottom: 30,
                right: 16,
              }}
            />
          </View>
        </View>
        <View style={styles.styleViewLine}>
          <ItemMonth
            style={{
              view: {
                backgroundColor: colors.greenTh2,
                width: 166,
                height: 72,
              },
              textMonth: {
                ...CS.hnBold,
                color: colors.grey,
                fontSize: 12,
              },
              textCommissionMonth: {
                color: colors.white,
                marginTop: 10,
              },
            }}
            text={translations.affiliate.thisMonth}
            price={
              type === "coin"
                ? formatCoin(userIncome?.current_month?.total_coin || 0)
                : formatMoney(userIncome?.current_month?.total_token, {
                    suffix: " IHC",
                  })
            }
            color={colors.white}
          />
          <ItemMonth
            style={{
              view: {
                backgroundColor: colors.greenTh2,
                width: 166,
                height: 72,
              },
              textMonth: {
                ...CS.hnBold,
                color: colors.grey,
                fontSize: 12,
              },
              textCommissionMonth: {
                color: colors.white,
                marginTop: 10,
              },
            }}
            text={translations.affiliate.lastMonth}
            price={
              type === "coin"
                ? formatCoin(userIncome?.last_month?.total_coin || 0)
                : formatMoney(userIncome?.last_month?.total_token, {
                    suffix: " IHC",
                  })
            }
            color={colors.white}
          />
        </View>
      </View>
    );
  };

  const HeaderTeacherScreen = () => {
    return (
      <LinearGradient
        colors={[colors.greenTh3, colors.greenTh1]}
        style={styles.viewHeaderContainer}
      >
        <TouchableOpacity
          onPress={NavigationService.goBack}
          style={styles.viewHeader}
        >
          <IconBtn
            name={"chevron-left"}
            type={IconType.Feather}
            size={26}
            color={colors.white}
            customStyle={{
              position: "absolute",
              left: 5,
              top: 0,
            }}
          />
          <TextBase fontSize={15} color="white" style={{ marginTop: 5 }}>
            Ikigai Coach Teacher
          </TextBase>
        </TouchableOpacity>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Text numberOfLines={1} style={styles.textHeader}>
            {translations.profileTeacher.balance}
          </Text>
          <TextBase
            fontWeight="600"
            fontSize={30}
            color={EnumColors.white}
            textAlign="center"
            style={styles.textMoneyHeader}
          >
            {formatMoney(userData?.current_token || 0, {
              suffix: " VND",
            })}
          </TextBase>
        </View>
        {HeaderStatistical()}
      </LinearGradient>
    );
  };

  const renderAvatar = () => {
    return (
      <View style={styles.viewAvatar}>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Avatar
            style={{
              width: 50,
              height: 50,
              borderRadius: 24,
            }}
            sourceUri={{
              uri: userMedia?.user_avatar,
            }}
            resizeMode={"cover"}
          />
          <Text style={styles.textDisplayName}>{userData?.display_name}</Text>
        </View>
        <TouchableOpacity style={styles.viewProfileBtn}>
          <Text
            style={{
              ...CS.hnBold,
              color: colors.white,
              fontSize: 14,
            }}
          >
            {translations.profileTeacher.profile}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderIcon = (items) => {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            onPress={item.onPress}
            key={index}
            style={{
              width: 75,
              marginLeft: 15,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Image
                source={item.uri}
                style={{
                  height: 60,
                  width: 60,
                }}
              />
              <TextBase fontWeight="400" textAlign="center" fontSize={14}>
                {item.title}
              </TextBase>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderUtilities = (item: itemType, index: number) => {
    return (
      <View key={index} style={{ marginBottom: 20 }}>
        <TextBase style={{ marginLeft: 15, marginTop: 5 }} fontWeight="700">
          {item.textTitle}
        </TextBase>
        {renderIcon(item.content)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderTeacherScreen />
        {renderAvatar()}
        <Tasks numberOfTasks={2} />
        {utilities.map((item, index) => renderUtilities(item, index))}
      </ScrollView>
    </View>
  );
};

export default TeacherScreen;
