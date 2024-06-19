import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
// import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import createStyles from "../course.style";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { translations } from "@localization";

interface CourseCategoryTitleProps {
  title: string;
  onPress: () => void;
  hideViewAll: boolean;
}
const CourseCategoryTitle = ({
  title,
  onPress,
  hideViewAll,
}: CourseCategoryTitleProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View
      style={{
        ...CS.flexRear,
        paddingHorizontal: 16,
        marginBottom: 8,
      }}
    >
      <Text style={styles.typeLearningLabel}>{title}</Text>
      {!hideViewAll && (
        <PressableBtn onPress={onPress} style={{ ...CS.flexEnd }}>
          <Text style={styles.txtViewMore}>{translations.viewAll}</Text>
          <Icon
            name={"chevron-right"}
            type={IconType.Feather}
            size={16}
            style={{ color: colors.textOpacity6 }}
          />
        </PressableBtn>
      )}
    </View>
  );
};

export default CourseCategoryTitle;
