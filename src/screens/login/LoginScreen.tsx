import { View } from "react-native";
import React from "react";
import Intro from "./intro/Intro";

export default function LoginScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Intro />
      {/* <ChooseLanguage /> */}
    </View>
  );
}
