import React from "react";
import { Text, StyleSheet, View, Image, ScrollView } from "react-native";
import CS from "@theme/styles";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import PressableBtn from "@shared-components/button/PressableBtn";

const IconText = ({ nameIcon, text }: { nameIcon: string; text: string }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconSvg name={nameIcon} size={14} color={palette.textOpacity6} />
      <Text style={[styles.txtBodyContent, { marginLeft: 4 }]}>{text}</Text>
    </View>
  );
};

const renderListCourse = () => {
  return (
    <View style={styles.viewCourse}>
      <View style={styles.viewCard}>
        <View style={styles.viewImage}>
          <Image
            // source={{ uri: media_thumbnail }}
            style={{
              width: 80,
              height: 80,
            }}
            resizeMode={"cover"}
          />
        </View>
        <View style={styles.viewDescription}>
          <Text numberOfLines={1} style={styles.viewTitleName}>
            {translations.titleName}
          </Text>
          <View style={styles.viewRate}>
            <View style={styles.viewStyleView}>
              <Text style={styles.viewTxt}>{translations.best}</Text>
            </View>
            <View style={styles.viewStyleRate}>
              <IconText nameIcon="icStarFull" text={translations.ratings} />
            </View>
          </View>
          <View style={styles.viewStylePrice}>
            <View style={styles.viewPrice}>
              <Text style={styles.txtPriceNew}>{translations.priceNew}</Text>
              <Text style={styles.txtPriceOld}>{translations.priceOld}</Text>
            </View>
            {/* <Button style={styles.viewBtnBuy} text={translations.buy} /> */}
            <PressableBtn onPress={() => {}} style={styles.viewBtnBuy}>
              <Text style={styles.txtBtn}>{translations.buy}</Text>
            </PressableBtn>
          </View>
        </View>
      </View>
    </View>
  );
};

const ListCourseLiveStream = () => {
  return (
    <View style={styles.viewStyleModal}>
      <Text style={styles.headerTitlte}>{translations.nameTutor}</Text>
      <ScrollView>{renderListCourse()}</ScrollView>
    </View>
  );
};

export const styles = StyleSheet.create({
  viewStyleModal: {
    flex: 1,
    paddingTop: 42,
    marginHorizontal: 8,
    gap: 10,
  },
  headerTitlte: { ...CS.hnBold, marginHorizontal: 16 },
  viewCourse: {
    marginHorizontal: 8,
  },
  viewCard: {
    ...CS.row,
    padding: 8,
    gap: 12,
  },
  viewImage: {
    ...CS.center,
    backgroundColor: palette.red,
  },
  viewDescription: {
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  viewTitleName: {
    ...CS.hnMedium,
    width: "100%",
    // height: 32,
  },
  viewRate: {
    ...CS.row,
    height: 24,
    gap: 8,
  },
  viewStyleView: {
    ...CS.center,
    backgroundColor: palette.bgBestSeller,
    width: 74,
    height: 22,
    borderRadius: 4,
  },
  viewStyleRate: {
    ...CS.center,
  },
  viewTxt: {
    ...CS.textOpacity4,
  },
  txtBodyContent: {
    ...CS.textRate,
  },
  viewStylePrice: {
    ...CS.row,
    justifyContent: "space-between",
    height: 28,
    gap: 8,
  },
  viewPrice: {
    ...CS.row,
    gap: 4,
  },
  txtPriceNew: {
    ...CS.txtPriceNew,
  },
  txtPriceOld: {
    ...CS.txtPriceOld,
    textDecorationLine: "line-through",
    paddingTop: 4,
  },
  viewBtnBuy: {
    ...CS.center,
    width: 60,
    height: 24,
    backgroundColor: palette.primary,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 4,
  },
  txtBtn: {
    ...CS.textBuy,
  },
});

export default ListCourseLiveStream;
