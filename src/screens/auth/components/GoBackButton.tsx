import React from "react";
import { Pressable, View, ViewStyle } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import IconSvg from "assets/svg";
const GoBackButton = ({ customStyle }: { customStyle: ViewStyle }) => {
  return (
    <View
      style={[
        customStyle || {
          // position: "absolute",
          // top: getStatusBarHeight(),
          // left: 20,
          // zIndex: 1,
          marginLeft: 18,
        },
      ]}
    >
      <Pressable onPress={() => NavigationService.goBack()}>
        <IconSvg name="icBack" size={17} />
      </Pressable>
    </View>
  );
};

export default GoBackButton;
