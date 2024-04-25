import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";

import { translations } from "@localization";
import CommonStyle from "@theme/styles";

const OrView = () => {
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
        style={{ height: 1, backgroundColor: colors.background, flex: 1 }}
      />
      <Text
        style={[
          CommonStyle.hnMedium,
          { paddingHorizontal: 16, color: colors.text },
        ]}
      >
        {translations.or}
      </Text>
      <View
        style={{ height: 1, backgroundColor: colors.background, flex: 1 }}
      />
    </View>
  );
};

export default OrView;
