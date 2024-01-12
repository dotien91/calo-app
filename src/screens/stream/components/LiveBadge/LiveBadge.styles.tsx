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
    backgroundColor: palette.lightOverlay,
    ...CommonStyle.flexCenter,
    paddingHorizontal: 5,
    borderRadius: 6,
    position: "absolute",
    margin: 10,
    borderRadius: 4,
    top: 55,
    left: 70,
    height: 30,
  },
  viewCountTxt: {
    ...CommonStyle.hnMedium,
    color: palette.white,
    marginLeft: 4,
  },
});
