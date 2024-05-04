import React, { useMemo } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";

import CS from "@theme/styles";
import createStyles from "./elite.club.style";
import Header from "@shared-components/header/Header";
import ItemEliteScreen from "./item.elite.screen";

const EliteClubScreen = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute();
  const name = route.params.name || "";
  const isVIP = route.params.isVIP || false;
  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={name} isVIP={isVIP} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <ItemEliteScreen />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EliteClubScreen;
