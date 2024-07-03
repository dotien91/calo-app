import { translations } from "@localization";
import formatMoney from "@shared-components/input-money/format.money";
import { palette } from "@theme/themes";
import React, { memo, useMemo } from "react";
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
import { Device } from "@utils/device.ui.utils";

const HeaderAffiliate = ({ fromHomepage }: { fromHomepage: boolean }) => {
  const userData = useStore((state) => state.userData);
  const type = useStore((state) => state.type);
  const setType = useStore((state) => state.setType);
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

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

  const isSwitch = true;
  // userData?.user_role === "teacher" || userData?.user_role === "admin";

  return (
    <View style={CS.center}>
      <ImageBackground
        source={require("../../../assets/images/bgaffiliate.png")}
        style={[
          styles.backgroundHeader,
          fromHomepage && {
            width: Device.width - 32,
            borderRadius: 12,
            overflow: "hidden",
            height: 110,
          },
        ]}
      >
        <View
          style={[
            styles.viewHeaderFake,
            fromHomepage && {
              marginTop: 0,
            },
          ]}
        >
          {!fromHomepage && (
            <Icon
              onPress={_onPressLeft}
              name={"chevron-left"}
              type={IconType.Feather}
              size={25}
              color={palette.white}
            />
          )}
          <Text numberOfLines={1} style={styles.txtHeader}>
            {translations.affiliate.currentlyAvailable}
          </Text>
          <View style={{ width: 25, ...CS.center }}>
            {isSwitch && (
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
            style={[
              styles.txtMoneyHeader,
              fromHomepage && {
                marginTop: 0,
                marginBottom: 0,
              },
            ]}
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
    </View>
  );
};

export default memo(HeaderAffiliate);
