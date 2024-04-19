import React from "react";
import AnimatedLottieView from "lottie-react-native";
import { View, Text, ViewStyle } from "react-native";

import CommonStyle from "@theme/styles";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { palette } from "@theme/themes";
import lotieNoResult from "assets/lotties/no-result.json";
import { Device } from "@utils/device.ui.utils";

interface IEmptyResultView {
  title?: string;
  desc?: string;
  icon?: string;
  lottieJson?: string;
  showLottie?: boolean;
  height?: number;
  style?: ViewStyle;
}

const EmptyResultView = ({
  title,
  desc,
  icon,
  lottieJson,
  showLottie = true,
  style,
  height,
}: IEmptyResultView) => {
  return (
    <View
      style={[
        style
          ? style
          : {
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              paddingHorizontal: 40,
              marginTop: 16,
              minHeight: height || Device.height / 3,
            },
      ]}
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
      {!icon && showLottie && (
        <AnimatedLottieView
          source={lottieJson || lotieNoResult}
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
