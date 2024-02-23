import React, { useMemo } from "react";
import { View, Text, SafeAreaView, TextInput } from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import uuid from "react-native-uuid";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local Imports
 */
import createStyles from "./withdraw.screen.style";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import { palette } from "@theme/themes";
import CS from "@theme/styles";
import { getNameHolder } from "@services/api/bank.api";
import { debounce } from "lodash";
import useStore from "@services/zustand/store";
import { SCREENS } from "constants";

interface AddBankScreenProps {}

const AddBankScreen: React.FC<AddBankScreenProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [value, setValue] = React.useState(0);
  const [name, setName] = React.useState("");
  const [disabledNameInput, setDisabledNameInput] = React.useState(false);
  const updateMyBankAccounts = useStore((state) => state.updateMyBankAccounts);
  const route = useRoute();
  const bank = route.params?.["bank"];

  // const bank = {
  //   id: 43,
  //   name: "Ngân hàng TMCP Ngoại Thương Việt Nam",
  //   code: "VCB",
  //   bin: "970436",
  //   shortName: "Vietcombank",
  //   logo: "https://api.vietqr.io/img/VCB.png",
  //   transferSupported: 1,
  //   lookupSupported: 1,
  //   short_name: "Vietcombank",
  //   support: 3,
  //   isTransfer: 1,
  //   swift_code: "BFTVVNVX",
  // };

  const _getNameHolder = (e) => {
    getNameHolder({
      bin: bank.bin,
      accountNumber: e,
    }).then((res) => {
      console.log("Resssssss", res);
      if (res?.data?.code == "00") {
        setName(res?.data?.data?.accountName || "");
        setDisabledNameInput(true);
      }
    });
  };

  const onSearchDebounce = React.useCallback(
    debounce(_getNameHolder, 1000),
    [],
  );

  const addBank = () => {
    const data = {
      cardNumber: value,
      cardName: name,
      bank,
      isDefault: true,
      id: uuid.v4(),
    };
    updateMyBankAccounts(data, "add");
    NavigationService.navigate(SCREENS.WITHDRAW);
  };

  const validateNumber = React.useMemo(() => {
    return value.length > 3 && value.length < 15 && !isNaN(Number(value));
  }, [value]);

  const renderInputNumber = () => {
    return (
      <View style={styles.inputBox}>
        <Text style={[styles.txt, { color: colors.textOpacity6 }]}>
          {translations.withDraw.card_number}
        </Text>
        <TextInput
          value={value}
          keyboardType="numeric"
          onChangeText={(e) => {
            setValue(e);
            if (disabledNameInput) setDisabledNameInput(false);
            if (e.length > 3 && e.length < 15) onSearchDebounce(e);
          }}
          placeholder={translations.withDraw.card_number_placeholder}
          style={styles.input}
        />
        {!!value && !validateNumber && (
          <Text style={[styles.txtSmall, { color: colors.red }]}>
            {translations.withDraw.card_number_error}
          </Text>
        )}
      </View>
    );
  };

  const renderInputName = () => {
    return (
      <View style={styles.inputBox}>
        <Text style={[styles.txt, { color: colors.textOpacity6 }]}>
          {translations.withDraw.card_name}
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={[
            styles.input,
            disabledNameInput && {
              backgroundColor: colors.bgInput,
              borderColor: colors.bgInput,
              color: colors.textOpacity4,
            },
          ]}
        />
      </View>
    );
  };

  const renderBtn = () => {
    const activeBtn = validateNumber && name.length;
    return (
      <PressableBtn
        onPress={addBank}
        disabled={!activeBtn}
        style={[
          styles.btn,
          !activeBtn && { backgroundColor: palette.btnInactive },
        ]}
      >
        <Text
          style={[styles.txtBtn, !activeBtn && { color: palette.textOpacity4 }]}
        >
          {translations.continue}
        </Text>
      </PressableBtn>
    );
  };

  const renderBank = () => {
    return (
      <View
        style={{
          ...CS.flexStart,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            ...CS.borderStyle,
            borderRadius: 4,
            marginRight: 12,
            ...CS.flexStart,
          }}
        >
          <FastImage
            resizeMode="contain"
            style={{ width: 40, height: 40 }}
            source={{ uri: bank.logo }}
          />
        </View>
        <Text numberOfLines={1} style={CS.hnSemiBold}>
          {bank?.short_name}
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header text={translations.withDraw.bank_acc} />
      <View style={{ padding: 16, paddingTop: 4, flex: 1 }}>
        {renderBank()}
        {renderInputNumber()}
        {renderInputName()}
        {renderBtn()}
      </View>
    </SafeAreaView>
  );
};

export default AddBankScreen;
