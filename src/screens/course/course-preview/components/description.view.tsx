import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";

import CS from "@theme/styles";
import { translations } from "@localization";
import { ICourseItem } from "models/course.model";
import { palette } from "@theme/themes";
import SkeletonPlaceholder from "@shared-components/skeleton";

interface DescriptionViewProps {
  data?: ICourseItem;
}

const DescriptionView = ({ data }: DescriptionViewProps) => {
  if (!data?._id) {
    return (
      <SkeletonPlaceholder>
        <View style={styles.container} />
        <View style={styles.paragraph} />
        <View style={styles.txtDes} />
      </SkeletonPlaceholder>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{translations.course.description}</Text>
      {/* <TextViewCollapsed text={data?.long_description} /> */}
      <Text style={styles.txtDes}>{data?.long_description}</Text>
    </View>
  );
};
export default memo(DescriptionView);

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 16,
    marginTop: 20,
  },
  paragraph: {
    ...CS.hnMedium,
    fontSize: 20,
    minHeight: 20,
  },
  txtDes: {
    ...CS.flex1,
    ...CS.hnRegular,
    color: palette.textOpacity8,
    minHeight: 16,
  },
});
