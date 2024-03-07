import { translations } from "@localization";
import { getUserIncome } from "@services/api/affiliate.api";
import formatMoney from "@shared-components/input-money/format.money";
import React, { memo, useEffect, useMemo, useState } from "react";
import { Text, View, ImageBackground } from "react-native";
import createStyles from "../affiliate.screen.style";
import { useTheme } from "@react-navigation/native";
import ItemMonth from "./affiliate.item.month";
import useStore from "@services/zustand/store";
import { formatCoin } from "@helpers/string.helper";

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
const AffiliateStatisticalView = () => {
  const [userIncome, setUserIncome] = useState<UserIncomeType>();
  const userData = useStore((state) => state.userData);
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

  useEffect(() => {
    _getUserIncome();
  }, []);

  return (
    <View style={styles.styleViewTotalAff}>
      <View style={styles.styleTotalToday}>
        <ImageBackground
          source={require("../../../assets/images/bgihcaffiliate.png")}
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

export default memo(AffiliateStatisticalView);
