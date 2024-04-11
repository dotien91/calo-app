import React, { useMemo } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import CS from "@theme/styles";
import createStyles from "./elite.club.style";
import Header from "@shared-components/header/Header";
import ItemEliteScreen from "./item.elite.screen";
import { useTheme } from "@react-navigation/native";

const EliteClubScreen = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text="IKIGAI COACH: The Project Management: Beginner to Project Manager" />
      <ScrollView>
        <View style={styles.container}>
          <ItemEliteScreen />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EliteClubScreen;
