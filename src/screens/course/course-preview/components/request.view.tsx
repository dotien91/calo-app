import * as React from "react";
import { Text, View, StyleSheet } from "react-native";

import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { ICourseItem } from "models/course.model";
import { translations } from "@localization";

interface RequestSkillViewProps {
  data?: ICourseItem;
}

const TextRequest = ({ text }: { text: string }) => {
  return (
    <View
      style={{ flexDirection: "row", paddingVertical: 4, alignItems: "center" }}
    >
      <View
        style={{
          width: 4,
          height: 4,
          marginRight: 8,
          borderRadius: 2,
          backgroundColor: palette.textOpacity6,
        }}
      />
      <Text style={styles.txtRequest}>{text}</Text>
    </View>
  );
};

const RequestSkillView = ({ data }: RequestSkillViewProps) => {
  console.log("Skill1", data?.skills);

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{translations.course.requestSkills}</Text>
      {data?.skills.map((item: string, index: number) => {
        return <TextRequest key={index + item} text={item} />;
      })}
    </View>
  );
};

export default React.memo(RequestSkillView);

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 16,
    marginTop: 8,
  },
  paragraph: {
    ...CS.hnMedium,
    fontSize: 20,
  },
  txtRequest: {
    ...CS.flex1,
    ...CS.textOpacity6,
  },
});
