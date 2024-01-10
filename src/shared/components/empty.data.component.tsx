import React from "react";
import AnimatedLottieView from "lottie-react-native";
import { View, Text } from "react-native";

import CommonStyle from "@theme/styles";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { palette } from "@theme/themes";

interface IEmptyResultView {
  title?: string;
  desc?: string;
  icon?: string;
  lottieJson?: string;
}

const EmptyResultView = ({
  title,
  desc,
  icon,
  lottieJson,
}: IEmptyResultView) => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
      }}
    >
      {!!icon && (
        <Icon
          type={IconType.Ionicons}
          name={icon}
          size={30}
          color={palette.mainColor2}
          style={{ marginBottom: 16 }}
        />
      )}
      {!!lottieJson && (
        <AnimatedLottieView
          source={lottieJson}
          style={{ width: 60, height: 60, marginBottom: 10 }}
          loop
          speed={1.5}
          autoPlay
        />
      )}
      <Text
        style={{ ...CommonStyle.hnBold, textAlign: "center", marginBottom: 14 }}
      >
        {title}
      </Text>
      <Text style={{ ...CommonStyle.hnRegular, textAlign: "center" }}>
        {desc}
      </Text>
    </View>
  );
};

export default EmptyResultView;
