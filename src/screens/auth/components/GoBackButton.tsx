import React from "react";
import { View, ViewStyle } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import IconBtn from "@shared-components/button/IconBtn";
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
      <IconBtn
        customStyle={{ width: "auto" }}
        size={28}
        onPress={() => NavigationService.goBack()}
        name="chevron-left"
      />
    </View>
  );
};

export default GoBackButton;
