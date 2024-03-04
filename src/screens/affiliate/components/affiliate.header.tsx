import { translations } from "@localization";
import { getUserIncome } from "@services/api/affiliate.api";
import formatMoney from "@shared-components/input-money/format.money";
import { palette } from "@theme/themes";
import React, { memo, useEffect, useMemo, useState } from "react";
import { Text, View, ImageBackground } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import * as NavigationService from "react-navigation-helpers";
import createStyles from "../affiliate.screen.style";
import { useTheme } from "@react-navigation/native";
import TextBase from "@shared-components/TextBase";
import { EnumColors } from "models";
import ItemMonth from "./affiliate.item.month";
import useStore from "@services/zustand/store";
import { formatCoin } from "@helpers/string.helper";
import CS from "@theme/styles";
import { SCREENS } from "constants";
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
const HeaderAffiliate = () => {
  const [userIncome, setUserIncome] = useState<UserIncomeType>();
  const userData = useStore((state) => state.userData);
  console.log("userData...", userData);
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [type, setType] = useState("coin");
  useEffect(() => {
    if (userData?.user_role === "teacher" || userData?.user_role === "admin") {
      setType("token");
    }
  }, [userData?.user_role]);
  const _getUserIncome = () => {
    const paramsRequest = {};
    getUserIncome(paramsRequest).then((res) => {
      if (!res.isError) {
        setUserIncome(res.data);
      }
    });
  };

  const switchToken = () => {
    if (type === "coin") {
      setType("token");
    } else {
      setType("coin");
    }
  };

  useEffect(() => {
    _getUserIncome();
  }, []);
  const renderHeader = () => {
    const _onPressLeft = () => {
      NavigationService.goBack();
    };

    const _onPressWithdraw = () => {
      NavigationService.navigate(SCREENS.WITHDRAW);
    };

    return (
      <ImageBackground
        source={require("../../../assets/images/bgAffiliate.png")}
        style={styles.backgroundHeader}
      >
        <View style={styles.viewHeaderFake}>
          <Icon
            onPress={_onPressLeft}
            name={"chevron-left"}
            type={IconType.Feather}
            size={25}
            color={palette.white}
          />
          <Text numberOfLines={1} style={styles.txtHeader}>
            {translations.affiliate.yourIncome}
          </Text>
          <View style={{ width: 25, ...CS.center }}>
            {userData?.user_role === "teacher" && (
              <Icon
                onPress={switchToken}
                name="swap-horizontal"
                size={24}
                color={palette.white}
                type={IconType.Ionicons}
              />
            )}
          </View>
        </View>
        <TextBase
          fontWeight="600"
          fontSize={24}
          color={EnumColors.white}
          textAlign="center"
        >
          {type === "coin"
            ? formatCoin(userData?.current_coin || 0)
            : formatMoney(userData?.current_token || 0, {
                suffix: " đ",
              })}
        </TextBase>
        {type === "token" && (
          <TextBase
            fontWeight="600"
            color={EnumColors.white}
            textAlign="center"
            style={{
              textDecorationLine: "underline",
            }}
            onPress={_onPressWithdraw}
          >
            {translations.affiliate.withdraw}
          </TextBase>
        )}
      </ImageBackground>
    );
  };

  const renderViewTotalAffiliate = () => {
    return (
      <View style={styles.styleViewTotalAff}>
        <View style={styles.styleTotalToday}>
          <ImageBackground
            source={require("../../../assets/images/bgIHCAffiliate.png")}
            resizeMode="cover"
            imageStyle={{ borderRadius: 8 }}
            style={styles.styleImageBg2}
          >
            <Text style={styles.txtToday}>{translations.affiliate.today}</Text>
            <Text style={styles.txtCommissionToday}>
              {type === "coin"
                ? formatCoin(userIncome?.today?.total_coin || 0)
                : formatMoney(userIncome?.today?.total_token, {
                    suffix: " đ",
                  })}
            </Text>
          </ImageBackground>
        </View>
        <View style={styles.styleViewLine}>
          <ItemMonth
            text={translations.affiliate.thisMonth}
            price={
              type === "coin"
                ? formatCoin(userIncome?.current_month?.total_coin || 0)
                : formatMoney(userIncome?.current_month?.total_token, {
                    suffix: " đ",
                  })
            }
          />
          <ItemMonth
            text={translations.affiliate.lastMonth}
            price={
              type === "coin"
                ? formatCoin(userIncome?.last_month?.total_coin || 0)
                : formatMoney(userIncome?.last_month?.total_token, {
                    suffix: " đ",
                  })
            }
          />
        </View>
      </View>
    );
  };
  return (
    <View>
      {renderHeader()}
      {renderViewTotalAffiliate()}
    </View>
  );
};

export default memo(HeaderAffiliate);
