import React from "react";
import { Text, View, ViewStyle, Linking } from "react-native";
import { useTheme } from "@react-navigation/native";

import CommonStyle from "@theme/styles";
import { translations } from "@localization";

interface TermPolicyViewProps {
  style: ViewStyle;
}

const TermPolicyView = ({ style }: TermPolicyViewProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const pressPolicy = () => {
    Linking.openURL("https://tutorials.ikigroup.vn/ikes/privacy-policy");
  };

  const pressTerms = () => {
    Linking.openURL("https://tutorials.ikigroup.vn/ikes/term-and-conditions");
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
        {/* {"By login or signing up, you're agree to our"} */}
        {translations.login.bylogin}
      </Text>
      <Text
        style={[
          CommonStyle.hnLight,
          { textAlign: "center", fontSize: 14, color: colors.text },
        ]}
      >
        <Text onPress={pressTerms} style={{ color: colors.primary }}>
          {" "}
          {translations.login.term}
        </Text>{" "}
        {translations.login.and}{" "}
        <Text onPress={pressPolicy} style={{ color: colors.primary }}>
          {translations.login.police}
        </Text>
      </Text>
    </View>
  );
};

export default TermPolicyView;
