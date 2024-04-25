import { Dimensions, StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";
import { getBottomSpace } from "react-native-iphone-screen-helper";

import CommonStyle from "@theme/styles";
import { Device } from "@utils/device.ui.utils";
import { palette } from "@theme/themes";
import { ScreenHeight, isIOS } from "@freakycoder/react-native-helpers";

const { width } = Dimensions.get("screen");
const SIZE_AVATAR = 58;
const BORDER_AVATAR = 100;
const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      ...CommonStyle.safeAreaView,
      backgroundColor: colors.background,
      marginBottom: getBottomSpace(),
      paddingBottom: 10,
    },
    textHeader: {
      ...CommonStyle.hnSemiBold,
      fontSize: 32,
      color: colors.mainColor2,
      textAlign: "center",
    },
    buttonMarginGG: {
      marginTop: 30,
      paddingHorizontal: 20,
    },
    buttonMargin: {
      marginTop: 16,
      paddingHorizontal: 20,
    },
    viewImage: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      paddingHorizontal: 14,
      marginTop: 10,
    },
    viewFile: {
      width: (Device.width - 32 - 30) / 4,
      height: (Device.width - 32 - 30) / 4,
    },
    inputDescription: {
      ...CommonStyle.hnRegular,
      ...CommonStyle.flex1,
      textAlignVertical: "top",
      paddingHorizontal: 20,
      fontSize: 16,
      width: "100%",
      color: colors.textInput,
    },
    viewContainerLink: {
      flexDirection: "row",
      backgroundColor: colors.background2,
      height: 40,
      alignItems: "center",
      marginHorizontal: 20,
      borderRadius: 20,
    },
    viewIconLink: {
      backgroundColor: colors.borderColor,
      width: 50,
      height: 40,
      ...CommonStyle.center,
      borderRadius: 20,
    },
    textLink: {
      ...CommonStyle.hnLight,
      ...CommonStyle.flex1,
      paddingHorizontal: 16,
      fontSize: 16,
      color: colors.mainColor2,
    },
    category: {
      marginTop: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor: colors.background,
    },
    categorySelected: {
      marginTop: 10,
      padding: 10,
      borderRadius: 10,
      // backgroundColor: colors.highlight,
    },
    containerPostDetail: {
      ...CommonStyle.safeAreaView,
      backgroundColor: colors.background2,
    },
    viewCommentPostDetail: {
      alignItems: "center",
      gap: 10,
      flexDirection: "row",
      maxHeight: 120,
      minHeight: 40,
      marginVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.borderColor,
      paddingHorizontal: 16,
      flex: 1,
    },
    buttonFlagPostDetail: {
      height: 25,
      marginTop: 20,
      flexDirection: "row",
      color: colors.highlight,
      alignItems: "center",
    },
    textButtonPostDetail: {
      ...CommonStyle.hnRegular,
      fontSize: 16,
      color: colors.text,
      paddingLeft: 18,
    },
    viewInput: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.borderColor,
      marginHorizontal: 16,
      height: 40,
      justifyContent: "center",
      paddingHorizontal: 16,
    },
    viewButton: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginHorizontal: 16,
      marginTop: 8,
      gap: 8,
    },
    btnCancel: {
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: colors.background2,
      padding: 8,
    },
    txtCancel: {
      color: colors.mainColor2,
    },
    btnUpdateDisable: {
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: colors.mainColor2,
      padding: 8,
    },
    btnUpdate: {
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: colors.primary,
      padding: 8,
    },
    styleCardName: {
      height: 72,
      ...CommonStyle.row,
      alignSelf: "flex-start",
      marginHorizontal: 20,
      gap: 12,
    },
    viewName: {
      gap: 8,
      justifyContent: "space-around",
      width: "80%",
    },
    txtName: {
      ...CommonStyle.hnBold,
      lineHeight: 20,
      color: palette.mainColor2,
    },
    txtDes: {
      ...CommonStyle.textRate,
    },
    btnAction: {
      ...CommonStyle.center,
      height: 32,
      alignSelf: "flex-start",
      backgroundColor: colors.grey,
      borderRadius: 4,
    },
    btnAdd: {
      ...CommonStyle.center,
      // height: 72,
      // width: 72,
      width: (width - 34 - 30) / 4,
      height: (width - 34 - 30) / 4,
      backgroundColor: colors.grey,
      borderRadius: 8,
    },
    viewRenderFile: {
      ...CommonStyle.flexStart,
      paddingBottom: 20,
    },
    border: {
      width: 20,
      height: 20,
      borderRadius: 12,
      borderWidth: 2,
      ...CommonStyle.center,
      borderColor: colors.primary,
    },
    selected: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    txtLabel: {
      ...CommonStyle.hnRegular,
      flex: 1,
      color: colors.textOpacity8,
    },
    viewBtn: {
      ...CommonStyle.row,
      height: 40,
      gap: 10,
    },
    btnKey: {
      height: 100,
      borderTopWidth: 0.5,
      alignItems: "center",
      borderColor: "gray",
    },
    selectKey: {
      flexDirection: "row",
    },
    styleViewKeyboard: {
      ...CommonStyle.flexStart,
      borderTopWidth: 0.5,
      alignItems: "center",
      borderColor: palette.borderColor1,
      marginBottom: isIOS ? getBottomSpace() + 30 : 0,
      height: 40,
    },
    styleAvatar: {
      width: SIZE_AVATAR,
      height: SIZE_AVATAR,
      borderRadius: BORDER_AVATAR,
    },
    stylePressableBtn: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    stylePressableBtn1: {
      flexDirection: "row",
      height: 56,
      gap: 8,
    },
    styleTxtPressable: {
      // paddingTop: 8,
      width: "80%",
      borderBottomWidth: 1,
      justifyContent: "center",
      borderColor: palette.grey1,
    },
    viewComment: {
      flexDirection: "row",
      paddingHorizontal: 8,
      gap: 8,
      alignItems: "flex-end",
    },
    inputComment: {
      ...CommonStyle.flex1,
      ...CommonStyle.hnRegular,
      justifyContent: "center",
      paddingVertical: 0,
      color: colors.text,
      height: 33,
    },
    viewReply: {
      paddingHorizontal: 20,
      backgroundColor: colors.background,
      alignItems: "center",
      flexDirection: "row",
      gap: 10,
    },
    viewEmpty: {
      ...CommonStyle.center,
      ...CommonStyle.flex1,
      backgroundColor: colors.background,
      paddingVertical: 40,
      minHeight: 100,
    },
    headerPost: {
      height: 50,
      alignItems: "center",
      paddingHorizontal: 20,
      flexDirection: "row",
      backgroundColor: colors.background,
      shadowColor: "rgba(0,0,0,0.8)",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      elevation: 10,
      shadowRadius: 1,
      marginBottom: 4,
    },
    txtHeader: {
      ...CommonStyle.hnSemiBold,
      fontSize: 16,
      left: 16,
      color: colors.text,
      flex: 1,
      textAlign: "center",
      paddingRight: 48,
    },
    viewFlatList: {
      minHeight: (ScreenHeight * 3) / 5,
    },
  });
};
export default createStyles;
