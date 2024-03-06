import { translations } from "@localization";
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
import useStore from "@services/zustand/store";
import { formatCoin } from "@helpers/string.helper";
import CS from "@theme/styles";
import { SCREENS } from "constants";

const HeaderAffiliate = () => {
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

  const switchToken = () => {
    if (type === "coin") {
      setType("token");
    } else {
      setType("coin");
    }
  };

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
      <View>
        <TextBase
          fontWeight="600"
          fontSize={24}
          color={EnumColors.white}
          textAlign="center"
          style={styles.txtMoneyHeader}
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
      </View>
    </ImageBackground>
  );
};

export default memo(HeaderAffiliate);
