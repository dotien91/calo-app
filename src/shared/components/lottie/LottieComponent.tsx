import { palette } from "@theme/themes";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import CS from "@theme/styles";
import React from "react";

interface ILottieComponent {
  height: number;
  lottieJson?: string;
}

const LottieComponent = ({ height, lottieJson }: ILottieComponent) => {
  return (
    <View
      style={{
        height: height || 315,
        backgroundColor: palette.white,
        paddingHorizontal: 16,
      }}
    >
      <LottieView
        style={CS.flex1}
        resizeMode="cover"
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
