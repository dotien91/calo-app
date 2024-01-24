import { translations } from "@localization";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, Animated } from "react-native";

interface TextViewCollapsedProps {
  text?: string;
}

const TextViewCollapsed = ({ text }: TextViewCollapsedProps) => {
  const [collapsed, setCollapsed] = useState(true);
  const [maxLines, setMaxLines] = useState(2);
  const animationHeight = useRef(new Animated.Value(0)).current;

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const collapseView = () => {
    setTimeout(() => {
      setMaxLines(2);
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
        <Text style={styles.paragraph} numberOfLines={maxLines}>
          {text}
        </Text>
      </Animated.View>
      {text?.trim().length > 100 && (
        <Text onPress={toggleCollapsed} style={{ color: palette.primary }}>
          {!collapsed
            ? translations.course.hideLess
            : translations.course.viewMore}
        </Text>
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
    ...CS.hnMedium,
    fontSize: 16,
  },
});
