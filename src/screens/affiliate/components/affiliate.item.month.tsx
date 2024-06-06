import * as React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import createStyles from "../affiliate.screen.style";
import { palette } from "@theme/themes";

interface ItemMonthProps {
  text: string;
  price: string;
  style?: {
    view?: object;
    textMonth?: object;
    textCommissionMonth?: object;
  };
  color?: string;
}

const ItemMonth: React.FC<ItemMonthProps> = ({ text, price, style, color }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={[styles.styleViewTotal, style?.view]}>
      <View>
        <Text style={[styles.txtMonth, style?.textMonth]}>{text}</Text>
        <Text
          numberOfLines={2}
          style={[styles.txtCommissionMonth, style?.textCommissionMonth]}
        >
          {price}
        </Text>
      </View>
      <Icon
        name="trending-up-outline"
        size={24}
        type={IconType.Ionicons}
        color={color || palette.green}
      />
    </View>
  );
};

export default React.memo(ItemMonth);
