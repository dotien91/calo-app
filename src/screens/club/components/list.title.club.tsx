import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TitleClubProps {
  textLeft?: string;
  iconNameRight: string;
  onPressRight?: () => void;
  onPressLeft?: () => void;
  badge?: number;
  textRight?: string;
}

const TitleClub = ({
  textLeft,
  iconNameRight,
  onPressRight,
  onPressLeft,
  badge,
  textRight,
}: TitleClubProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.viewHeadeTitle}>
        <TouchableOpacity onPress={onPressLeft}>
          <Text
            numberOfLines={1}
            style={[styles.txtTitle, { color: palette.text, ...CS.flex1 }]}
          >
            {textLeft || ""}
          </Text>
        </TouchableOpacity>
        {/* rightComponent */}
        <View style={styles.viewRight}>
          {!!iconNameRight && (
            <IconSvg
              onPress={onPressRight}
              name={iconNameRight || "ellipsis-horizontal"}
              size={24}
              color={palette.text}
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
              ...CS.center,
            }}
          >
            <Text style={[styles.txtTitle, { color: palette.primary }]}>
              {textRight}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TitleClub;

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 16,
  },
  viewHeadeTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewRight: {},
  txtTitle: {
    ...CS.hnBold,
    lineHeight: 24,
  },
  badge: {
    width: 20,
    height: 20,
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: palette.red,
    ...CS.flexCenter,
    borderRadius: 99,
    ...CS.borderStyle,
    borderColor: palette.white,
  },
  txtBadge: {
    ...CS.hnBold,
    fontSize: 16,
    color: palette.red,
  },
});
