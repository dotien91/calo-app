import { closeSuperModal } from "@helpers/super.modal.helper";
import { translations } from "@localization";
import Header from "@shared-components/header/Header";
import IconSvg from "assets/svg";
import { TypedUser } from "models";
import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { getBottomSpace } from "react-native-iphone-screen-helper";

interface ActionMoreProps {
  data?: TypedUser;
}

const ActionMore = ({ data }: ActionMoreProps) => {
  const _closeSuperModal = () => {
    closeSuperModal();
  };

  const _share = () => {
    console.log("share..", data);
    closeSuperModal();
  };
  const _report = () => {
    console.log("report...", data);
    closeSuperModal();
  };
  return (
    <View style={styles.container}>
      <Header
        onPressLeft={_closeSuperModal}
        text={translations.course.more}
        style={{ paddingHorizontal: 0 }}
      />
      <TouchableOpacity onPress={_share} style={styles.viewItem}>
        <IconSvg name="icShare" size={25} />
        <Text style={{ flex: 1, marginLeft: 8 }}>
          {translations.post.share}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={_report} style={styles.viewItem}>
        <IconSvg name="icFlagPoint" size={25} />
        <Text style={{ flex: 1, marginLeft: 8 }}>{translations.report}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionMore;

const styles = StyleSheet.create({
  container: {
    marginBottom: getBottomSpace(),
  },
  viewItem: {
    flexDirection: "row",
    // paddingHorizontal: 16,
    marginTop: 8,
    height: 40,
    alignItems: "center",
  },
});
