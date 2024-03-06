import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import FastImage from "react-native-fast-image";

/**
 * ? Local Imports
 */
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import { SCREENS } from "constants";
import { closeSuperModal } from "@helpers/super.modal.helper";
import { listBanks } from "shared/json/bank";
import PressableBtn from "@shared-components/button/PressableBtn";
import SearchInput from "@shared-components/search-input.tsx/search.input";
import IconBtn from "@shared-components/button/IconBtn";
import { Device } from "@utils/device.ui.utils";
// import useStore from "@services/zustand/store";

const ListBank = () => {
  const [txtSearch, setTxtSearch] = React.useState("");
  // const myBankAccounts = useStore((state) => state.myBankAccounts);

  const _onPress = (item) => {
    closeSuperModal();
    NavigationService.navigate(SCREENS.ADD_BANK, {
      bank: item,
    });
  };

  const dataWithFilter = React.useMemo(() => {
    return listBanks.filter((item) =>
      item.shortName.toLowerCase().includes(txtSearch.toLowerCase()),
    );
  }, [txtSearch]);

  const renderItem = ({ item }) => {
    console.log("itemitemitem", item);
    return (
      <PressableBtn onPress={() => _onPress(item)} style={styles.item}>
        <View
          style={{
            ...CS.borderStyle,
            borderRadius: 4,
            marginRight: 12,
          }}
        >
          <FastImage
            resizeMode="contain"
            style={{ width: 40, height: 40 }}
            source={{ uri: item.logo }}
          />
        </View>
        <View style={styles.wrapText}>
          <Text numberOfLines={1} style={CS.hnSemiBold}>
            {item?.short_name}
          </Text>
          <IconBtn
            name={"chevron-right"}
            color={palette.textOpacity4}
            size={24}
          />
        </View>
      </PressableBtn>
    );
  };
  console.log("listBankslistBanks", listBanks);
  return (
    <View style={styles.box}>
      <Text style={styles.headerTitlte}>
        {translations.withDraw.choose_bank}
      </Text>

      <SearchInput
        showCancelBtn={false}
        placeholder={translations.withDraw.search_bank}
        autoFocus={false}
        setTxtSearch={setTxtSearch}
        customStyle={{
          paddingHorizontal: 0,
          paddingBottom: 8,
          ...CS.borderBottomStyle,
        }}
      />
      <FlatList
        style={{ marginTop: 8, maxHeight: Device.height * 0.5 }}
        data={dataWithFilter}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={8}
        keyExtractor={(item) => item.code}
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  item: {
    ...CS.flexStart,
    borderColor: palette.grey2,
    marginBottom: 8,
    flex: 1,
  },
  box: {
    paddingBottom: 16,
  },
  headerTitlte: {
    ...CS.hnSemiBold,
    fontSize: 20,
    flex: 1,
    textAlign: "center",
    marginBottom: 14,
    marginTop: 12,
  },
  wrapText: {
    ...CS.borderBottomStyle,
    paddingVertical: 8,
    flex: 1,
    ...CS.flexRear,
  },
});

export default ListBank;
