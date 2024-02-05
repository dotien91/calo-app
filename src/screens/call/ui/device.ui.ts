import { Dimensions, NativeModules, Platform, StatusBar } from "react-native";

const { width, height } = Dimensions.get("window");
const heightScreen = Dimensions.get("screen").height;
const { PlatformConstants } = NativeModules;

const isIphoneX =
  Platform.OS === "ios" &&
  !Platform.isTV &&
  !Platform.isTV &&
  (height === 812 || width === 812);
const isIphoneXR =
  Platform.OS === "ios" &&
  !Platform.isTV &&
  !Platform.isTV &&
  (height === 896 || width === 896);

const isIphone12 =
  Platform.OS === "ios" &&
  !Platform.isTV &&
  !Platform.isTV &&
  (height === 844 || width === 844);
const isIphone12PM =
  Platform.OS === "ios" &&
  !Platform.isTV &&
  !Platform.isTV &&
  (height === 926 || width === 926);
const isIphone14 =
  Platform.OS === "ios" &&
  !Platform.isTV &&
  !Platform.isTV &&
  (height === 852 || width === 852);
const isIphone14PM =
  Platform.OS === "ios" &&
  !Platform.isTV &&
  !Platform.isTV &&
  (height === 932 || width === 932);
const tabBarHeight = 50;
const isX =
  isIphoneX ||
  isIphoneXR ||
  isIphone12 ||
  isIphone12PM ||
  isIphone14 ||
  isIphone14PM;
const safeAreaInsetX = { top: 44, bottom: 34 };

export const Device = {
  // isHasSoftMenuBar: Platform.OS === "android" ? NativeModules.SoftMenuBarModule.checkIsSoftMenuBarDisplay() : false,
  ratio: width / heightScreen,
  width,
  height,
  isWeb: Platform.OS === "web",
  isIos: Platform.OS === "ios",
  isAndroid: Platform.OS === "android",
  deviceType: PlatformConstants.interfaceIdiom,
  isX,
  safeAreaInsetX,
  tabBarHeightContain: tabBarHeight + (isX ? safeAreaInsetX.bottom : 0),
  heightScreen,
  heightStatusBar:
    Platform.OS === "ios" ? safeAreaInsetX.top : StatusBar.currentHeight || 0,
  heightPaddingStatusBar:
    Platform.OS == "ios"
      ? isX
        ? safeAreaInsetX.top
        : 20
      : StatusBar.currentHeight || 0,
};
