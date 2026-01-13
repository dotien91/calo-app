import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { translations } from "@localization";
import { palette } from "@theme/themes";

const StatisticsScreen = () => {
  return (
    <SafeAreaView style={CS.container}>
      <Header hideBackBtn text={translations.statistics.title} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: palette.white,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: palette.black,
              marginBottom: 8,
            }}
          >
            {translations.statistics.overview}
          </Text>
          <Text style={{ fontSize: 14, color: palette.textSecondary }}>
            {translations.statistics.comingSoon}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatisticsScreen;
