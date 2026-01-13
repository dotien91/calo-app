import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { palette } from "@theme/themes";
import TextBase from "@shared-components/TextBase";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <TextBase fontSize={24} fontWeight="bold" style={styles.title}>
        Welcome to Your App
      </TextBase>
      <TextBase fontSize={16} style={styles.subtitle}>
        This is a clean base template
      </TextBase>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.white,
    padding: 20,
  },
  title: {
    color: palette.black,
    marginBottom: 10,
  },
  subtitle: {
    color: palette.gray,
    textAlign: "center",
  },
});

export default HomeScreen;
