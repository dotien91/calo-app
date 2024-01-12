import React from "react";
import { Text, View, ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";

import CommonStyle from "@theme/styles";

interface TermPolicyViewProps {
  style: ViewStyle;
}

const TermPolicyView = ({ style }: TermPolicyViewProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const pressPolicy = () => {
    console.log("PressPolicy");
  };

  const pressTerms = () => {
    console.log("PressTerms");
  };
  return (
    <View style={style}>
      <Text
        style={[
          CommonStyle.hnLight,
          {
            textAlign: "center",
            fontSize: 14,
            color: colors.text,
          },
        ]}
      >
        {"By login or signing up, you're agree to our"}
      </Text>
      <Text
        style={[
          CommonStyle.hnLight,
          { textAlign: "center", fontSize: 14, color: colors.text },
        ]}
      >
        <Text onPress={pressTerms} style={{ color: colors.primary }}>
          {" "}
          Terms & Conditions
        </Text>{" "}
        and{" "}
        <Text onPress={pressPolicy} style={{ color: colors.primary }}>
          Privacy Policy
        </Text>
      </Text>
    </View>
  );
};

export default TermPolicyView;
