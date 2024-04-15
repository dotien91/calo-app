import CS from "@theme/styles";
import { palette } from "@theme/themes";
// import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet, TextStyle } from "react-native";

interface Style {
  container: ViewStyle;
  viewImg: ViewStyle;
  viewContent: ViewStyle;
  viewTitle: ViewStyle;
  viewDescription: ViewStyle;
  des: TextStyle;
  viewHis: ViewStyle;
  viewHeadTitle: ViewStyle;
  viewAvatar: ViewStyle;
  viewIcon: ViewStyle;
  viewGroup: ViewStyle;
  styleAvatar: ViewStyle;
  viewMember: ViewStyle;
}

export default () => {
  return StyleSheet.create<Style>({
    container: {
      marginBottom: 10,
    },
    viewImg: {
      height: 200,
      width: "100%",
    },
    viewContent: {
      marginHorizontal: 16,
    },
    viewTitle: {
      marginTop: 10,
      marginBottom: 10,
    },
    viewDescription: {
      marginBottom: 10,
    },
    des: {
      ...CS.hnRegular,
      marginTop: 8,
      color: palette.textOpacity8,
    },
    viewHis: {
      ...CS.flexStart,
      gap: 10,
      marginBottom: 10,
    },
    viewHeadTitle: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 4,
    },
    viewIcon: {
      flexDirection: "row",
      alignContent: "center",
      gap: 10,
    },
    viewGroup: {
      marginBottom: 10,
      marginTop: 5,
    },
    viewAvatar: {
      height: 48,
      alignItems: "center",
      flexDirection: "row",
      marginLeft: 8,
    },
    styleAvatar: {
      height: 40,
      width: 40,
      borderRadius: 100,
      backgroundColor: palette.gold,
      marginLeft: -8,
    },
    viewMember: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
  });
};
