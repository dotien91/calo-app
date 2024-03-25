import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import * as NavigationService from "react-navigation-helpers";

import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { isAndroid } from "@helpers/device.info.helper";

interface HeaderProps {
  iconNameLeft?: string;
  iconNameRight?: string;
  text?: string;
  onPressLeft?: () => void;
  onPressRight?: () => void;
  textRight?: string;
  customStyle?: ViewStyle;
  badge?: number;
  hideBackBtn?: boolean;
  rightComponent?: JSX.Element;
}

const Header = ({
  iconNameLeft,
  iconNameRight,
  text,
  onPressLeft,
  onPressRight,
  textRight,
  customStyle,
  badge,
  hideBackBtn = false,
  rightComponent,
}: HeaderProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const _onPressLeft = () => {
    if (onPressLeft) {
      onPressLeft();
    } else {
      NavigationService.goBack();
    }
  };

  return (
    <View style={[styles.container, customStyle && customStyle]}>
      <View style={styles.viewIcons}>
        {!hideBackBtn && (
          <Icon
            onPress={_onPressLeft}
            name={iconNameLeft || "chevron-left"}
            type={IconType.Feather}
            size={25}
            color={colors.text}
          />
        )}
      </View>
      <Text
        numberOfLines={1}
        style={[
          styles.textHeader,
          { color: colors.text, ...CommonStyle.flex1 },
        ]}
      >
        {text || ""}
      </Text>
      {/* {!!iconNameRight && ( */}
      <View style={styles.viewIcons}>
        {!!iconNameRight && (
          <Icon
            onPress={onPressRight}
            name={iconNameRight || "ellipsis-horizontal"}
            type={IconType.Feather}
            size={25}
            color={colors.text}
          />
        )}
        {!!badge && !!iconNameRight && (
          <TouchableOpacity onPress={onPressRight} style={styles.badge}>
            <Text style={styles.txtBadge}>{badge}</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* )} */}
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
      {!!rightComponent && rightComponent()}
      {isAndroid() && (
        <View
          style={{
            position: "absolute",
            left: 0,
            top: -20,
            right: 0,
            height: 20,
            backgroundColor: "white",
            zIndex: 1,
          }}
        />
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
    marginBottom: 12,
    gap: 8,
    backgroundColor: palette.white,
    shadowColor: "rgba(0,0,0,0.4)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    elevation: 10,
    shadowRadius: 5,
    // marginTop: isIos ? 0 : getStatusBarHeight(),
  },
  textHeader: {
    ...CommonStyle.hnSemiBold,
    fontSize: 20,
    textAlign: "center",
  },
  viewIcons: {
    width: 40,
    height: 40,
    ...CommonStyle.center,
  },
  badge: {
    width: 20,
    height: 20,
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: palette.red,
    ...CommonStyle.flexCenter,
    borderRadius: 99,
    ...CommonStyle.borderStyle,
    borderColor: palette.white,
  },
  txtBadge: {
    ...CommonStyle.hnRegular,
    fontSize: 13,
    color: palette.white,
  },
});
