import * as React from "react";
import { View, StyleSheet } from "react-native";

import { translations } from "@localization";
import TextBase from "@shared-components/TextBase";
import ImageLoad from "@shared-components/image-load/ImageLoad";

interface HeaderClubProps {
  dataGroup: any;
}

const HeaderClub = ({ dataGroup }: HeaderClubProps) => {
  return (
    <View>
      <ImageLoad style={styles.viewImg} source={{ uri: dataGroup?.cover }} />

      <View style={styles.viewContent}>
        <View style={styles.viewTitle}>
          <TextBase
            fontSize={20}
            fontWeight="700"
            title={dataGroup?.name}
            numberOfLines={3}
          />
          <TextBase
            fontSize={14}
            fontWeight="400"
            title={`${dataGroup?.number_member_recent_join} ${translations.club.member}`}
          />
        </View>
      </View>
    </View>
  );
};

export default HeaderClub;

const styles = StyleSheet.create({
  viewImg: {
    height: 200,
    width: "100%",
  },
  viewContent: {
    marginHorizontal: 16,
  },
  viewTitle: {
    marginTop: 10,
    marginBottom: 10,
  },
});
