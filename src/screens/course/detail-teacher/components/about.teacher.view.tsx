import * as React from "react";
import { Text, View, StyleSheet } from "react-native";

import { translations } from "@localization";
import TextViewCollapsed from "@screens/course/components/text.view.collapsed";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { formatVNDate } from "@utils/date.utils";
import IconSvg from "assets/svg";
import { TypedUser } from "models";

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
      <TextViewCollapsed
        styleText={styles.txtDes}
        text={data?.bio || translations.noReferrals}
      />

      <Text style={styles.textTitle}>{translations.course.certifications}</Text>
      {data?.certificates?.length > 0 ? (
        data?.certificates.map((item: CertificatesProps, index: number) => {
          return (
            <View key={index} style={styles.viewCer}>
              <Text style={styles.textTime}>
                {formatVNDate(item.dateOfIssue)}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.textCer}>{item.name}</Text>
                {item.isValidated && (
                  <IconSvg name="icCheck" color={palette.blue} />
                )}
              </View>
            </View>
          );
        })
      ) : (
        <TextViewCollapsed text={translations.noCertificates} />
      )}
    </View>
  );
};

export default React.memo(AboutTeacher);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  textTitle: {
    ...CS.hnBold,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    minHeight: 28,
  },
  txtDes: {
    ...CS.hnRegular,
    color: palette.textOpacity6,
    lineHeight: 24,
  },
  viewCer: {
    marginTop: 8,
    marginBottom: 4,
  },
  textTime: {
    ...CS.hnRegular,
    fontSize: 12,
    lineHeight: 16,
    color: palette.textOpacity6,
  },
  textCer: {
    ...CS.hnMedium,
    ...CS.flex1,
    fontSize: 16,
    lineHeight: 24,
    color: palette.textOpacity8,
  },
});
