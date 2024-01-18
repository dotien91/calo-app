import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import CommonStyle from "@theme/styles";

interface HeaderProps {
  iconNameLeft: string;
  iconNameRight?: string;
  text: string;
  onPressLeft: () => void;
  onPressRight?: () => void;
  textRight?: string;
}

const Header = ({
  iconNameLeft,
  iconNameRight,
  text,
  onPressLeft,
  onPressRight,
  textRight,
}: HeaderProps) => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <View style={styles.container}>
      <Icon
        onPress={onPressLeft}
        name={iconNameLeft}
        type={IconType.Ionicons}
        size={25}
        color={colors.text}
      />
      <Text
        style={[
          styles.textHeader,
          { color: colors.text, ...CommonStyle.flex1 },
        ]}
      >
        {text}
      </Text>
      <View style={styles.viewIcons}>
        {iconNameRight && (
          <Icon
            onPress={onPressRight}
            name={iconNameRight}
            type={IconType.Ionicons}
            size={25}
            color={colors.text}
          />
        )}
      </View>
      {(!textRight || textRight?.trim() !== "") && (
        <TouchableOpacity
          onPress={onPressRight}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            zIndex: 1,
            ...CommonStyle.center,
            paddingRight: 16,
          }}
        >
          <Text
            style={[
              styles.textHeader,
              { color: colors.text, textDecorationLine: "underline" },
            ]}
          >
            {textRight}
          </Text>
        </TouchableOpacity>
      )}
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
    gap: 8,
  },
  textHeader: {
    ...CommonStyle.hnBold,
    textAlign: "center",
  },
  viewIcons: {
    width: 40,
    height: 40,
    ...CommonStyle.center,
  },
});
