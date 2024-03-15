import React from "react";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { SafeAreaView } from "react-native-safe-area-context";

const HiddenPaage = () => {
  return (
    <SafeAreaView style={{ ...CS.safeAreaView }}>
      <Header text="Hidden Page" />
    </SafeAreaView>
  );
};
export default HiddenPaage;
