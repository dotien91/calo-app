import * as React from "react";
import { TouchableOpacity, View } from "react-native";

import IconSvg from "assets/svg";

interface StarRateProps {
  size: number;
  star: number;
}
const starColor = "#FFA347";

export function StarRate({ size, star }: StarRateProps) {
  const [number, setNumber] = React.useState(star);
  const listStar = [...Array(5).keys()];

  const renderStar = (i: number) => {
    const name = number < i ? "icStar" : "icStarFull";
    const pressStar = () => setNumber(i);
    return (
      <TouchableOpacity key={i} onPress={pressStar}>
        <IconSvg name={name} size={size} color={starColor} />
      </TouchableOpacity>
    );
  };
  const renderStarRate = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        {listStar.map((i) => renderStar(i))}
      </View>
    );
  };
  return {
    renderStarRate,
    number,
  };
}
