import React, { useMemo } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local Imports
 */
import createStyles from "./withdraw.screen.style";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import IconBtn from "@shared-components/button/IconBtn";
import CS from "@theme/styles";
import { listBanks } from "shared/json/bank";
import FastImage from "react-native-fast-image";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import useStore from "@services/zustand/store";
import { SCREENS } from "constants";
import { deleteBank } from "@services/api/affiliate.api";

interface BankListProps {}

const banks = listBanks.slice(0, 7);

const BankListScreen: React.FC<BankListProps> = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const myBankAccounts = useStore((state) => state.myBankAccounts);
  const bankSelected = useStore((state) => state.bankSelected);
  const setBankSelected = useStore((state) => state.setBankSelected);
  const updateMyBankAccounts = useStore((state) => state.updateMyBankAccounts);

  const openAddBankScreen = (item) => {
    NavigationService.navigate(SCREENS.ADD_BANK, {
      bank: item,
    });
  };

  const goBankSearch = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.SearchBank,
      styleModalType: EnumStyleModalType.Bottom,
    });
  };

  const renderAddBankBox = () => {
    return (
      <View style={styles.addBankBox}>
        <PressableBtn
          style={{ ...CS.flexStart, marginBottom: 8 }}
          onPress={goBankSearch}
        >
          <IconBtn
            name="plus-circle"
            color={colors.textOpacity8}
            customStyle={{ marginRight: 3 }}
          />
          <Text style={{ ...CS.hnSemiBold, color: colors.textOpacity8 }}>
            {translations.withDraw.add_bank}
          </Text>
        </PressableBtn>
        <View style={{ ...CS.flexStart, flexWrap: "wrap" }}>
          {banks.map((item, index) => (
            <PressableBtn
              style={[
                styles.wrapImage,
                (index + 1) % 4 == 0 ? { marginRight: 0 } : {},
              ]}
              key={item.code}
              onPress={() => openAddBankScreen(item)}
            >
              <FastImage
                resizeMode="contain"
                style={styles.image}
                source={{ uri: item?.logo }}
              />
            </PressableBtn>
          ))}
          <PressableBtn
            style={[styles.wrapImage, { marginRight: 0 }]}
            onPress={goBankSearch}
          >
            <View style={CS.center}>
              <IconBtn
                size={24}
                name="home"
                color={colors.textOpacity8}
                customStyle={{ marginRight: 3, marginBottom: 4 }}
              />
              <Text style={{ ...CS.hnRegular }}>{translations.other}</Text>
            </View>
          </PressableBtn>
        </View>
      </View>
    );
  };

  const cardNumberWithSecurity = (item) => {
    let text = item.bank_number || "";
    if (!text) return;
    const textLength = text.length;
    text = "******" + text.slice(textLength - 4, textLength);
    return text;
  };

  const ItemBank = ({ item }) => {
    const isActive = bankSelected?._id == item._id;
    const bank = listBanks.filter((i) => i.name === item?.bank_name)[0];
    const onSelectBank = () => {
      setBankSelected(item);
      NavigationService.navigate(SCREENS.WITHDRAW);
    };
    const _deleteBank = () => {
      updateMyBankAccounts(item, "delete");
      if (isActive) {
        setBankSelected();
      }
      deleteBank(item._id);
    };
    return (
      <PressableBtn
        key={item.id}
        onPress={() => onSelectBank(item)}
        style={[CS.flexRear, { marginBottom: 8 }]}
      >
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
            <IconBtn
              onPress={_deleteBank}
              customStyle={styles.closeIcon}
              color={colors.red}
              name="x-circle"
            />
          </View>
          <View style={styles.wrapText}>
            <Text numberOfLines={1} style={CS.hnSemiBold}>
              {bank?.short_name}
            </Text>
            <Text numberOfLines={1} style={{ ...CS.hnRegular, fontSize: 14 }}>
              {cardNumberWithSecurity(item)}
            </Text>
          </View>
        </View>
        <View style={styles.circle}>
          {isActive && <View style={styles.dot}></View>}
        </View>
      </PressableBtn>
    );
  };

  const renderBanks = () => {
    return (
      <View style={{ marginBottom: 16 }}>
        {myBankAccounts.map((item) => {
          return <ItemBank key={item._id} item={item} />;
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.withDraw.bank_title} />
      <View style={{ padding: 16, paddingTop: 4, flex: 1 }}>
        {renderBanks()}
        {renderAddBankBox()}
      </View>
    </SafeAreaView>
  );
};

export default BankListScreen;
