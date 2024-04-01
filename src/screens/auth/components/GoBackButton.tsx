import React from "react";
import { View, ViewStyle } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import IconSvg from "assets/svg";
import PressableBtn from "@shared-components/button/PressableBtn";
import { palette } from "@theme/themes";
const GoBackButton = ({ customStyle }: { customStyle?: ViewStyle }) => {
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
      <PressableBtn onPress={() => NavigationService.goBack()}>
        <IconSvg name="icBack" size={30} color={palette.text} />
      </PressableBtn>
    </View>
  );
};

export default GoBackButton;
