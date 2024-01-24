import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";

import CS from "@theme/styles";
import { translations } from "@localization";
import { ICourseItem } from "models/course.model";

interface DescriptionViewProps {
  data?: ICourseItem;
}

const DescriptionView = ({ data }: DescriptionViewProps) => {
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
    marginTop: 8,
    overflow: "hidden",
  },
  paragraph: {
    ...CS.hnMedium,
    fontSize: 20,
  },
  txtDes: {
    ...CS.hnMedium,
    fontSize: 16,
  },
});
