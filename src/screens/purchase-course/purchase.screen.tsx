import React, { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./purchase.style";

interface PurchaseScreenProps {}

const PurchaseScreen: React.FC<PurchaseScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return <View style={styles.container}></View>;
};

export default PurchaseScreen;
