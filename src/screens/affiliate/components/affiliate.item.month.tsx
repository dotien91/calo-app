import * as React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import createStyles from "../affiliate.screen.style";
import { palette } from "@theme/themes";

interface ItemMonthProps {
  text: string;
  price: string;
}

const ItemMonth = ({ text, price }: ItemMonthProps) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.styleViewTotal}>
      <View>
        <Text style={styles.txtMonth}>{text}</Text>
        <Text numberOfLines={2} style={styles.txtCommissionMonth}>
          {price}
        </Text>
      </View>
      <Icon
        name="trending-up-outline"
        size={24}
        type={IconType.Ionicons}
        color={palette.green2}
      />
    </View>
  );
};

export default React.memo(ItemMonth);
