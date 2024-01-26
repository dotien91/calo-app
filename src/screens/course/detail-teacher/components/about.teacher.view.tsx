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

const AboutTeacher = ({ data }: AboutTeacherProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>{translations.aboutMe}</Text>
      <TextViewCollapsed text={data?.bio} />

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
  },

  viewCer: {
    marginTop: 8,
    marginBottom: 4,
  },
  textTime: {
    ...CS.hnRegular,
    fontSize: 14,
    color: palette.textOpacity6,
  },
  textCer: {
    ...CS.hnRegular,
    ...CS.flex1,
    fontSize: 16,
    color: palette.textOpacity8,
  },
});
