import { getBottomSpace } from "react-native-iphone-screen-helper";

import CS from "@theme/styles";
// import { ExtendedTheme } from "@react-navigation/native";
import { palette } from "@theme/themes";
import { ViewStyle, StyleSheet } from "react-native";

interface Style {
  container: ViewStyle;
  viewImg: ViewStyle;
  viewBtn: ViewStyle;
  styleBtn: ViewStyle;
  viewButton: ViewStyle;
  viewInput: ViewStyle;
  viewDate: ViewStyle;
}

export default () => {
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
    },
    viewImg: {
      height: 160,
      width: "100%",
    },
    viewBtn: {
      width: 92,
      height: 24,
      borderRadius: 8,
      backgroundColor: palette.textOpacity6,
      position: "absolute",
      right: 16,
      bottom: 16,
    },
    styleBtn: {
      ...CS.flexCenter,
      gap: 8,
      marginHorizontal: 8,
    },
    viewButton: {
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: getBottomSpace(),
    },
    viewInput: {
      marginTop: 10,
      // marginHorizontal: 16,
    },
    viewDate: {
      marginHorizontal: 16,
    },
  });
};
