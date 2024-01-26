import { View } from "react-native";
import LottieView from "lottie-react-native";
import React from "react";
import { ViewStyle } from "react-native-size-matters";

interface ILottieComponent {
  height: number;
  lottieJson?: string;
  resizeMode?: string;
  customStyle?: ViewStyle;
}

const LottieComponent = ({
  height,
  lottieJson,
  resizeMode,
  customStyle,
}: ILottieComponent) => {
  return (
    <View
      style={[
        {
          height: height || 315,
          paddingHorizontal: 16,
        },
        !!customStyle && customStyle,
      ]}
    >
      <LottieView
        style={{ flex: 1 }}
        resizeMode={resizeMode || "contain"}
        source={
          lottieJson || require("../../../assets/lotties/loading-item.json")
        }
        autoPlay
        loop
      />
    </View>
  );
};

export default React.memo(LottieComponent);
