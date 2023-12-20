import { IconBack } from "assets/svg";
import React from "react";
import { Pressable, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { getStatusBarHeight } from "react-native-iphone-screen-helper";
const GoBack = () => {
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
        <IconBack />
      </Pressable>
    </View>
  );
};

export default GoBack;
