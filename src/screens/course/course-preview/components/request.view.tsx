import * as React from "react";
import { Text, View, StyleSheet } from "react-native";

import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { ICourseItem } from "models/course.model";
import { translations } from "@localization";
import SkeletonPlaceholder from "@shared-components/skeleton";
import { listSkill } from "constants/course.constant";

interface RequestSkillViewProps {
  data?: ICourseItem;
}

const TextRequest = ({ text }: { text: string }) => {
  const txt = listSkill.filter((item) => item.id === text);
  return (
    <View style={{ ...CS.row, marginTop: 8 }}>
      <View
        style={{
          width: 4,
          height: 4,
          marginRight: 8,
          borderRadius: 2,
          backgroundColor: palette.textOpacity6,
        }}
      />
      <Text style={styles.txtRequest}>{txt[0]?.value}</Text>
    </View>
  );
};

const RequestSkillView = ({ data }: RequestSkillViewProps) => {
  if (!data?._id) {
    return (
      <SkeletonPlaceholder>
        <View style={styles.container} />
        <View style={styles.paragraph} />
        <View style={[styles.txtRequest, { marginTop: 8 }]} />
        <View style={[styles.txtRequest, { marginTop: 8 }]} />
        <View style={[styles.txtRequest, { marginTop: 8 }]} />
      </SkeletonPlaceholder>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{translations.course.skills}</Text>
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
    marginTop: 12,
  },
  paragraph: {
    ...CS.hnMedium,
    fontSize: 20,
    minHeight: 20,
  },
  txtRequest: {
    ...CS.flex1,
    ...CS.hnRegular,
    color: palette.textOpacity8,
    minHeight: 16,
  },
});
