import { StyleSheet } from "react-native";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { getStatusBarHeight } from "react-native-safearea-height";

export const styles = StyleSheet.create({
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: "green",
  },
  dayItem: {
    marginLeft: 34,
  },
  modal: {
    ...CS.flexCenter,
  },
  bottomInner: {
    ...CS.safeAreaView,
    backgroundColor: palette.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    left: SCREEN_WIDTH / 5,
    bottom: 0,
    right: 0,
    top: 0,
  },
  bottomFull: {
    ...CS.flex1,
    backgroundColor: palette.background,
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
  },
  viewHeader: {
    paddingTop: getStatusBarHeight(),
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  viewTypeCalendar: {
    ...CS.flexStart,
    gap: 8,
    paddingHorizontal: 8,
  },
  viewBtn: {
    paddingVertical: 8,
    ...CS.row,
    gap: 8,
  },
  viewBorder: {
    height: 1,
    backgroundColor: palette.borderColor,
    marginVertical: 8,
  },
  btnDetailEvent: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  txtBtnDeatilEvent: {
    ...CS.hnRegular,
    fontSize: 14,
  },
  viewRect: {
    width: 20,
    height: 20,
    borderRadius: 8,
  },
  viewIcon: {
    ...CS.center,
    width: 25,
    height: 25,
  },
  headerDetail: {
    ...CS.row,
    height: 40,
    justifyContent: "space-between",
  },
  itemSelectTypeCalendar: {
    ...CS.row,
    gap: 8,
    marginTop: 8,
  },
  viewTitle: {
    ...CS.row,
    gap: 16,
  },
  containerAlive: {
    ...CS.row,
    marginTop: 8,
    bottom: 0,
    left: 0,
    right: 0,
  },
  viewDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.red,
  },
  viewLine: {
    flex: 1,
    height: 1,
    borderRadius: 2,
    backgroundColor: palette.red,
  },
  containerItem: {
    ...CS.row,
    marginTop: 8,
    gap: 8,
    alignItems: "flex-start",
  },
  viewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 99,
    marginTop: 8,
  },
  containerItemSelectType: {
    width: SCREEN_WIDTH / 5 - 10,
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  viewSticky: {
    height: "100%",
    width: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  txtItemEvent: {
    ...CS.hnRegular,
    fontSize: 16,
  },
  eventCellStyle: {
    borderRadius: 8,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.borderColor,
    padding: 0,
    flexDirection: "row",
  },
  paddingH: {
    paddingHorizontal: 16,
  },
  containerItemDetail: {
    ...CS.row,
    gap: 8,
    marginTop: 8,
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    fontWeight: "bold",
    marginRight: 10,
    color: "#333",
  },
  dayContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  todayContainer: {
    backgroundColor: "#e0f7fa",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  currentTimeMarker: {
    fontSize: 14,
    color: "#ff1744",
    marginTop: 5,
  },
});
