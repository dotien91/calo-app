import React, { useMemo } from "react";
import { ImageBackground, Text, View } from "react-native";

import CommonStyle from "@theme/styles";
import { translations } from "@localization";
import createStyles from "./about.home.style";
import { useTheme } from "@react-navigation/native";
import useStore from "@services/zustand/store";
import HeaderHome from "../header-home/HeaderHome";
import { Device } from "@utils/device.ui.utils";
import { getStatusBarHeight } from "react-native-safearea-height";
// import ListLiveStream from "../list-livestream/list.liveStream";

const AboutHome = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const userData = useStore((state) => state.userData);

  return (
    <ImageBackground
      source={require("../../../../assets/images/home_header.jpg")}
      style={{
        width: Device.width,
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 1,
        paddingTop: getStatusBarHeight(),
        paddingBottom: 16,
      }}
      borderRadius={8}
    >
      <HeaderHome />
      {!!userData?.display_name && (
        <View style={CommonStyle.flex2}>
          <Text style={styles.styleTxtText2}>{userData?.display_name}</Text>
          <Text style={styles.styleTxtText}>{translations.welcomeBack}</Text>
        </View>
      )}
    </ImageBackground>
  );
};

export default AboutHome;
