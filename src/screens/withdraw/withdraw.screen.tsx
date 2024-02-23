import React, { useMemo } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useTheme } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local Imports
 */
import createStyles from "./withdraw.screen.style";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import Logo from "@shared-components/Logo";
import PressableBtn from "@shared-components/button/PressableBtn";
import { FakeCurrencyInput } from "react-native-currency-input";
import { palette } from "@theme/themes";
import IconBtn from "@shared-components/button/IconBtn";
import CS from "@theme/styles";
import useStore from "@services/zustand/store";
import { SCREENS } from "constants";

interface WithdrawProps {}

const WithdrawScreen: React.FC<WithdrawProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [value, setValue] = React.useState(0);
  const myBankAccounts = useStore((state) => state.myBankAccounts);
  const defaultBankAccount = myBankAccounts.find((item) => item.isDefault);

  const openListBank = () => {
    NavigationService.navigate(SCREENS.BANK_LIST);
  };

  const renderYourAmount = () => {
    return (
      <View style={styles.yourAmountBox}>
        <Logo style={{ width: 48, height: 48, marginRight: 12 }} />
        <View>
          <Text style={styles.txtSmall}>
            {translations.withDraw.your_money}
          </Text>
          <Text style={styles.txtBold}>200.000đ</Text>
        </View>
      </View>
    );
  };
  console.log("value", value);
  const renderInput = () => {
    return (
      <View style={styles.inputBox}>
        <Text style={styles.txt}>{translations.withDraw.withdraw_amount}</Text>
        <FakeCurrencyInput
          value={value}
          onChangeValue={setValue}
          delimiter=","
          separator="."
          precision={0}
          placeholderTextColor={palette.red}
          style={{
            color: value == 0 ? palette.textOpacity4 : palette.text,
          }}
          containerStyle={styles.input}
        />
        <Text style={styles.txtSmall}>
          {translations.withDraw.min_withdraw_des}
        </Text>
      </View>
    );
  };

  const disabledBtn = React.useMemo(() => {
    return value < 100000;
  }, [value]);

  const cardNumberWithSecurity = () => {
    let text = defaultBankAccount.cardNumber || "";
    if (!text) return;
    const textLength = text.length;
    text = "******" + text.slice(textLength - 4, textLength);
    return text;
  };

  const renderBanks = () => {
    if (!defaultBankAccount?.cardNumber)
      return (
        <View>
          <PressableBtn style={CS.flexStart}>
            <Text style={styles.txtAddBank}>
              {translations.withDraw.add_bank}
            </Text>
            <IconBtn color={palette.red} name="plus" />
          </PressableBtn>
        </View>
      );
    return (
      <PressableBtn onPress={openListBank} style={CS.flexRear}>
        <View style={CS.flexStart}>
          <View
            style={{
              ...CS.borderStyle,
              borderRadius: 4,
              marginRight: 12,
            }}
          >
            <FastImage
              resizeMode="contain"
              style={{ width: 48, height: 48 }}
              source={{ uri: defaultBankAccount.bank.logo }}
            />
          </View>
          <View style={styles.wrapText}>
            <Text numberOfLines={1} style={CS.hnSemiBold}>
              {defaultBankAccount.bank?.short_name}
            </Text>
            <Text numberOfLines={1} style={{ ...CS.hnRegular, fontSize: 14 }}>
              {cardNumberWithSecurity()}
            </Text>
          </View>
        </View>
        <IconBtn name={"chevron-right"} color={palette.primary} size={24} />
      </PressableBtn>
    );
  };

  const renderBtn = () => {
    return (
      <PressableBtn
        disabled={disabledBtn}
        style={[
          styles.btn,
          disabledBtn && { backgroundColor: palette.btnInactive },
        ]}
      >
        <Text
          style={[
            styles.txtBtn,
            disabledBtn && { color: palette.textOpacity4 },
          ]}
        >
          {translations.withDraw.header}
        </Text>
      </PressableBtn>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header text={translations.withDraw.header} />
      <View style={{ padding: 16, paddingTop: 4, flex: 1 }}>
        {renderYourAmount()}
        {renderInput()}
        {renderBanks()}
        {renderBtn()}
      </View>
    </SafeAreaView>
  );
};

export default WithdrawScreen;
