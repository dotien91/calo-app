import React from "react";
import HeaderHome from "../header-home/HeaderHome";
import { Device } from "@utils/device.ui.utils";
import { getStatusBarHeight } from "react-native-safearea-height";
import { View } from "react-native";

const AboutHome = () => {
  return (
    <View
      style={{
        width: Device.width,
        // // position: "absolute",
        // left: 0,
        // top: 0,
        // zIndex: 1,
        paddingTop: getStatusBarHeight(),
        paddingBottom: 8,
      }}
    >
      <HeaderHome />
      {/* {!!userData?.display_name && (
        <View style={CommonStyle.flex2}>
          <Text
            style={styles.styleTxtText2}
          >{`${translations.hi} ${userData?.display_name},`}</Text>
          <Text style={styles.styleTxtText}>{translations.welcomeBack}</Text>
        </View>
      )} */}
    </View>
  );
};

export default AboutHome;
