import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
} from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import { translations } from "@localization";
import CS from "@theme/styles";
import { palette } from "@theme/themes";

interface TextViewCollapsedProps {
  text: string;
  styleText?: TextStyle;
  textColor?: string;
}

const TextViewCollapsed = ({
  text,
  styleText = {},
  textColor,
}: TextViewCollapsedProps) => {
  const [collapsed, setCollapsed] = useState(true);
  const [maxLines, setMaxLines] = useState(3);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const collapseView = () => {
    setMaxLines(3);
  };

  const expandView = () => {
    setMaxLines(null);
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
      <View>
        <Text style={[styles.paragraph, styleText]} numberOfLines={maxLines}>
          {text}
        </Text>
      </View>
      {text?.trim().length > 100 && (
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={toggleCollapsed}
        >
          <Text style={[styles.txtSeeMore, { color: textColor|| palette.primary }]}>
            {!collapsed
              ? translations.course.hideLess
              : translations.course.viewMore}
          </Text>
          <Icon
            size={16}
            name={!collapsed ? "chevron-up" : "chevron-down"}
            type={IconType.Ionicons}
            color={textColor || palette.primary}
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
    textAlignVertical: "center",
  },
});
