import React, { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
// import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import createStyles from "../course.style";

interface RatingViewProps {
  rating: number;
}

const listStar = [...Array(4).keys()];

const RatingView: React.FC<RatingViewProps> = ({ rating }: RatingViewProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderStar = (i: number) => {
    const color = rating < i ? colors.white : colors.primary;
    return (
      <Icon
        key={i}
        type={IconType.Feather}
        name="star"
        size={12}
        color={color}
      />
    );
  };
  return (
    <View style={styles.ratingBox}>{listStar.map((i) => renderStar(i))}</View>
  );
};

export default RatingView;
