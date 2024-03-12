import React, { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import { Text, TouchableOpacity, View, Switch } from "react-native";
import Header from "@shared-components/header/Header";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import useStore from "@services/zustand/store";
import createStyles from "./setting.user.style";
import { translations } from "@localization";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";
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
