import IconSvg from "assets/svg";
import * as React from "react";
import { View } from "react-native";

interface StarRateProps {
  number: number;
  size: number;
}
const starColor = "#FFA347";

const StarRate = ({ number, size }: StarRateProps) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <IconSvg name={"icStarFull"} size={size} color={starColor} />
      <IconSvg
        name={number >= 2 ? "icStarFull" : number > 1 ? "icStarHalf" : "icStar"}
        size={size}
        color={starColor}
      />
      <IconSvg
        name={number >= 3 ? "icStarFull" : number > 2 ? "icStarHalf" : "icStar"}
        size={size}
        color={starColor}
      />
      <IconSvg
        name={number >= 4 ? "icStarFull" : number > 3 ? "icStarHalf" : "icStar"}
        size={size}
        color={starColor}
      />
      <IconSvg
        name={number == 5 ? "icStarFull" : number > 4 ? "icStarHalf" : "icStar"}
        size={size}
        color={starColor}
      />
    </View>
  );
};

export default StarRate;
