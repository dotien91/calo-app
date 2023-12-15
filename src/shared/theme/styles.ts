import { StyleSheet } from "react-native";
import font from "./fonts";
import { palette } from "./themes";

const flexBase = {
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
};

const CommonStyle = StyleSheet.create({
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
  hnRegular: {
    fontFamily: font.montserrat.regular,
  },
  hnBold: {
    fontFamily: font.montserrat.bold,
  },
  hnSemiBold: {
    fontFamily: font.montserrat.semiBold,
  },
  hnBoldItalic: {
    fontFamily: font.montserrat.boldItalic,
  },
  hnMedium: {
    fontFamily: font.montserrat.medium,
  },
  hnLight: {
    fontFamily: font.montserrat.light,
  },
  hnItalic: {
    fontFamily: font.montserrat.italic,
  },
  hnLightItalic: {
    fontFamily: font.montserrat.lightItalic,
  },
  borderStyle: {
    borderColor: palette.borderColor,
    borderStyle: "solid",
    borderWidth: 0.5,
  },
  text: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: font.montserrat.medium,
    color: palette.black,
  },
});

export default CommonStyle;
