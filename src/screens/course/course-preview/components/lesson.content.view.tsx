import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import ViewCollapsed from "@screens/course/components/view.collapsed";
import CS from "@theme/styles";
import { ICourseItem } from "models/course.model";
import { translations } from "@localization";

interface LessonContentProps {
  data?: ICourseItem;
}

const LessonContent = ({ data }: LessonContentProps) => {
  const [listContent, setListContent] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (data?.labels) {
      setListContent(data?.labels);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{translations.course.courseContent}</Text>
      <ViewCollapsed showCollapsed={listContent.length > 2}>
        {listContent.map((item: string, index: number) => {
          return <TextOverview key={index} text={item} />;
        })}
      </ViewCollapsed>
    </View>
  );
};

interface TextOverviewProps {
  text: string;
}

const TextOverview = ({ text }: TextOverviewProps) => {
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
        <Icon type={IconType.Ionicons} name={"checkmark-outline"} size={16} />
      </View>
      <Text style={{ ...CS.flex1 }}>{text}</Text>
    </View>
  );
};
export default LessonContent;

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 16,
    marginTop: 8,
  },
  paragraph: {
    ...CS.hnMedium,
  },
});
