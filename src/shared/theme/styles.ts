import { FlexStyle, StyleSheet } from "react-native";
import font from "./fonts";
import { palette } from "./themes";
import { mhs } from "utils/size.utils";
import {
  getBottomSpace,
  getStatusBarHeight,
} from "react-native-iphone-screen-helper";
import { isAndroid } from "@freakycoder/react-native-helpers";

const flexBase: FlexStyle = {
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
};

const CS = StyleSheet.create({
  flex1: { flex: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  flexStart: {
    ...flexBase,
    justifyContent: "flex-start",
  },
  flexStartTop: {
    ...flexBase,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  flexEnd: {
    ...flexBase,
    justifyContent: "flex-end",
  },
  flexRear: {
    ...flexBase,
    justifyContent: "space-between",
  },
  flexRearTop: {
    ...flexBase,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  flexSpaceAround: {
    ...flexBase,
    justifyContent: "space-around",
  },
  flexCenter: {
    ...flexBase,
    justifyContent: "center",
  },
  flexCenterTop: {
    ...flexBase,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  fillParent: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  txtLink: {
    fontFamily: font.outfit.regular,
    fontSize: 16,
    color: palette.link,
    textDecorationLine: "underline",
  },
  hnRegular: {
    fontFamily: font.outfit.regular,
    color: palette.text,
    fontSize: 16,
    color: palette.mainColor2,
  },
  hnBold: {
    fontFamily: font.outfit.bold,
    color: palette.text,
    fontSize: 16,
  },
  hnSemiBold: {
    fontFamily: font.outfit.semiBold,
    color: palette.text,
    fontSize: 16,
  },
  hnMedium: {
    fontFamily: font.outfit.medium,
    color: palette.text,
    fontSize: 16,
  },
  hnLight: {
    fontFamily: font.outfit.light,
    color: palette.text,
    fontSize: 16,
  },
  // hnItalic: {
  //   fontFamily: font.outfit.italic,
  // },
  borderStyle: {
    borderColor: palette.borderColor,
    borderStyle: "solid",
    borderWidth: 1,
  },
  borderBottomStyle: {
    borderColor: palette.borderColor,
    borderStyle: "solid",
    borderBottomWidth: 1,
  },
  borderTopStyle: {
    borderColor: palette.borderColor,
    borderStyle: "solid",
    borderTopWidth: 1,
  },
  text: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: font.outfit.medium,
    color: palette.black,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: font.outfit.bold,
    color: palette.mainColor2,
  },
  btnActive: {
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 99,
    backgroundColor: palette.primary,
  },
  txtBtnActive: {
    fontFamily: font.outfit.medium,
    fontSize: 16,
    color: palette.white,
  },
  textCourse: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: font.outfit.medium,
    color: palette.text,
  },
  textOpacity8: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: font.outfit.semiBold,
    color: palette.textOpacity6,
  },
  textOpacity6: {
    fontSize: 16,
    lineHeight: 20,
    color: palette.textOpacity6,
  },
  safeAreaView: {
    flex: 1,
    marginTop: getStatusBarHeight(),
    marginBottom: isAndroid ? getBottomSpace() : 0,
  },
});

interface Shadow {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;

  elevation: number;
}

export const Shadow7: Shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: mhs(4, 1),
  },
  shadowOpacity: 0.3,
  shadowRadius: mhs(4.65, 1),

  elevation: 7,
};

export const Shadow5: Shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: mhs(3, 1),
  },
  shadowOpacity: 0.25,
  shadowRadius: mhs(3.65, 1),

  elevation: 5,
};

export const Shadow3: Shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: mhs(2, 1),
  },
  shadowOpacity: 0.2,
  shadowRadius: mhs(2.22, 1),

  elevation: 3,
};

export const Shadow2: Shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: mhs(2, 1),
  },
  shadowOpacity: 0.4,
  shadowRadius: mhs(1.41, 1),

  elevation: 2,
};

export const Shadow1: Shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: mhs(1, 1),
  },
  shadowOpacity: 0.1,
  shadowRadius: mhs(0.7, 1),

  elevation: 1,
};

export const Shadow0: Shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0,
  shadowRadius: 0,

  elevation: 0,
};

export default CS;
