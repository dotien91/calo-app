import { translations } from "@localization";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextStyle,
} from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface TextViewCollapsedProps {
  text?: string;
  styleText?: TextStyle;
}

const TextViewCollapsed = ({
  text,
  styleText = {},
}: TextViewCollapsedProps) => {
  const [collapsed, setCollapsed] = useState(true);
  const [maxLines, setMaxLines] = useState(2);
  const animationHeight = useRef(new Animated.Value(0)).current;

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const collapseView = () => {
    setTimeout(() => {
      setMaxLines(3);
    }, 300);
    Animated.timing(animationHeight, {
      duration: 300,
      toValue: 80,
      useNativeDriver: false,
    }).start();
  };

  const expandView = () => {
    setMaxLines(null);
    Animated.timing(animationHeight, {
      duration: 300,
      toValue: 1000,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (collapsed) {
      collapseView();
    } else {
      expandView();
    }
  }, [collapsed]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ maxHeight: animationHeight }}>
        <Text style={[styles.paragraph, styleText]} numberOfLines={maxLines}>
          {text}
        </Text>
      </Animated.View>
      {text?.trim().length > 100 && (
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={toggleCollapsed}
        >
          <Text style={styles.txtSeeMore}>
            {!collapsed
              ? translations.course.hideLess
              : translations.course.viewMore}
          </Text>
          <Icon
            size={16}
            name={!collapsed ? "chevron-up" : "chevron-down"}
            type={IconType.Ionicons}
            color={palette.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default TextViewCollapsed;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  paragraph: {
    ...CS.hnRegular,
    fontSize: 16,
    color: palette.textOpacity8,
  },
  txtSeeMore: {
    ...CS.hnSemiBold,
    color: palette.primary,
    textAlignVertical: "center",
  },
});
