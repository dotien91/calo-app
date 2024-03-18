import { StyleSheet } from "react-native";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { Device } from "@utils/device.ui.utils";

const width = Device.width;

export const styleHtml = StyleSheet.create({
  table: {
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    // borderRightWidth:1,
    // borderColor: palette.borderColor,
    marginBottom: 7,
    width: width - 32,
  },
  menu: {
    padding: 12,
    ...CS.borderStyle,
    borderRadius: 8,
    borderColor: "#E14242",
  },
  ul: {
    width: width - 32,
  },
  b: {
    ...CS.hnBold,
  },
  p: {
    ...CS.hnRegular,
    color: palette.textOpacity8,
  },
  span: {
    ...CS.hnRegular,
  },
  tr: {
    borderBottomWidth: 0.5,
    // borderColor: palette.borderColor,
  },
  td: {
    borderRightWidth: 0.5,
    // borderColor: palette.borderColor,
    padding: 8,
  },
  th: {
    borderRightWidth: 0.5,
    // borderColor: palette.borderColor,
    padding: 8,
  },
  article: {
    backgroundColor: palette.grey1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});
