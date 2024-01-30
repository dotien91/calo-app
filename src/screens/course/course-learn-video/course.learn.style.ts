import { StyleSheet } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";

import { Device } from "@utils/device.utils";
import { HS, MHS, VS } from "@utils/size.utils";

const createStyles = (theme: ExtendedTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    styleVideo: {
      width: "100%",
      backgroundColor: "#000000",
      justifyContent: "center",
      alignItems: "center",
    },
    floatButton: {
      width: MHS._50,
      height: MHS._50,
      borderRadius: MHS._50,
      backgroundColor: theme.btnActive,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      bottom: Device.paddingBottom,
      right: HS._16,
      zIndex: 100,
    },
    textTitle: {
      paddingHorizontal: HS._16,
      marginVertical: VS._6,
    },
    item: {
      marginTop: VS._10,
      borderBottomWidth: 1,
      borderBottomColor: theme.btnLightSmoke,
      paddingBottom: VS._20,
    },
    viewAddModule: {
      flexDirection: "row",
      alignItems: "center",
      gap: HS._6,
      marginTop: VS._6,
      paddingHorizontal: HS._10,
    },
    viewEmpty: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: VS._100,
      width: "100%",
    },
    iconEmpty: {
      width: MHS._66,
      height: MHS._66,
      borderRadius: MHS._66,
      backgroundColor: theme.btnActive,
      justifyContent: "center",
      alignItems: "center",
    },
    textTitleEmpty: {
      textAlign: "center",
      marginVertical: VS._16,
      marginHorizontal: HS._32,
    },
    styleModule: {
      paddingHorizontal: HS._10,
      paddingVertical: VS._6,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    buttonBack: {
      position: "absolute",
      top: Device.heightStatusBar + VS._10,
      backgroundColor: `${theme.backgroundTextInput}40`,
      left: HS._16,
      padding: VS._6,
      borderRadius: MHS._16,
      zIndex: 100,
      transform: [
        {
          rotate: "180deg",
        },
      ],
    },
    moduleSelected: {
      backgroundColor: `${theme.btnActive}40`,
    },
    viewDownloadButton: {
      paddingHorizontal: HS._20,
      paddingVertical: VS._10,
      borderWidth: 1,
      borderColor: theme.textLight,
      borderRadius: MHS._20,
      marginTop: VS._10,
    },
    viewDone: {
      borderWidth: 1,
      borderColor: theme.textInactive,
      borderRadius: 100,
      width: MHS._24,
      height: MHS._24,
      justifyContent: "center",
      alignItems: "center",
    },
    viewLanscape: {
      height: Device.width,
      width: Device.height,
      transform: [{ rotate: "90deg" }],
    },
    viewPortrait: {
      width: "100%",
      height: "100%",
    },
  });
};

export default createStyles;
