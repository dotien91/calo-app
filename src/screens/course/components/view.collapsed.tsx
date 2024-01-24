import { translations } from "@localization";
import { palette } from "@theme/themes";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, Animated } from "react-native";

interface ViewCollapsedProps {
  children: ReactNode;
  showCollapsed: boolean;
}

const ViewCollapsed = ({ children, showCollapsed }: ViewCollapsedProps) => {
  const [collapsed, setCollapsed] = useState(true);
  const animationHeight = useRef(new Animated.Value(0)).current;

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const collapseView = () => {
    Animated.timing(animationHeight, {
      duration: 300,
      toValue: 80,
      useNativeDriver: false,
    }).start();
  };

  const expandView = () => {
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
        {children}
      </Animated.View>
      {showCollapsed && (
        <Text
          onPress={toggleCollapsed}
          style={{
            color: palette.primary,
            backgroundColor: palette.background,
          }}
        >
          {!collapsed
            ? translations.course.hideLess
            : translations.course.viewMore}
        </Text>
      )}
    </View>
  );
};
export default ViewCollapsed;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});
