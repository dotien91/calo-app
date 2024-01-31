import { translations } from "@localization";
import TextViewCollapsed from "@screens/course/components/text.view.collapsed";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { formatVNDate } from "@utils/date.utils";
import IconSvg from "assets/svg";
import { TypedUser } from "models";
import * as React from "react";
import { Text, View, StyleSheet } from "react-native";

interface AboutTeacherProps {
  data?: TypedUser;
}

interface CertificatesProps {
  dateOfIssue: string;
  isValidated: boolean;
  name: string;
}

const text = `I am an IELTS and TOEFL specialist who has developed courses for international exams for 15 years. I have won awards from IELTS Hunter for being a top instructor, and my courses have been IELTS Hunter's best-sellers for years. I have lived and taught in multiple countries, including China, Brazil, The Ivory Coast, Kazakhstan, and Georgia, which means that I understand teaching international students. This experience provides me with a true insight into the needs and viewpoints of all of my international students. By taking this course, you will master the strategies and tactics to score well above the score you need.
In addition to having a CELTA ESL Certificate, I earned Law and Psychology degrees from reputable universities. My courses are delivered with practical, easily applicable strategies that lead to extremely high scores.`;

const AboutTeacher = ({ data }: AboutTeacherProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>{translations.aboutMe}</Text>
      <TextViewCollapsed text={data?.bio || text} />

      <Text style={styles.textTitle}>{translations.course.certifications}</Text>
      {data?.certificates &&
        data?.certificates.map((item: CertificatesProps, index: number) => {
          return (
            <View key={index} style={styles.viewCer}>
              <Text style={styles.textTime}>
                {formatVNDate(item.dateOfIssue)}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.textCer}>{item.name}</Text>
                {item.isValidated && (
                  <IconSvg name="icCheck" color={palette.green} />
                )}
              </View>
            </View>
          );
        })}
    </View>
  );
};

export default React.memo(AboutTeacher);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  textTitle: {
    ...CS.hnMedium,
    fontSize: 20,
    lineHeight: 28,
    marginTop: 16,
  },

  viewCer: {
    marginTop: 8,
    marginBottom: 4,
  },
  textTime: {
    ...CS.hnRegular,
    fontSize: 14,
    lineHeight: 22,
    color: palette.textOpacity6,
  },
  textCer: {
    ...CS.hnMedium,
    ...CS.flex1,
    fontSize: 16,
    lineHeight: 22,
    color: palette.textOpacity8,
  },
});
