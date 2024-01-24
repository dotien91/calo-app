import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import CS from "@theme/styles";
import { ICourseItem } from "models/course.model";

interface OverViewCourseProps {
  data?: ICourseItem;
}

interface TextOverviewProps {
  text: string;
  iconName?: string;
}

const TextOverview = ({ text, iconName }: TextOverviewProps) => {
  return (
    <View style={{ flexDirection: "row", paddingVertical: 4 }}>
      <View
        style={{
          width: 16,
          height: 16,
          marginRight: 8,
          ...CS.center,
        }}
      >
        {iconName && (
          <Icon type={IconType.Ionicons} name={iconName} size={16} />
        )}
      </View>
      <Text style={{ ...CS.flex1 }}>{text}</Text>
    </View>
  );
};

const OverViewCourse = ({ data }: OverViewCourseProps) => {
  console.log(data);
  return (
    <View style={styles.container}>
      <Text>Overview</Text>
      <TextOverview text="số giờ" iconName="at-outline" />
      <TextOverview text="số giờ" iconName="at-outline" />
      <TextOverview text="số giờ" iconName="at-outline" />
      <TextOverview text="số giờ" iconName="at-outline" />
    </View>
  );
};

export default React.memo(OverViewCourse);

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 16,
    marginTop: 8,
  },
});
