import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
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
import formatMoney from "@shared-components/input-money/format.money";
import { getListBank, postWithDrawal } from "@services/api/affiliate.api";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { listBanks } from "shared/json/bank";
import eventEmitter from "@services/event-emitter";

interface WithdrawProps {}

const WithdrawScreen: React.FC<WithdrawProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [value, setValue] = React.useState(0);
  const setMyBankAccount = useStore((state) => state.setMyBankAccount);
  const setBankSelected = useStore((state) => state.setBankSelected);
  const bankSelected = useStore((state) => state.bankSelected);

  const userData = useStore((state) => state.userData);
  const maxToken = userData?.current_token || 0;

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
          <Text style={styles.txtBold}>{formatMoney(maxToken)}</Text>
        </View>
      </View>
    );
  };

  const _getListBank = () => {
    const params = {
      limit: "10",
    };
    getListBank(params).then((res) => {
      if (!res.isError) {
        setMyBankAccount(res.data);
        if (res.data[0]) {
          if (!bankSelected) {
            setBankSelected(res.data[0]);
          }
        }
      }
    });
  };

  useEffect(() => {
    _getListBank();
  }, []);

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
    return value < 100000 || value > maxToken;
  }, [value]);

  const cardNumberWithSecurity = () => {
    let text = bankSelected?.bank_number || "";
    if (!text) return;
    const textLength = text.length;
    text = "******" + text.slice(textLength - 4, textLength);
    return text;
  };

  const _pressAddBank = () => {
    NavigationService.navigate(SCREENS.BANK_LIST);
  };

  const renderBanks = () => {
    if (!bankSelected?._id)
      return (
        <View>
          <PressableBtn onPress={_pressAddBank} style={CS.flexStart}>
            <Text style={styles.txtAddBank}>
              {translations.withDraw.add_bank}
            </Text>
            <IconBtn color={palette.red} name="plus" />
          </PressableBtn>
        </View>
      );
    else {
      const bank = listBanks.filter(
        (i) => i.name === bankSelected?.bank_name,
      )[0];
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
                source={{ uri: bank?.logo }}
              />
            </View>
            <View style={styles.wrapText}>
              <Text numberOfLines={1} style={CS.hnSemiBold}>
                {bank?.short_name}
              </Text>
              <Text numberOfLines={1} style={{ ...CS.hnRegular, fontSize: 14 }}>
                {cardNumberWithSecurity()}
              </Text>
            </View>
          </View>
          <IconBtn name={"chevron-right"} color={palette.primary} size={24} />
        </PressableBtn>
      );
    }
  };

  const _pressCashout = () => {
    const data = {
      transaction_value: value.toString(),
      data_payment: "",
      transaction_bank: bankSelected?._id,
    };
    showSuperModal({
      styleModalType: EnumStyleModalType.Middle,
      contentModalType: EnumModalContentType.Loading,
    });
    postWithDrawal(data).then((res) => {
      if (!res.isError) {
        showToast({
          type: "success",
          message: translations.withDraw.withDrawSuccess,
        });
        eventEmitter.emit("refresh_list_affiliate");
        NavigationService.goBack();
      } else {
        showToast({
          type: "error",
          message: translations.withDraw.withDrawFaild,
        });
      }
      closeSuperModal();
    });
  };

  const renderBtn = () => {
    return (
      <PressableBtn
        onPress={_pressCashout}
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

  const _dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={_dismissKeyboard}>
      <SafeAreaView style={CS.safeAreaView}>
        <Header text={translations.withDraw.header} />
        <View style={{ padding: 16, paddingTop: 4, flex: 1 }}>
          {renderYourAmount()}
          {renderInput()}
          {renderBanks()}
          {renderBtn()}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default WithdrawScreen;
