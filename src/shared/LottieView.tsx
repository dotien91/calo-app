import React from "react";
import AnimatedLottieView from "lottie-react-native";
import { ViewStyle } from "react-native";

interface IlottieView {
  style: ViewStyle;
  lottieJson: string;
}

const LottieView = ({ lottieJson, style }: IlottieView) => {
  return <AnimatedLottieView source={lottieJson} style={style} loop autoPlay />;
};

export default LottieView;
