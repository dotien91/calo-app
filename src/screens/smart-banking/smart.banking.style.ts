import CS from "@theme/styles";
import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

interface Style {
  styleTextToComplete: TextStyle;
  styleTextNumberBank: TextStyle;
  styleTextName: TextStyle;
  styleTextNameBank: TextStyle;
  styleTextSaveQRcode: TextStyle;
  styleTextHadPaid: TextStyle;
  styleTextSendProvement: TextStyle;
  styleTextSend: TextStyle;
  styleViewCopyNumberBank: ViewStyle;
  styleViewImageSelected: ViewStyle;
  styleBtnUploadFile: ViewStyle;
  styleBtnSend: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    styleTextToComplete: {
      ...CS.hnRegular,
      textAlign: "center",
      fontSize: 16,
      color: colors.textOpacity8,
      marginVertical: 4,
    },
    styleTextNumberBank: {
      ...CS.hnSemiBold,
      fontSize: 20,
      color: colors.btnRedPrimary,
      marginRight: 8,
    },
    styleTextName: {
      ...CS.hnRegular,
      fontSize: 16,
      color: colors.textOpacity6,
      marginBottom: 4,
    },
    styleTextNameBank: {
      ...CS.hnRegular,
      textAlign: "center",
      fontSize: 16,
      color: colors.textOpacity8,
      marginBottom: 16,
    },
    styleTextSaveQRcode: {
      ...CS.hnMedium,
      textAlign: "right",
      fontSize: 16,
      color: colors.textOpacity8,
    },
    styleTextHadPaid: {
      ...CS.hnSemiBold,
      fontSize: 16,
      color: colors.btnRedPrimary,
    },
    styleTextSendProvement: {
      ...CS.hnMedium,
      fontSize: 16,
      color: colors.textOpacity8,
      marginBottom: 6,
    },
    styleViewCopyNumberBank: {
      ...CS.row,
      marginBottom: 4,
    },
    styleViewImageSelected: {
      ...CS.row,
      paddingHorizontal: 16,
      paddingVertical: 9,
      backgroundColor: colors.grey2,
      borderRadius: 8,
      marginBottom: 8,
    },
    styleBtnUploadFile: {
      ...CS.row,
      backgroundColor: colors.white,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.btnRedPrimary,
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderStyle: "dashed",
    },
    styleBtnSend: {
      backgroundColor: colors.btnRedPrimary,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 9,
    },
    styleTextSend: { fontSize: 16, fontWeight: "600", color: colors.white },
  });
};
