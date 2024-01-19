import React, { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
// import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import createStyles from "./course.component.style";
import RatingView from "./rating.view";
import { ICourseItem } from "models/course.model";

const CourseItem: React.FC<ICourseItem> = ({ rating }: ICourseItem) => {
  const theme = useTheme();
  // const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <RatingView rating={rating} />
    </View>
  );
};

export default CourseItem;
