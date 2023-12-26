import React from "react";
import { Pressable, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { getStatusBarHeight } from "react-native-iphone-screen-helper";
import IconSvg from "assets/svg";
const GoBackButton = () => {
  return (
    <View
      style={{
        position: "absolute",
        top: getStatusBarHeight(),
        left: 20,
        zIndex: 1,
      }}
    >
      <Pressable onPress={() => NavigationService.goBack()}>
        <IconSvg name="icBack" size={17} />
      </Pressable>
    </View>
  );
};

export default GoBackButton;
