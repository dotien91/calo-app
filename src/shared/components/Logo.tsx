import React from "react";
import { View, Image, ImageStyle, StyleProp } from "react-native";
import logoImage from "@assets/images/logo_app.png";
import { TouchableOpacity } from "react-native-gesture-handler";

interface ILogo {
  style: StyleProp<ImageStyle>;
  onPress?: () => void;
}

const Logo = ({ style, onPress }: ILogo) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component onPress={() => onPress?.()}>
      <Image source={logoImage} style={style} resizeMode={"contain"} />
    </Component>
  );
};

export default Logo;
