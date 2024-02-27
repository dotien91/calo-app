import React from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import TextBase from "./TextBase";
import { Device } from "../ui/device.ui";
import { HS, VS } from "../ui/sizes.ui";
import { HIT_SLOP_EXPAND_20 } from "constants/system.constant";
import { MHS } from "@utils/size.utils";
import { palette } from "@theme/themes";
import { BackIcon } from "../assets/svgIcons";

interface Props {
  back?: boolean;
  title?: string;
  rightIcon?: string;
  styleRightIcon?: ViewStyle;
  colorRightIcon?: string;
  colorLeftIcon?: string;
  style?: ViewStyle;
  styleTitle?: TextStyle;
  onPressRight?: () => void;
  onPressLeft?: () => void;
  renderRight?: () => React.ReactElement | null;
  renderContent?: () => React.ReactElement;
  borderBottom?: boolean;
  iconLeftSize?: number;
}

const Header = (props: Props) => {
  const {
    back = true,
    title = "",
    style,
    styleTitle,
    onPressLeft,
    renderContent,
    borderBottom = false,
  } = props;

  const goBack = () => {
    if (onPressLeft) {
      onPressLeft?.();
      return;
    }
    try {
      NavigationService.goBack();
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <View
      style={[
        {
          paddingTop: Device.heightPaddingStatusBar,
          width: "100%",
        },
        borderBottom ? { borderBottomWidth: 0.75 } : {},
        style,
      ]}
    >
      <View style={[styles.container]}>
        {back ? (
          <TouchableWithoutFeedback
            style={styles.backIcon}
            onPress={goBack}
            hitSlop={HIT_SLOP_EXPAND_20}
          >
            <View style={styles.iconLeft}>
              <BackIcon
                width={MHS._24}
                height={MHS._24}
                color={palette.mainColor2}
              />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
        {renderContent ? (
          renderContent()
        ) : title ? (
          <TextBase
            title={title}
            fontSize={18}
            fontWeight="700"
            style={[styles.title, styleTitle]}
            numberOfLines={1}
            ellipsizeMode="tail"
          />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: VS._44,
    alignItems: "center",
    zIndex: 1000000000,
    position: "relative",
  },
  backIcon: {
    position: "relative",
    zIndex: 10000,
  },
  title: {
    marginHorizontal: HS._40,
    flex: 1,
    textAlign: "center",
  },
  iconLeft: {
    position: "absolute",
    left: HS._8,
    zIndex: 1,
  },
});

export default Header;
