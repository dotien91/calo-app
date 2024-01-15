import { useTheme } from "@react-navigation/native";
import CommonStyle from "@theme/styles";
import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface HeaderProps {
  iconNameLeft: string;
  iconNameRight?: string;
  text: string;
  onPressLess: () => void;
  onPressRight?: () => void;
}

const Header = ({
  iconNameLeft,
  iconNameRight,
  text,
  onPressLess,
  onPressRight,
}: HeaderProps) => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <View style={styles.container}>
      <Icon
        onPress={onPressLess}
        name={iconNameLeft}
        type={IconType.Ionicons}
        size={25}
        color={colors.text}
      />
      <Text style={[styles.textHeader, { color: colors.text }]}>{text}</Text>
      <View style={styles.viewIcons}>
        {iconNameRight && (
          <Icon
            onPress={onPressRight}
            name={iconNameLeft}
            type={IconType.Ionicons}
            size={25}
            color={colors.text}
          />
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  textHeader: {
    ...CommonStyle.hnBold,
  },
  viewIcons: {
    width: 40,
    height: 40,
    ...CommonStyle.center,
  },
});
