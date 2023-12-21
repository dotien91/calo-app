import { translations } from "@localization";
import { useTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";
import React from "react";
import { Text, View } from "react-native";

const Or = () => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <View
      style={{
        height: 30,
        flexDirection: "row",
        marginTop: 16,
        alignItems: "center",
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{ height: 1, backgroundColor: colors.mainColor2, flex: 1 }}
      />
      <Text style={[CommonStyle.hnMedium, { paddingHorizontal: 16 }]}>
        {translations.or}
      </Text>
      <View
        style={{ height: 1, backgroundColor: colors.mainColor2, flex: 1 }}
      />
    </View>
  );
};

export default Or;
