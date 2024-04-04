import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    backgroundColor: "#eceff1",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 5,
    borderRadius: 10,
    position: "absolute",
    margin: 10,
    borderColor: "#bdbdbd",
    borderWidth: 0.5,
    borderRadius: 6,
    top: 55,
    height: 30,
  },
  title: {
    color: "#000",
    fontWeight: "bold",
  },
  dot: {
    backgroundColor: "red",
    padding: 6,
    borderRadius: 20,
    marginRight: 5,
  },
  viewCountBox: {
    backgroundColor: palette.textOpacity4,
    ...CommonStyle.flexCenter,
    paddingHorizontal: 5,
    borderRadius: 6,
    position: "absolute",
    margin: 10,
    top: 60,
    right: 70,
    height: 30,
    minWidth: 60,
    justifyContent: "center",
  },
  viewName: {
    backgroundColor: palette.textOpacity4,
    ...CommonStyle.row,
    paddingHorizontal: 5,
    borderRadius: 6,
    position: "absolute",
    margin: 10,
    top: 60,
    left: 16,
    minHeight: 40,
    padding: 8,
    minWidth: 60,
    justifyContent: "center",
    gap: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  txtName: {
    ...CommonStyle.hnMedium,
    fontSize: 14,
    color: palette.white,
  },
  txtLike: {
    ...CommonStyle.hnRegular,
    fontSize: 14,
    color: palette.white,
  },
  viewCountTxt: {
    ...CommonStyle.hnMedium,
    color: palette.white,
    marginLeft: 4,
  },
});
