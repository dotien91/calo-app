import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { getBottomSpace } from "react-native-iphone-screen-helper";

import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { translations } from "@localization";
import CS from "@theme/styles";
import { shareProfile } from "@utils/share.utils";
import IconSvg from "assets/svg";
import { TypedUser } from "models";

interface ActionMoreProps {
  data?: TypedUser;
}

const ActionMore = ({ data }: ActionMoreProps) => {
  const _share = () => {
    if (data?._id) {
      shareProfile(data?._id);
    }
  };
  const _report = () => {
    showSuperModal({
      styleModalType: EnumStyleModalType.Bottom,
      contentModalType: EnumModalContentType.Report,
      data: {
        report_type: "teacher",
        partner_id: data?._id,
      },
    });
  };
  return (
    <View style={styles.container}>
      {/* <Header
        onPressLeft={_closeSuperModal}
        text={translations.course.more}
        style={{ paddingHorizontal: 0 }}
      /> */}
      <TouchableOpacity onPress={_share} style={styles.viewItem}>
        <IconSvg name="icShare" size={25} />
        <Text style={styles.text}>{translations.post.share}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={_report} style={styles.viewItem}>
        <IconSvg name="icFlagPoint" size={25} />
        <Text style={styles.text}>{translations.report}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionMore;

const styles = StyleSheet.create({
  container: {
    marginBottom: getBottomSpace(),
    marginTop: 40,
  },
  viewItem: {
    flexDirection: "row",
    // paddingHorizontal: 16,
    marginTop: 8,
    height: 40,
    alignItems: "center",
  },
  text: {
    flex: 1,
    marginLeft: 8,
    ...CS.hnRegular,
  },
});
